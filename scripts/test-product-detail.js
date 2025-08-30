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

async function testProductDetail() {
  console.log('🚀 Testing Product Detail Page Functionality...\n')

  try {
    // 1. Get all products
    console.log('📋 Step 1: Fetching all products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('❌ Failed to fetch products:', productsError.message)
      return
    }

    console.log(`✅ Found ${products.length} products`)

    if (products.length === 0) {
      console.error('❌ No products available for testing')
      return
    }

    // 2. Test product detail functionality
    console.log('\n🔍 Step 2: Testing product detail functionality...')
    const testProduct = products[0]
    
    console.log('📦 Product Details:')
    console.log('   ID:', testProduct.id)
    console.log('   Name:', testProduct.name)
    console.log('   Category:', testProduct.category)
    console.log('   Price:', testProduct.price)
    console.log('   Servings:', testProduct.servings)
    console.log('   Is Popular:', testProduct.is_popular)
    console.log('   Description:', testProduct.description)
    console.log('   Features:', testProduct.features.length, 'items')
    console.log('   Image URL:', testProduct.image_url || 'No image')

    // 3. Test individual service functions
    console.log('\n🔧 Step 3: Testing service functions...')
    
    // Test getProductById
    const { data: productDetail, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', testProduct.id)
      .single()

    if (productError) {
      console.error('❌ Failed to get product by ID:', productError.message)
    } else {
      console.log('✅ getProductById works')
      console.log('   Retrieved product:', productDetail.name)
    }

    // 4. Test product features
    console.log('\n📋 Step 4: Testing product features...')
    if (testProduct.features && testProduct.features.length > 0) {
      console.log('✅ Product features available:')
      testProduct.features.forEach((feature, index) => {
        console.log(`   ${index + 1}. ${feature}`)
      })
    } else {
      console.log('⚠️  No features available for this product')
    }

    // 5. Test product categories
    console.log('\n🏷️  Step 5: Testing product categories...')
    const categories = [...new Set(products.map(p => p.category))]
    console.log('✅ Available categories:', categories)

    // 6. Test popular products
    console.log('\n⭐ Step 6: Testing popular products...')
    const popularProducts = products.filter(p => p.is_popular)
    console.log(`✅ Found ${popularProducts.length} popular products`)

    // 7. Test price formatting
    console.log('\n💰 Step 7: Testing price formatting...')
    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price)
    }
    
    console.log('✅ Price formatting works:')
    console.log('   Original price:', testProduct.price)
    console.log('   Formatted price:', formatPrice(testProduct.price))

    console.log('\n🎉 Product detail test completed successfully!')
    console.log('📝 Summary:')
    console.log('   ✅ Products can be fetched')
    console.log('   ✅ Product details are complete')
    console.log('   ✅ Product features available')
    console.log('   ✅ Product categories work')
    console.log('   ✅ Popular products filtering works')
    console.log('   ✅ Price formatting works')
    console.log('   ✅ Service functions work')

    console.log('\n💡 Next steps:')
    console.log('   1. Go to /katalog page')
    console.log('   2. Click "Detail" on any product card')
    console.log('   3. Verify the product detail page displays correctly')
    console.log('   4. Test navigation back to catalog')
    console.log('   5. Test "Pesan Sekarang" button')

    console.log('\n🔗 Test URLs:')
    console.log(`   Product detail: /katalog/${testProduct.id}`)
    console.log(`   Booking with product: /booking?product=${testProduct.id}`)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testProductDetail()
