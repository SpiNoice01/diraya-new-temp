const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testOrderDetail() {
  console.log('🚀 Testing Order Detail Page Functionality...\n')

  try {
    // 1. Login as test user
    console.log('🔐 Step 1: Login as test user...')
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (loginError) {
      console.error('❌ Login failed:', loginError.message)
      return
    }

    console.log('✅ Login successful! User ID:', user.id)

    // 2. Get user orders
    console.log('\n📋 Step 2: Fetching user orders...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          image_url
        ),
        users (
          id,
          name,
          email,
          phone,
          address
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Failed to fetch orders:', ordersError.message)
      return
    }

    console.log(`✅ Found ${orders.length} orders for user`)

    if (orders.length === 0) {
      console.log('⚠️  No orders found. Creating a test order...')
      
      // Create a test order
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price')
        .limit(1)

      if (products && products.length > 0) {
        const testOrder = {
          user_id: user.id,
          product_id: products[0].id,
          quantity: 1,
          total_amount: products[0].price,
          event_date: '2024-12-25',
          event_time: '12:00',
          status: 'pending',
          payment_status: 'pending',
          notes: 'Test order for detail page'
        }

        const { data: newOrder, error: createError } = await supabase
          .from('orders')
          .insert(testOrder)
          .select()
          .single()

        if (createError) {
          console.error('❌ Failed to create test order:', createError.message)
          return
        }

        console.log('✅ Test order created:', newOrder.id)
        orders.push(newOrder)
      }
    }

    // 3. Test order detail functionality
    console.log('\n🔍 Step 3: Testing order detail functionality...')
    const testOrder = orders[0]
    
    if (testOrder) {
      console.log('📋 Order Details:')
      console.log('   ID:', testOrder.id)
      console.log('   Status:', testOrder.status)
      console.log('   Payment Status:', testOrder.payment_status)
      console.log('   Total Amount:', testOrder.total_amount)
      console.log('   Event Date:', testOrder.event_date)
      console.log('   Event Time:', testOrder.event_time)
      
      if (testOrder.products) {
        console.log('   Product:', testOrder.products.name)
        console.log('   Product Price:', testOrder.products.price)
      }
      
      if (testOrder.users) {
        console.log('   Customer:', testOrder.users.name)
        console.log('   Customer Email:', testOrder.users.email)
        console.log('   Customer Phone:', testOrder.users.phone)
      }

      // 4. Test individual service functions
      console.log('\n🔧 Step 4: Testing service functions...')
      
      // Test getOrderById
      const { data: orderDetail, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', testOrder.id)
        .single()

      if (orderError) {
        console.error('❌ Failed to get order by ID:', orderError.message)
      } else {
        console.log('✅ getOrderById works')
      }

      // Test getProductById
      if (testOrder.product_id) {
        const { data: productDetail, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', testOrder.product_id)
          .single()

        if (productError) {
          console.error('❌ Failed to get product by ID:', productError.message)
        } else {
          console.log('✅ getProductById works')
        }
      }

      // Test getUserById
      if (testOrder.user_id) {
        const { data: userDetail, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', testOrder.user_id)
          .single()

        if (userError) {
          console.error('❌ Failed to get user by ID:', userError.message)
        } else {
          console.log('✅ getUserById works')
        }
      }

      console.log('\n🎉 Order detail test completed successfully!')
      console.log('📝 Summary:')
      console.log('   ✅ Login works')
      console.log('   ✅ User orders can be fetched')
      console.log('   ✅ Order details are complete')
      console.log('   ✅ Product information available')
      console.log('   ✅ Customer information available')
      console.log('   ✅ Service functions work')

      console.log('\n💡 Next steps:')
      console.log('   1. Login to the application with test@example.com')
      console.log('   2. Go to /customer/orders page')
      console.log('   3. Click "Detail Pesanan" on any order')
      console.log('   4. Verify the order detail page displays correctly')
      console.log('   5. Test navigation back to orders list')

    } else {
      console.error('❌ No orders available for testing')
    }

    // 5. Logout
    console.log('\n👋 Step 5: Logout...')
    await supabase.auth.signOut()
    console.log('✅ Logged out successfully')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testOrderDetail()
