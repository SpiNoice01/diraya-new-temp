import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import type { MidtransNotification } from '@/lib/midtrans/config'

export async function POST(request: NextRequest) {
  try {
    const notification: MidtransNotification = await request.json()
    
    console.log('📥 Received Midtrans webhook notification:', notification)

    // Handle the payment notification
    await PaymentService.handlePaymentNotification(notification)

    console.log('✅ Webhook processed successfully')

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      order_id: notification.order_id,
      status: notification.transaction_status
    })

  } catch (error: any) {
    console.error('❌ Error processing webhook:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Webhook processing failed',
        message: 'Failed to process payment notification'
      },
      { status: 500 }
    )
  }
}

// Handle GET request for webhook testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Midtrans webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}

