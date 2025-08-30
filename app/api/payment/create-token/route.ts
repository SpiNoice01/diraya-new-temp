import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    console.log('📝 Creating payment token for order:', orderId)

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(id, name, email, phone, address),
        products:product_id(id, name, description, price, category)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      )
    }

    // Format customer data
    const customerData = PaymentService.formatCustomerData(order.users)

    // Format items
    const items = PaymentService.formatItems(order, order.products)

    // Create payment token
    const token = await PaymentService.createPaymentToken(
      orderId,
      order.total_amount,
      customerData,
      items,
      {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order=${orderId}`,
        unfinish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending?order=${orderId}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/error?order=${orderId}`,
      }
    )

    console.log('✅ Payment token created successfully for order:', orderId)

    return NextResponse.json({
      token,
      order: {
        id: order.id,
        total_amount: order.total_amount,
        customer_name: order.users.name,
        product_name: order.products.name,
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating payment token:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

