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

async function createMultipleTestOrders() {
  try {
    console.log('🚀 Creating multiple test orders...\n')
    
    // Get test user
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single()
    
    if (!user) {
      console.log('❌ Test user not found. Please run create-test-user.js first.')
      return
    }
    
    console.log('✅ Test user found:', user.email)
    
    // Get or create products
    const products = [
      {
        name: 'Paket Ekonomis 50 Porsi',
        description: 'Paket ekonomis untuk acara aqiqah menengah dengan cita rasa autentik dan porsi yang cukup',
        price: 1200000,
        category: 'ekonomis',
        servings: 50,
      },
      {
        name: 'Paket Standar 75 Porsi',
        description: 'Paket standar dengan menu lengkap untuk acara aqiqah yang meriah',
        price: 1800000,
        category: 'standar',
        servings: 75,
      },
      {
        name: 'Paket Premium 100 Porsi',
        description: 'Paket premium dengan menu mewah dan pelayanan terbaik',
        price: 2500000,
        category: 'premium',
        servings: 100,
      }
    ]
    
    const productIds = []
    
    for (const productData of products) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('*')
        .eq('name', productData.name)
        .single()
      
      if (existingProduct) {
        console.log(`✅ Product found: ${existingProduct.name}`)
        productIds.push(existingProduct.id)
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            ...productData,
            image_url: '/placeholder.jpg',
            features: ['Nasi', 'Ayam Goreng', 'Sayur', 'Minuman', 'Dessert'],
            is_popular: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error creating product:', error)
          continue
        }
        
        console.log(`✅ Product created: ${newProduct.name}`)
        productIds.push(newProduct.id)
      }
    }
    
    // Create orders with different statuses
    const orders = [
      {
        product_id: productIds[0],
        quantity: 1,
        event_date: '2025-09-15',
        event_time: '12:00:00',
        total_amount: 1200000,
        status: 'completed',
        payment_status: 'paid',
        notes: 'Order pertama - selesai dengan baik',
      },
      {
        product_id: productIds[1],
        quantity: 1,
        event_date: '2025-09-20',
        event_time: '18:00:00',
        total_amount: 1800000,
        status: 'confirmed',
        payment_status: 'paid',
        notes: 'Order kedua - sudah dikonfirmasi',
      },
      {
        product_id: productIds[2],
        quantity: 1,
        event_date: '2025-09-25',
        event_time: '19:00:00',
        total_amount: 2500000,
        status: 'pending',
        payment_status: 'pending',
        notes: 'Order ketiga - menunggu konfirmasi',
      },
      {
        product_id: productIds[0],
        quantity: 2,
        event_date: '2025-10-01',
        event_time: '20:00:00',
        total_amount: 2400000,
        status: 'preparing',
        payment_status: 'paid',
        notes: 'Order keempat - sedang disiapkan',
      }
    ]
    
    console.log('\n📋 Creating orders...')
    
    for (let i = 0; i < orders.length; i++) {
      const orderData = orders[i]
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select(`
          *,
          users:user_id(*),
          products:product_id(*)
        `)
        .single()
      
      if (error) {
        console.error(`❌ Error creating order ${i + 1}:`, error)
        continue
      }
      
      console.log(`✅ Order ${i + 1} created: ${order.products?.name} - ${order.status}`)
    }
    
    // Create some payments
    console.log('\n💳 Creating payments...')
    
    const { data: allOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
    
    for (const order of allOrders || []) {
      if (order.payment_status === 'paid') {
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            order_id: order.id,
            amount: order.total_amount,
            payment_method: 'bank_transfer',
            status: 'completed',
            transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            payment_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Error creating payment for order ${order.id}:`, error)
        } else {
          console.log(`✅ Payment created for order ${order.id}: ${payment.status}`)
        }
      }
    }
    
    console.log('\n🎉 Multiple test orders created successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - User: ${user.name} (${user.email})`)
    console.log(`  - Total Orders: ${allOrders?.length || 0}`)
    console.log(`  - Products: ${productIds.length}`)
    
  } catch (error) {
    console.error('Error creating multiple test orders:', error)
  }
}

createMultipleTestOrders()
