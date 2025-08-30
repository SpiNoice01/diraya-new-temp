// Debug script untuk masalah "Order not found" pada payment
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables tidak ditemukan!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugPaymentIssue() {
  console.log('🔍 Debugging "Order not found" issue...\n')

  try {
    // 1. Test koneksi Supabase
    console.log('1️⃣ Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message)
      return
    }
    console.log('✅ Supabase connection successful')

    // 2. Check orders table structure
    console.log('\n2️⃣ Checking orders table...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5)

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError.message)
      return
    }

    console.log(`📊 Found ${orders?.length || 0} orders`)
    if (orders && orders.length > 0) {
      console.log('📋 Sample orders:')
      orders.forEach((order, index) => {
        console.log(`   ${index + 1}. ID: ${order.id}`)
        console.log(`      User ID: ${order.user_id}`)
        console.log(`      Product ID: ${order.product_id}`)
        console.log(`      Payment Status: ${order.payment_status}`)
        console.log(`      Status: ${order.status}`)
        console.log(`      Created: ${order.created_at}`)
        console.log()
      })
    } else {
      console.log('❌ No orders found in database!')
    }

    // 3. Check users table
    console.log('3️⃣ Checking users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .limit(5)

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
    } else {
      console.log(`👥 Found ${users?.length || 0} users`)
      if (users && users.length > 0) {
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email} (${user.role}) - ID: ${user.id}`)
        })
      }
    }

    // 4. Check products table
    console.log('\n4️⃣ Checking products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, category')
      .limit(5)

    if (productsError) {
      console.error('❌ Error fetching products:', productsError.message)
    } else {
      console.log(`🛍️ Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        products.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - ID: ${product.id}`)
        })
      }
    }

    // 5. Test specific order query (like the one in create-token API)
    console.log('\n5️⃣ Testing order query with joins...')
    if (orders && orders.length > 0) {
      const testOrderId = orders[0].id
      console.log(`🧪 Testing query for order: ${testOrderId}`)
      
      const { data: orderWithJoins, error: joinError } = await supabase
        .from('orders')
        .select(`
          *,
          users:user_id(id, name, email, phone, address),
          products:product_id(id, name, description, price, category)
        `)
        .eq('id', testOrderId)
        .single()

      if (joinError) {
        console.error('❌ Error with joined query:', joinError.message)
        console.error('📋 Full error:', joinError)
      } else {
        console.log('✅ Joined query successful')
        console.log('📋 Order data structure:')
        console.log('   Order ID:', orderWithJoins.id)
        console.log('   User data:', orderWithJoins.users ? 'Present' : 'Missing')
        console.log('   Product data:', orderWithJoins.products ? 'Present' : 'Missing')
        
        if (orderWithJoins.users) {
          console.log(`   Customer: ${orderWithJoins.users.name} (${orderWithJoins.users.email})`)
        }
        if (orderWithJoins.products) {
          console.log(`   Product: ${orderWithJoins.products.name} - ${orderWithJoins.products.price}`)
        }
      }
    }

    // 6. Check dummy data IDs vs real IDs
    console.log('\n6️⃣ Checking ID format differences...')
    if (orders && orders.length > 0) {
      const realId = orders[0].id
      const dummyIds = ['ORD-001', 'ORD-002'] // From lib/data/orders.ts
      
      console.log(`🔍 Real Order ID format: "${realId}" (${typeof realId})`)
      console.log(`🔍 Dummy Order ID format: "${dummyIds[0]}" (${typeof dummyIds[0]})`)
      
      if (realId.includes('-') && realId.length < 20) {
        console.log('⚠️  Real ID looks like string format (not UUID)')
      } else if (realId.length === 36 && realId.includes('-')) {
        console.log('✅ Real ID looks like UUID format')
      } else {
        console.log('❓ Unknown ID format')
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run debug
debugPaymentIssue().then(() => {
  console.log('\n🏁 Debug completed!')
}).catch(console.error)
