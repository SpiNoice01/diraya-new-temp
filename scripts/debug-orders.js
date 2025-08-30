const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

async function debugOrders() {
  console.log('🔍 Debugging Orders Data...\n')

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
    // 1. Check orders table
    console.log('1️⃣ Checking orders table...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(10)
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
    } else {
      console.log(`✅ Found ${orders.length} orders:`)
      orders.forEach(order => {
        console.log(`   - Order ID: ${order.id}`)
        console.log(`     User ID: ${order.user_id}`)
        console.log(`     Product ID: ${order.product_id}`)
        console.log(`     Status: ${order.status} | Payment: ${order.payment_status}`)
        console.log(`     Amount: ${order.total_amount}`)
        console.log('')
      })
    }

    // 2. Check users table
    console.log('2️⃣ Checking users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .limit(5)
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError)
    } else {
      console.log(`✅ Found ${users.length} users:`)
      users.forEach(user => {
        console.log(`   - User ID: ${user.id} | Name: ${user.name} | Email: ${user.email}`)
      })
      console.log('')
    }

    // 3. Check products table
    console.log('3️⃣ Checking products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
    } else {
      console.log(`✅ Found ${products.length} products:`)
      products.forEach(product => {
        console.log(`   - Product ID: ${product.id} | Name: ${product.name} | Price: ${product.price}`)
      })
      console.log('')
    }

    // 4. Test join query (same as API)
    if (orders.length > 0) {
      console.log('4️⃣ Testing join query (same as payment API)...')
      const testOrderId = orders[0].id
      console.log(`Testing with Order ID: ${testOrderId}`)
      
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
        
        // Try without joins
        console.log('🔄 Trying query without joins...')
        const { data: simpleOrder, error: simpleError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', testOrderId)
          .single()
        
        if (simpleError) {
          console.error('❌ Simple query also failed:', simpleError)
        } else {
          console.log('✅ Simple query works:', simpleOrder)
          
          // Check if user exists
          const { data: userExists, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', simpleOrder.user_id)
            .single()
          
          if (userError) {
            console.error('❌ User not found for this order:', userError)
          } else {
            console.log('✅ User found:', userExists.name)
          }
          
          // Check if product exists
          const { data: productExists, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', simpleOrder.product_id)
            .single()
          
          if (productError) {
            console.error('❌ Product not found for this order:', productError)
          } else {
            console.log('✅ Product found:', productExists.name)
          }
        }
      } else {
        console.log('✅ Join query successful!')
        console.log('Order details:')
        console.log(`   - Customer: ${orderWithJoins.users.name}`)
        console.log(`   - Product: ${orderWithJoins.products.name}`)
        console.log(`   - Amount: ${orderWithJoins.total_amount}`)
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
if (require.main === module) {
  debugOrders().catch(console.error)
}

module.exports = debugOrders
