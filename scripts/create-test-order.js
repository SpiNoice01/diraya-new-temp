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

async function createTestOrder() {
  try {
    console.log('🚀 Creating test order...\n')
    
    // First, get or create a user
    console.log('👤 Getting/Creating test user...')
    
    // Check if test user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single()
    
    let userId
    
    if (existingUser) {
      console.log('✅ Test user found:', existingUser.email)
      userId = existingUser.id
      
      // Update user data if needed
      if (!existingUser.phone || !existingUser.address) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            phone: '081234567890',
            address: 'Jl. Test No. 123, Jakarta',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
        
        if (updateError) {
          console.error('Error updating user:', updateError)
        } else {
          console.log('✅ User data updated')
        }
      }
    } else {
      console.log('❌ Test user not found. Please run create-test-user.js first.')
      return
    }
    
    // Get or create a product
    console.log('\n📦 Getting/Creating test product...')
    
    const { data: existingProduct } = await supabase
      .from('products')
      .select('*')
      .eq('name', 'Paket Ekonomis 50 Porsi')
      .single()
    
    let productId
    
    if (existingProduct) {
      console.log('✅ Test product found:', existingProduct.name)
      productId = existingProduct.id
    } else {
      console.log('📝 Creating test product...')
      
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: 'Paket Ekonomis 50 Porsi',
          description: 'Paket ekonomis untuk acara aqiqah menengah dengan cita rasa autentik dan porsi yang cukup',
          price: 1200000,
          image_url: '/placeholder.jpg',
          category: 'ekonomis',
          servings: 50,
          features: ['Nasi', 'Ayam Goreng', 'Sayur', 'Minuman'],
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (productError) {
        console.error('Error creating product:', productError)
        return
      }
      
      console.log('✅ Test product created:', newProduct.name)
      productId = newProduct.id
    }
    
    // Create test order
    console.log('\n📋 Creating test order...')
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity: 1,
        event_date: '2025-09-02',
        event_time: '20:10:00',
        total_amount: 1200000,
        status: 'pending',
        payment_status: 'pending',
        notes: 'Test order untuk demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        users:user_id(*),
        products:product_id(*)
      `)
      .single()
    
    if (orderError) {
      console.error('Error creating order:', orderError)
      return
    }
    
    console.log('✅ Test order created successfully!')
    console.log('\n📊 Order Details:')
    console.log(`  Order ID: ${order.id}`)
    console.log(`  User: ${order.users?.name} (${order.users?.email})`)
    console.log(`  Phone: ${order.users?.phone}`)
    console.log(`  Address: ${order.users?.address}`)
    console.log(`  Product: ${order.products?.name}`)
    console.log(`  Total: Rp ${order.total_amount.toLocaleString('id-ID')}`)
    console.log(`  Status: ${order.status}`)
    console.log(`  Payment Status: ${order.payment_status}`)
    
    console.log('\n🎉 Test order created! You can now check the orders page.')
    
  } catch (error) {
    console.error('Error creating test order:', error)
  }
}

createTestOrder()
