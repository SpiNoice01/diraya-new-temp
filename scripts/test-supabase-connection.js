// Test Supabase Connection
// Run this script to test if Supabase is accessible

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('📋 Environment Variables Check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
  console.log('')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return
  }

  try {
    // Test client connection
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('🔗 Testing client connection...')
    
    // Test basic query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('💡 Hint: Users table might not exist. Check your database schema.')
      } else if (error.message.includes('JWT')) {
        console.log('💡 Hint: Check your Supabase API keys.')
      } else if (error.message.includes('fetch')) {
        console.log('💡 Hint: Check your internet connection and Supabase URL.')
      }
    } else {
      console.log('✅ Database connection successful!')
    }

    // Test auth connection
    console.log('\n🔐 Testing auth connection...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth connection failed:', authError.message)
    } else {
      console.log('✅ Auth connection successful!')
      console.log('Current session:', authData.session ? 'Active' : 'None')
    }

    // Test RLS policies
    console.log('\n🛡️ Testing RLS policies...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(1)
    
    if (rlsError) {
      console.log('⚠️ RLS test result:', rlsError.message)
      console.log('💡 This might be expected if no users exist or RLS is blocking access')
    } else {
      console.log('✅ RLS test passed!')
      console.log('Sample data:', rlsTest?.length || 0, 'records found')
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }

  console.log('\n📝 Next Steps:')
  console.log('1. If connection failed, check your Supabase project settings')
  console.log('2. Run the database setup scripts if tables don\'t exist')
  console.log('3. Create test users using create-test-user.js script')
  console.log('4. Test login with the created credentials')
}

// Test with service role key for admin operations
async function testAdminConnection() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    console.log('\n⚠️ Service role key not found. Skipping admin tests.')
    return
  }

  console.log('\n👑 Testing admin connection...')
  
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseServiceKey
    )

    // Test admin query
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role')
      .limit(5)
    
    if (error) {
      console.error('❌ Admin connection failed:', error.message)
    } else {
      console.log('✅ Admin connection successful!')
      console.log('Users found:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('Sample users:')
        data.forEach(user => {
          console.log(`  - ${user.email} (${user.role})`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Admin test failed:', error.message)
  }
}

async function main() {
  await testSupabaseConnection()
  await testAdminConnection()
  
  console.log('\n🎯 Summary:')
  console.log('If all tests passed, your Supabase setup is working correctly!')
  console.log('You can now create test users and test the login functionality.')
}

main()
