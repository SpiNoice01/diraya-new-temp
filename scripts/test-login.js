const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('🧪 Testing Login Functionality...\n')

  const testCredentials = [
    {
      email: 'test@example.com',
      password: 'password123',
      description: 'Test Customer'
    },
    {
      email: 'admin@kateringaqiqah.com',
      password: 'admin123',
      description: 'Test Admin'
    }
  ]

  for (const cred of testCredentials) {
    console.log(`🔐 Testing login for: ${cred.description}`)
    console.log(`Email: ${cred.email}`)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password,
      })

      if (error) {
        console.error(`❌ Login failed: ${error.message}`)
        
        if (error.message === 'Invalid login credentials') {
          console.log('💡 User might not exist. Run create-test-user.js first.')
        }
      } else {
        console.log(`✅ Login successful!`)
        console.log(`User ID: ${data.user.id}`)
        console.log(`Email: ${data.user.email}`)
        
        // Test fetching user profile
        console.log('📋 Fetching user profile...')
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.error(`❌ Profile fetch failed: ${profileError.message}`)
        } else {
          console.log(`✅ Profile found:`)
          console.log(`  Name: ${profile.name}`)
          console.log(`  Role: ${profile.role}`)
          console.log(`  Phone: ${profile.phone}`)
        }
        
        // Sign out
        await supabase.auth.signOut()
        console.log('👋 Signed out\n')
      }
    } catch (error) {
      console.error(`❌ Unexpected error: ${error.message}`)
    }
    
    console.log('─'.repeat(50))
  }

  console.log('\n📝 Summary:')
  console.log('If login tests failed, make sure to:')
  console.log('1. Run create-test-user.js to create test users')
  console.log('2. Check your environment variables')
  console.log('3. Verify Supabase project is active')
}

async function testRegister() {
  console.log('\n📝 Testing Registration...\n')
  
  const testUser = {
    email: 'newuser@example.com',
    password: 'newpassword123',
    name: 'New Test User',
    phone: '081234567890',
    address: 'Jl. Test Baru No. 456'
  }
  
  console.log(`🔐 Testing registration for: ${testUser.email}`)
  
  try {
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
    })

    if (error) {
      console.error(`❌ Registration failed: ${error.message}`)
      
      if (error.message.includes('already registered')) {
        console.log('💡 User already exists, trying login instead...')
        
        // Try to login with existing user
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password,
        })
        
        if (loginError) {
          console.error(`❌ Login also failed: ${loginError.message}`)
        } else {
          console.log(`✅ Login successful with existing user`)
          await supabase.auth.signOut()
        }
      }
    } else {
      console.log(`✅ Registration successful!`)
      console.log(`User ID: ${data.user.id}`)
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: testUser.name,
          phone: testUser.phone,
          address: testUser.address,
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      
      if (profileError) {
        console.error(`❌ Profile creation failed: ${profileError.message}`)
      } else {
        console.log(`✅ User profile created successfully`)
      }
      
      await supabase.auth.signOut()
    }
  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`)
  }
}

async function main() {
  console.log('🚀 Katering Aqiqah - Authentication Test\n')
  
  await testLogin()
  await testRegister()
  
  console.log('\n🎯 Test completed!')
  console.log('Check the results above to identify any issues.')
}

main()
