// Script untuk test payment flow end-to-end
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testPaymentFlow() {
  console.log('🧪 Testing payment flow end-to-end...\n')

  try {
    // 1. Get a pending order
    console.log('1️⃣ Finding pending order...')
    const { data: pendingOrders, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(id, name, email, phone, address),
        products:product_id(id, name, description, price, category)
      `)
      .eq('payment_status', 'pending')
      .limit(1)

    if (orderError || !pendingOrders || pendingOrders.length === 0) {
      console.error('❌ No pending orders found')
      console.log('💡 Run: node scripts/setup-test-data-admin.js first')
      return
    }

    const testOrder = pendingOrders[0]
    console.log('✅ Found pending order:')
    console.log(`   ID: ${testOrder.id}`)
    console.log(`   Customer: ${testOrder.users?.name}`)
    console.log(`   Product: ${testOrder.products?.name}`)
    console.log(`   Amount: Rp ${testOrder.total_amount?.toLocaleString()}`)

    // 2. Test the API endpoint logic (simulate what create-token does)
    console.log('\n2️⃣ Testing create-token API logic...')
    
    if (!testOrder.users) {
      console.error('❌ Missing user data in order')
      return
    }
    
    if (!testOrder.products) {
      console.error('❌ Missing product data in order')  
      return
    }

    // Check if order is already paid
    if (testOrder.payment_status === 'paid') {
      console.log('⚠️  Order is already paid')
      return
    }

    // Simulate PaymentService.formatCustomerData
    const nameParts = testOrder.users.name.trim().split(' ')
    const customerData = {
      first_name: nameParts[0] || 'Customer',
      last_name: nameParts.slice(1).join(' ') || undefined,
      email: testOrder.users.email,
      phone: testOrder.users.phone || '08123456789'
    }

    // Simulate PaymentService.formatItems
    const items = [{
      id: testOrder.products.id,
      price: testOrder.products.price,
      quantity: testOrder.quantity,
      name: testOrder.products.name,
      category: testOrder.products.category || 'Katering'
    }]

    console.log('✅ Customer data formatted:')
    console.log(`   Name: ${customerData.first_name} ${customerData.last_name || ''}`)
    console.log(`   Email: ${customerData.email}`)
    console.log(`   Phone: ${customerData.phone}`)

    console.log('✅ Items formatted:')
    console.log(`   Product: ${items[0].name}`)
    console.log(`   Price: Rp ${items[0].price?.toLocaleString()}`)
    console.log(`   Quantity: ${items[0].quantity}`)

    // 3. Test what Midtrans would receive
    console.log('\n3️⃣ Testing Midtrans parameter structure...')
    
    const midtransParameter = {
      transaction_details: {
        order_id: testOrder.id,
        gross_amount: testOrder.total_amount,
      },
      customer_details: customerData,
      item_details: items,
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?order=${testOrder.id}`,
        unfinish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending?order=${testOrder.id}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/error?order=${testOrder.id}`,
      },
    }

    console.log('✅ Midtrans parameter would be:')
    console.log('   Order ID:', midtransParameter.transaction_details.order_id)
    console.log('   Amount:', midtransParameter.transaction_details.gross_amount)
    console.log('   Customer:', `${midtransParameter.customer_details.first_name} (${midtransParameter.customer_details.email})`)
    console.log('   Success URL:', midtransParameter.callbacks.finish)

    // 4. Check Midtrans environment
    console.log('\n4️⃣ Checking Midtrans configuration...')
    
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY
    const midtransClientKey = process.env.MIDTRANS_CLIENT_KEY || process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const midtransEnv = process.env.MIDTRANS_ENVIRONMENT || 'sandbox'

    console.log('   Server Key:', midtransServerKey ? 'SET' : 'NOT SET')
    console.log('   Client Key:', midtransClientKey ? 'SET' : 'NOT SET')  
    console.log('   Environment:', midtransEnv)
    console.log('   App URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET')

    if (!midtransServerKey || !midtransClientKey) {
      console.log('⚠️  Midtrans credentials missing - payment will fail')
    } else {
      console.log('✅ Midtrans credentials configured')
    }

    // 5. Summary
    console.log('\n✅ Payment flow test completed!')
    console.log('\n🎯 Test Results:')
    console.log(`📦 Order Data: Valid (${testOrder.id})`)
    console.log(`👤 Customer Data: Valid (${testOrder.users.name})`) 
    console.log(`🛍️  Product Data: Valid (${testOrder.products.name})`)
    console.log(`💰 Amount: Rp ${testOrder.total_amount?.toLocaleString()}`)
    console.log(`🔧 Midtrans Config: ${midtransServerKey && midtransClientKey ? 'Complete' : 'Missing'}`)

    console.log('\n🚀 Ready to test payment!')
    console.log(`📋 Order ID for testing: ${testOrder.id}`)
    console.log('💳 Go to /customer/orders and click "Bayar Sekarang"')

  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

// Run test
testPaymentFlow().then(() => {
  console.log('\n🏁 Test completed!')
}).catch(console.error)
