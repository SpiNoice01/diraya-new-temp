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

async function checkAndFixUserData() {
  try {
    console.log('🔍 Checking user data...')
    
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching users:', error)
      return
    }

    console.log(`Found ${users.length} users`)
    
    let fixedCount = 0
    
    for (const user of users) {
      let needsUpdate = false
      const updates = {}
      
      // Check if phone is empty or null
      if (!user.phone || user.phone.trim() === '') {
        updates.phone = '081234567890' // Default phone
        needsUpdate = true
        console.log(`📱 User ${user.email}: Phone is empty, setting default`)
      }
      
      // Check if address is empty or null
      if (!user.address || user.address.trim() === '') {
        updates.address = 'Jl. Default No. 123' // Default address
        needsUpdate = true
        console.log(`📍 User ${user.email}: Address is empty, setting default`)
      }
      
      // Check if name is empty or null
      if (!user.name || user.name.trim() === '') {
        updates.name = user.email.split('@')[0] // Use email prefix as name
        needsUpdate = true
        console.log(`👤 User ${user.email}: Name is empty, setting from email`)
      }
      
      if (needsUpdate) {
        updates.updated_at = new Date().toISOString()
        
        const { error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
        
        if (updateError) {
          console.error(`❌ Error updating user ${user.email}:`, updateError)
        } else {
          console.log(`✅ Updated user ${user.email}`)
          fixedCount++
        }
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} users`)
    
    // Show final user data
    console.log('\n📊 Final user data:')
    const { data: finalUsers } = await supabase
      .from('users')
      .select('id, email, name, phone, address, role')
    
    finalUsers?.forEach(user => {
      console.log(`- ${user.email}: ${user.name} | ${user.phone} | ${user.address}`)
    })
    
  } catch (error) {
    console.error('Error checking user data:', error)
  }
}

// Check orders and their user data
async function checkOrderUserData() {
  try {
    console.log('\n🔍 Checking order user data...')
    
    // Get all orders with user data
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(*)
      `)
    
    if (error) {
      console.error('Error fetching orders:', error)
      return
    }

    console.log(`Found ${orders.length} orders`)
    
    for (const order of orders) {
      console.log(`\n📦 Order ${order.id}:`)
      console.log(`   User ID: ${order.user_id}`)
      console.log(`   User Data:`, order.users)
      
      if (!order.users) {
        console.log(`   ⚠️  No user data found for order ${order.id}`)
      } else {
        console.log(`   ✅ User data found: ${order.users.name} (${order.users.email})`)
      }
    }
    
  } catch (error) {
    console.error('Error checking order user data:', error)
  }
}

// Run the functions
async function main() {
  console.log('🚀 Checking and fixing user data...\n')
  
  await checkAndFixUserData()
  await checkOrderUserData()
  
  console.log('\n🎉 User data check completed!')
}

main()
