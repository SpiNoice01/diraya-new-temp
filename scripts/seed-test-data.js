const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

async function seedTestData() {
  console.log('🌱 Seeding test data...\n')

  // Import Supabase client
  const { createClient } = require('@supabase/supabase-js')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing!')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // 1. Create test users
    console.log('1️⃣ Creating test users...')
    
    const testUsers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'customer@test.com',
        name: 'Test Customer',
        phone: '08123456789',
        address: 'Jl. Test No. 123, Jakarta',
        role: 'customer'
      },
      {
        id: '22222222-2222-2222-2222-222222222222', 
        email: 'admin@test.com',
        name: 'Test Admin',
        phone: '08987654321',
        address: 'Jl. Admin No. 456, Jakarta',
        role: 'admin'
      }
    ]

    for (const user of testUsers) {
      const { error } = await supabase
        .from('users')
        .upsert(user)
      
      if (error) {
        console.error(`❌ Error creating user ${user.email}:`, error)
      } else {
        console.log(`✅ Created user: ${user.email}`)
      }
    }

    // 2. Get available products
    console.log('\n2️⃣ Getting available products...')
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(3)
    
    if (productError || !products.length) {
      console.error('❌ No products available:', productError)
      return
    }

    console.log(`✅ Found ${products.length} products to use`)

    // 3. Create test orders
    console.log('\n3️⃣ Creating test orders...')
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const testOrders = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: testUsers[0].id, // customer
        product_id: products[0].id,
        quantity: 1,
        event_date: tomorrow.toISOString().split('T')[0],
        event_time: '12:00',
        total_amount: products[0].price,
        status: 'pending',
        payment_status: 'pending',
        notes: 'Test order untuk aqiqah anak'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_id: testUsers[0].id, // customer
        product_id: products[1].id,
        quantity: 2,
        event_date: tomorrow.toISOString().split('T')[0],
        event_time: '14:00',
        total_amount: products[1].price * 2,
        status: 'pending',
        payment_status: 'pending',
        notes: 'Test order kedua'
      }
    ]

    for (const order of testOrders) {
      const { error } = await supabase
        .from('orders')
        .upsert(order)
      
      if (error) {
        console.error(`❌ Error creating order ${order.id}:`, error)
      } else {
        console.log(`✅ Created order: ${order.id}`)
        console.log(`   - Product: ${products.find(p => p.id === order.product_id)?.name}`)
        console.log(`   - Amount: Rp ${order.total_amount.toLocaleString('id-ID')}`)
      }
    }

    // 4. Verify seeded data
    console.log('\n4️⃣ Verifying seeded data...')
    
    const { data: allUsers, error: userCountError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
    
    const { data: allOrders, error: orderCountError } = await supabase
      .from('orders')
      .select('count(*)', { count: 'exact' })
    
    console.log(`✅ Total users in database: ${allUsers?.[0]?.count || 0}`)
    console.log(`✅ Total orders in database: ${allOrders?.[0]?.count || 0}`)

    // 5. Test the payment API query
    console.log('\n5️⃣ Testing payment API query...')
    const testOrderId = testOrders[0].id
    
    const { data: orderWithJoins, error: joinError } = await supabase
      .from('orders')
      .select(`
        *,
        users!inner(id, name, email, phone, address),
        products!inner(id, name, description, price, category)
      `)
      .eq('id', testOrderId)
      .single()
    
    if (joinError) {
      console.error('❌ Join query failed:', joinError)
    } else {
      console.log('✅ Payment API query successful!')
      console.log(`   - Order ID: ${orderWithJoins.id}`)
      console.log(`   - Customer: ${orderWithJoins.users.name}`)
      console.log(`   - Product: ${orderWithJoins.products.name}`)
      console.log(`   - Amount: Rp ${orderWithJoins.total_amount.toLocaleString('id-ID')}`)
    }

    console.log('\n🎉 Test data seeding completed!')
    console.log('\n📋 Test Credentials:')
    console.log('   Email: customer@test.com')
    console.log('   Password: (use your auth system to create)')
    console.log('\n📝 Test Orders:')
    testOrders.forEach(order => {
      console.log(`   - ${order.id}: Rp ${order.total_amount.toLocaleString('id-ID')}`)
    })

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seeding
if (require.main === module) {
  seedTestData().catch(console.error)
}

module.exports = seedTestData
