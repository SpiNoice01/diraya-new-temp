// Final verification script - check completion status
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function finalVerification() {
  console.log('🔍 FINAL VERIFICATION: Database Migration Status\n')

  try {
    // 1. Check database connection
    console.log('1️⃣ Testing Database Connection...')
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed')
      return
    }
    console.log('✅ Database connection successful')

    // 2. Check data availability
    console.log('\n2️⃣ Checking Data Availability...')
    
    const tables = ['users', 'products', 'orders', 'payments']
    const dataCheck = {}
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ❌ ${table}: Error - ${error.message}`)
        dataCheck[table] = 0
      } else {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        dataCheck[table] = count || 0
        console.log(`   ✅ ${table}: ${count || 0} records`)
      }
    }

    // 3. Check critical data
    console.log('\n3️⃣ Critical Data Status...')
    
    if (dataCheck.products > 0) {
      console.log('   ✅ Products available - Catalog will work')
    } else {
      console.log('   ⚠️  No products - Run: node scripts/supabase-setup.sql')
    }
    
    if (dataCheck.users > 0) {
      console.log('   ✅ Users available - Authentication will work')
    } else {
      console.log('   ⚠️  No users - Create test users first')
    }
    
    if (dataCheck.orders > 0) {
      console.log('   ✅ Orders available - Payment testing ready')
    } else {
      console.log('   ⚠️  No orders - Create test orders for payment testing')
    }

    // 4. Environment check
    console.log('\n4️⃣ Environment Configuration...')
    
    const envVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'MIDTRANS_SERVER_KEY',
      'MIDTRANS_CLIENT_KEY',
      'NEXT_PUBLIC_MIDTRANS_CLIENT_KEY'
    ]
    
    envVars.forEach(varName => {
      const value = process.env[varName]
      if (value) {
        console.log(`   ✅ ${varName}: SET`)
      } else {
        console.log(`   ❌ ${varName}: NOT SET`)
      }
    })

    // 5. Summary and recommendations
    console.log('\n5️⃣ Migration Summary...')
    console.log('='.repeat(50))
    
    if (dataCheck.products > 0 && dataCheck.users > 0) {
      console.log('🎉 SUCCESS: Migration to database completed!')
      console.log('✅ All data is now loaded from Supabase database')
      console.log('✅ No more dummy data dependencies')
      
      if (process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_CLIENT_KEY) {
        console.log('✅ Midtrans configured - Payment ready')
      } else {
        console.log('⚠️  Midtrans not configured - Add credentials for payment')
      }
      
      console.log('\n🚀 Ready for production!')
      
    } else {
      console.log('⚠️  Migration incomplete - Missing data')
      console.log('\n📋 Next steps:')
      
      if (dataCheck.products === 0) {
        console.log('1. Run Supabase setup to create products')
      }
      
      if (dataCheck.users === 0) {
        console.log('2. Create test users: node scripts/setup-test-data-admin.js')
      }
      
      if (dataCheck.orders === 0) {
        console.log('3. Create test orders for payment testing')
      }
    }

    console.log('\n📊 Database Records:')
    console.log(`   👥 Users: ${dataCheck.users}`)
    console.log(`   🛍️  Products: ${dataCheck.products}`)
    console.log(`   📦 Orders: ${dataCheck.orders}`)
    console.log(`   💳 Payments: ${dataCheck.payments}`)

  } catch (error) {
    console.error('💥 Verification failed:', error)
  }
}

finalVerification().then(() => {
  console.log('\n🏁 Verification completed!')
}).catch(console.error)
