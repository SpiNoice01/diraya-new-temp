// Create Test Orders for Customer
// Run this script to add test orders to the database

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function createTestOrders() {
  console.log('🔧 Creating test orders...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // First, get a test user
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'customer')
      .limit(1)

    if (usersError) {
      throw usersError
    }

    if (!users || users.length === 0) {
      console.log('❌ No customer users found. Please create a test user first.')
      return
    }

    const testUser = users[0]
    console.log('✅ Found test user:', testUser.email)

    // Get products to use for orders
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3)

    if (productsError) {
      throw productsError
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found. Please create products first.')
      return
    }

    console.log('✅ Found products:', products.length)

    // Create test orders
    const testOrders = [
      {
        user_id: testUser.id,
        product_id: products[0].id,
        quantity: 1,
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        event_time: '12:00',
        total_amount: products[0].price,
        status: 'pending',
        payment_status: 'pending',
        notes: 'Mohon disiapkan dengan baik untuk acara aqiqah keluarga',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: testUser.id,
        product_id: products[1]?.id || products[0].id,
        quantity: 2,
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
        event_time: '18:00',
        total_amount: (products[1]?.price || products[0].price) * 2,
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'Acara besar, mohon perhatian khusus',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updated_at: new Date().toISOString(),
      },
      {
        user_id: testUser.id,
        product_id: products[2]?.id || products[0].id,
        quantity: 1,
        event_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
        event_time: '10:00',
        total_amount: products[2]?.price || products[0].price,
        status: 'completed',
        payment_status: 'paid',
        notes: 'Terima kasih, acara berjalan lancar',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    console.log('📝 Creating test orders...')

    for (const order of testOrders) {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(order)
        .select()

      if (orderError) {
        console.warn('⚠️ Error creating order:', orderError.message)
      } else {
        console.log('✅ Created order:', orderData[0].id)
      }
    }

    // Verify orders were created
    const { data: userOrders, error: verifyError } = await supabase
      .from('orders')
      .select(`
        *,
        products:product_id(name, price),
        users:user_id(name, email)
      `)
      .eq('user_id', testUser.id)

    if (verifyError) {
      console.warn('⚠️ Error verifying orders:', verifyError.message)
    } else {
      console.log('\n🎉 Test orders created successfully!')
      console.log(`📊 Total orders for user: ${userOrders.length}`)
      
      userOrders.forEach((order, index) => {
        console.log(`\nOrder ${index + 1}:`)
        console.log(`  ID: ${order.id}`)
        console.log(`  Product: ${order.products?.name || 'N/A'}`)
        console.log(`  Status: ${order.status}`)
        console.log(`  Payment: ${order.payment_status}`)
        console.log(`  Total: Rp ${order.total_amount.toLocaleString()}`)
      })
    }

    console.log('\n📝 Next steps:')
    console.log('1. Login with the test user account')
    console.log('2. Visit /customer/orders to see the orders')
    console.log('3. Test the filtering and search functionality')

  } catch (error) {
    console.error('❌ Error creating test orders:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check your Supabase project settings')
    console.log('2. Verify your service role key has admin permissions')
    console.log('3. Make sure users and products exist in the database')
  }
}

createTestOrders()
