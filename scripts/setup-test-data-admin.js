// Script untuk setup test data menggunakan service role key (bypass RLS)
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables tidak ditemukan!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET')
  console.log('\n💡 Pastikan file .env.local memiliki:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTestData() {
  console.log('🛠️ Setting up test data with admin privileges...\n')

  try {
    // 1. Create test customer user
    console.log('1️⃣ Creating test customer...')
    
    const { data: existingCustomers } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'customer@test.com')
    
    let customerId
    if (existingCustomers && existingCustomers.length > 0) {
      customerId = existingCustomers[0].id
      console.log('✅ Test customer already exists:', customerId)
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('users')
        .insert({
          email: 'customer@test.com',
          name: 'Ahmad Wijaya',
          phone: '+6281234567891',
          address: 'Jl. Merdeka No. 123, Jakarta Selatan',
          role: 'customer'
        })
        .select()
        .single()

      if (customerError) {
        console.error('❌ Error creating customer:', customerError.message)
        console.error('Full error:', customerError)
        return
      }
      customerId = newCustomer.id
      console.log('✅ Customer created:', customerId)
    }

    // 2. Get product IDs
    console.log('\n2️⃣ Getting product IDs...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3)

    if (productsError || !products || products.length === 0) {
      console.error('❌ No products found:', productsError?.message)
      console.log('💡 Run: node scripts/supabase-setup.sql first')
      return
    }

    console.log(`✅ Found ${products.length} products`)
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - Rp ${product.price.toLocaleString()}`)
    })

    // 3. Create test orders
    console.log('\n3️⃣ Creating test orders...')
    
    // Check existing orders first
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', customerId)

    if (existingOrders && existingOrders.length > 0) {
      console.log(`✅ ${existingOrders.length} orders already exist for customer`)
      
      // Show existing order IDs  
      console.log('📋 Existing order IDs:')
      existingOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.id} (${order.status}/${order.payment_status})`)
      })
      
      // Test payment for first pending order
      const pendingOrder = existingOrders.find(o => o.payment_status === 'pending')
      if (pendingOrder) {
        console.log(`\n🎯 You can test payment with Order ID: ${pendingOrder.id}`)
      }
      
    } else {
      const testOrders = [
        {
          user_id: customerId,
          product_id: products[0].id,
          quantity: 1,
          event_date: '2024-12-25',
          event_time: '12:00:00',
          total_amount: products[0].price,
          status: 'pending',
          payment_status: 'pending',
          notes: 'Test order untuk debugging payment - silakan coba bayar'
        },
        {
          user_id: customerId,
          product_id: products[1].id,
          quantity: 1,
          event_date: '2024-12-28',
          event_time: '11:30:00',
          total_amount: products[1].price,
          status: 'confirmed',
          payment_status: 'paid',
          notes: 'Test order yang sudah dibayar - untuk referensi'
        }
      ]

      const { data: newOrders, error: ordersError } = await supabase
        .from('orders')
        .insert(testOrders)
        .select()

      if (ordersError) {
        console.error('❌ Error creating orders:', ordersError.message)
        console.error('Full error:', ordersError)
        return
      }

      console.log(`✅ Created ${newOrders.length} test orders`)
      newOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.id} - ${order.status}/${order.payment_status}`)
      })
      
      const pendingOrder = newOrders.find(o => o.payment_status === 'pending')
      if (pendingOrder) {
        console.log(`\n🎯 You can test payment with Order ID: ${pendingOrder.id}`)
      }
    }

    // 4. Verify the complete data structure
    console.log('\n4️⃣ Verifying data structure...')
    const { data: verifyOrder, error: verifyError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(id, name, email, phone, address),
        products:product_id(id, name, description, price, category)
      `)
      .eq('user_id', customerId)
      .eq('payment_status', 'pending')
      .limit(1)
      .single()

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message)
    } else if (verifyOrder) {
      console.log('✅ Data structure verified')
      console.log(`   Order ID: ${verifyOrder.id}`)
      console.log(`   Customer: ${verifyOrder.users?.name || 'N/A'}`)
      console.log(`   Product: ${verifyOrder.products?.name || 'N/A'}`)
      console.log(`   Amount: Rp ${verifyOrder.total_amount?.toLocaleString() || 'N/A'}`)
    }

    // 5. Summary with instructions
    console.log('\n✅ Test data setup completed!')
    console.log('\n📋 Summary:')
    console.log(`👤 Test Customer: customer@test.com (ID: ${customerId})`)
    console.log('📦 Orders: Created with pending payment status')
    console.log('\n🎯 Testing Steps:')
    console.log('1. Open: https://45c7c3ed876f.ngrok-free.app/customer/orders')
    console.log('2. Login or use the customer data above')
    console.log('3. Click "Bayar Sekarang" on pending orders')
    console.log('4. Payment should now work!')
    
    console.log('\n💡 Note: If still getting "Order not found", check:')
    console.log('- Supabase connection in browser')
    console.log('- Auth context and user login')
    console.log('- Order IDs match between frontend and backend')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run setup
setupTestData().then(() => {
  console.log('\n🏁 Setup completed!')
}).catch(console.error)
