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

async function testBooking() {
  console.log('🚀 Testing Booking Functionality...\n')

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

    // 2. Get user profile
    console.log('\n📋 Step 2: Get user profile...')
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ Failed to get user profile:', profileError.message)
      return
    }

    console.log('✅ User profile found:', userProfile.name)

    // 3. Get products
    console.log('\n📦 Step 3: Get available products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (productsError) {
      console.error('❌ Failed to get products:', productsError.message)
      return
    }

    if (!products || products.length === 0) {
      console.error('❌ No products found in database')
      return
    }

    const product = products[0]
    console.log('✅ Product found:', product.name)

    // 4. Create test order
    console.log('\n📝 Step 4: Create test order...')
    const orderData = {
      user_id: user.id,
      product_id: product.id,
      quantity: 2,
      event_date: '2024-12-25',
      event_time: '12:00:00',
      total_amount: product.price * 2,
      status: 'pending',
      payment_status: 'pending',
      notes: 'Test order from script',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('❌ Failed to create order:', orderError.message)
      return
    }

    console.log('✅ Order created successfully!')
    console.log('   Order ID:', order.id)
    console.log('   Total Amount:', order.total_amount)
    console.log('   Status:', order.status)

    // 5. Verify order in database
    console.log('\n🔍 Step 5: Verify order in database...')
    const { data: verifyOrder, error: verifyError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(name, email),
        products:product_id(name, price)
      `)
      .eq('id', order.id)
      .single()

    if (verifyError) {
      console.error('❌ Failed to verify order:', verifyError.message)
      return
    }

    console.log('✅ Order verified in database!')
    console.log('   Customer:', verifyOrder.users.name)
    console.log('   Product:', verifyOrder.products.name)
    console.log('   Quantity:', verifyOrder.quantity)
    console.log('   Event Date:', verifyOrder.event_date)

    // 6. Clean up - delete test order
    console.log('\n🧹 Step 6: Clean up test order...')
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)

    if (deleteError) {
      console.error('⚠️ Failed to delete test order:', deleteError.message)
    } else {
      console.log('✅ Test order cleaned up')
    }

    // 7. Logout
    console.log('\n👋 Step 7: Logout...')
    await supabase.auth.signOut()
    console.log('✅ Logged out successfully')

    console.log('\n🎉 Booking test completed successfully!')
    console.log('📝 Summary:')
    console.log('   ✅ Login works')
    console.log('   ✅ User profile accessible')
    console.log('   ✅ Products can be fetched')
    console.log('   ✅ Orders can be created')
    console.log('   ✅ Orders can be verified')
    console.log('   ✅ Database integration works')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testBooking()
