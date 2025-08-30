// Script untuk setup test data untuk development
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables tidak ditemukan!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupTestData() {
  console.log('🛠️ Setting up test data for development...\n')

  try {
    // 1. Create test user
    console.log('1️⃣ Creating test user...')
    
    // First, check if admin user exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@kateringaqiqah.com')
    
    let userId
    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id
      console.log('✅ Admin user already exists:', userId)
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: 'admin@kateringaqiqah.com',
          name: 'Administrator',
          phone: '+6281234567890',
          address: 'Jl. Admin No. 1, Jakarta',
          role: 'admin'
        })
        .select()
        .single()

      if (userError) {
        console.error('❌ Error creating user:', userError.message)
        return
      }
      userId = newUser.id
      console.log('✅ User created:', userId)
    }

    // 2. Create test customer
    console.log('\n2️⃣ Creating test customer...')
    
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
        return
      }
      customerId = newCustomer.id
      console.log('✅ Customer created:', customerId)
    }

    // 3. Get product IDs
    console.log('\n3️⃣ Getting product IDs...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3)

    if (productsError || !products || products.length === 0) {
      console.error('❌ No products found. Run supabase setup first!')
      return
    }

    console.log(`✅ Found ${products.length} products`)
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price}`)
    })

    // 4. Create test orders
    console.log('\n4️⃣ Creating test orders...')
    
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
        notes: 'Test order untuk debugging payment'
      },
      {
        user_id: customerId,
        product_id: products[1].id,
        quantity: 2,
        event_date: '2024-12-28',
        event_time: '11:30:00',
        total_amount: products[1].price * 2,
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'Test order yang sudah dibayar'
      }
    ]

    // Check if orders already exist for this customer
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
    } else {
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
    }

    // 5. Summary
    console.log('\n✅ Test data setup completed!')
    console.log('\n📋 Summary:')
    console.log(`👤 Test Customer: customer@test.com (ID: ${customerId})`)
    console.log(`🔐 Password: customer123 (if using Auth)`)
    console.log('📦 Orders: Created with both pending and paid status')
    console.log('\n🎯 Next steps:')
    console.log('1. Login as customer@test.com')
    console.log('2. Go to /customer/orders')
    console.log('3. Try payment on pending orders')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run setup
setupTestData().then(() => {
  console.log('\n🏁 Setup completed!')
}).catch(console.error)
