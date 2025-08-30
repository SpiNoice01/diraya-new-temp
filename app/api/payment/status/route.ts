import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking payment status for order:', orderId)

    // Get transaction status from Midtrans
    const status = await PaymentService.getTransactionStatus(orderId)

    console.log('📊 Payment status retrieved:', status)

    return NextResponse.json({
      order_id: orderId,
      transaction_status: status.transaction_status,
      payment_type: status.payment_type,
      transaction_time: status.transaction_time,
      settlement_time: status.settlement_time,
      gross_amount: status.gross_amount,
      status_code: status.status_code,
      status_message: status.status_message
    })

  } catch (error: any) {
    console.error('❌ Error checking payment status:', error)
    
    return NextResponse.json(
      { error: error.message || 'Failed to check payment status' },
      { status: 500 }
    )
  }
}

