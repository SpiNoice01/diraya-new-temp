const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkData() {
  try {
    console.log('🔍 Checking database data...\n')
    
    // Check users
    console.log('👥 Users:')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
    } else {
      console.log(`Found ${users.length} users:`)
      users.forEach(user => {
        console.log(`  - ${user.email}: ${user.name} | Phone: ${user.phone || 'N/A'} | Address: ${user.address || 'N/A'}`)
      })
    }
    
    console.log('\n📦 Orders:')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(*),
        products:product_id(*)
      `)
    
    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
    } else {
      console.log(`Found ${orders.length} orders:`)
      orders.forEach(order => {
        console.log(`  - Order ${order.id}:`)
        console.log(`    User: ${order.users?.name || 'N/A'} (${order.users?.email || 'N/A'})`)
        console.log(`    Product: ${order.products?.name || 'N/A'}`)
        console.log(`    Status: ${order.status}`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkData()
