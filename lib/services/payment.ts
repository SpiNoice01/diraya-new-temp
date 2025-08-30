import { snap, coreApi } from '@/lib/midtrans/config'
import type { 
  MidtransParameter, 
  MidtransCustomer, 
  MidtransItem,
  MidtransNotification 
} from '@/lib/midtrans/config'
import { supabase } from '@/lib/supabase/client'
import crypto from 'crypto'

export class PaymentService {
  /**
   * Create payment token for Snap
   */
  static async createPaymentToken(
    orderId: string,
    amount: number,
    customerData: MidtransCustomer,
    items: MidtransItem[],
    callbacks?: {
      finish?: string
      unfinish?: string
      error?: string
    }
  ): Promise<string> {
    try {
      const parameter: MidtransParameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: customerData,
        item_details: items,
        credit_card: {
          secure: true,
        },
        callbacks: {
          finish: callbacks?.finish || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          unfinish: callbacks?.unfinish || `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
          error: callbacks?.error || `${process.env.NEXT_PUBLIC_APP_URL}/payment/error`,
        },
      }

      console.log('🔄 Creating Midtrans payment token with parameter:', JSON.stringify(parameter, null, 2))

      const transaction = await snap.createTransaction(parameter)
      
      if (!transaction.token) {
        throw new Error('Failed to create payment token')
      }

      console.log('✅ Payment token created successfully:', transaction.token)
      
      return transaction.token
    } catch (error: any) {
      console.error('❌ Error creating payment token:', error)
      throw new Error(`Failed to create payment token: ${error.message}`)
    }
  }

  /**
   * Get transaction status from Midtrans
   */
  static async getTransactionStatus(orderId: string): Promise<any> {
    try {
      console.log('🔍 Getting transaction status for order:', orderId)
      
      const statusResponse = await coreApi.transaction.status(orderId)
      
      console.log('📊 Transaction status response:', statusResponse)
      
      return statusResponse
    } catch (error: any) {
      console.error('❌ Error getting transaction status:', error)
      throw new Error(`Failed to get transaction status: ${error.message}`)
    }
  }

  /**
   * Verify webhook notification signature
   */
  static verifySignature(notification: MidtransNotification): boolean {
    try {
      const { order_id, status_code, gross_amount, signature_key } = notification
      const serverKey = process.env.MIDTRANS_SERVER_KEY!
      
      const hash = crypto
        .createHash('sha512')
        .update(order_id + status_code + gross_amount + serverKey)
        .digest('hex')
      
      const isValid = hash === signature_key
      
      console.log('🔐 Signature verification:', isValid ? '✅ Valid' : '❌ Invalid')
      
      return isValid
    } catch (error) {
      console.error('❌ Error verifying signature:', error)
      return false
    }
  }

  /**
   * Handle payment notification from Midtrans webhook
   */
  static async handlePaymentNotification(notification: MidtransNotification): Promise<void> {
    try {
      console.log('📥 Processing payment notification:', notification)

      // Verify signature
      if (!this.verifySignature(notification)) {
        throw new Error('Invalid signature')
      }

      const { order_id, transaction_status, payment_type, transaction_time } = notification
      
      // Update order payment status based on transaction status
      let paymentStatus: 'pending' | 'paid' | 'failed' = 'pending'
      let orderStatus = 'pending'

      switch (transaction_status) {
        case 'capture':
        case 'settlement':
          paymentStatus = 'paid'
          orderStatus = 'confirmed'
          break
        case 'pending':
          paymentStatus = 'pending'
          orderStatus = 'pending'
          break
        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
          paymentStatus = 'failed'
          orderStatus = 'cancelled'
          break
      }

      // Update order in database
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order_id)

      if (orderError) {
        throw new Error(`Failed to update order: ${orderError.message}`)
      }

      // Create or update payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .upsert({
          order_id,
          amount: parseFloat(notification.gross_amount),
          payment_method: payment_type,
          status: paymentStatus === 'paid' ? 'completed' : 
                  paymentStatus === 'failed' ? 'failed' : 'pending',
          transaction_id: notification.transaction_id,
          payment_date: paymentStatus === 'paid' ? transaction_time : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'order_id'
        })

      if (paymentError) {
        console.error('⚠️ Warning: Failed to update payment record:', paymentError)
      }

      console.log(`✅ Payment notification processed successfully for order ${order_id}`)
    } catch (error: any) {
      console.error('❌ Error handling payment notification:', error)
      throw error
    }
  }

  /**
   * Cancel transaction
   */
  static async cancelTransaction(orderId: string): Promise<void> {
    try {
      console.log('🚫 Cancelling transaction for order:', orderId)
      
      await coreApi.transaction.cancel(orderId)
      
      // Update order status in database
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`)
      }

      console.log('✅ Transaction cancelled successfully')
    } catch (error: any) {
      console.error('❌ Error cancelling transaction:', error)
      throw new Error(`Failed to cancel transaction: ${error.message}`)
    }
  }

  /**
   * Format customer data for Midtrans
   */
  static formatCustomerData(user: any): MidtransCustomer {
    const nameParts = user.name.trim().split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || undefined

    return {
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone: user.phone || '08123456789', // Default phone if not provided
    }
  }

  /**
   * Format items for Midtrans
   */
  static formatItems(order: any, product: any): MidtransItem[] {
    return [{
      id: product.id,
      price: product.price,
      quantity: order.quantity,
      name: product.name,
      category: product.category || 'Katering',
    }]
  }
}

