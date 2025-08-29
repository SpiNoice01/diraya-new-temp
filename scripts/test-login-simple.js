// Simple Login Test for Debugging
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function testLogin() {
  console.log('🔍 Testing Login for Debugging...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables!')
    return
  }

  console.log('📋 Environment Check:')
  console.log('URL:', supabaseUrl)
  console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...')

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Test 1: Check current session
    console.log('\n🔐 Test 1: Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError)
    } else {
      console.log('✅ Session check successful')
      console.log('Current session:', session ? 'Active' : 'None')
    }

    // Test 2: Try login with existing user
    console.log('\n🔐 Test 2: Trying login with existing user...')
    
    // Try with one of the existing users from the database
    const testEmails = [
      'fadhilaagil119@gmail.com',
      'user@gmail.com', 
      'user2@gmail.com',
      'testing@testing.com'
    ]

    for (const email of testEmails) {
      console.log(`\n📧 Trying login with: ${email}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123' // Common test password
      })

      if (error) {
        console.log(`❌ Login failed for ${email}:`, error.message)
      } else {
        console.log(`✅ Login successful for ${email}!`)
        console.log('User ID:', data.user?.id)
        
        // Test 3: Check user profile
        console.log('\n📥 Test 3: Fetching user profile...')
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.log('❌ Profile fetch error:', profileError.message)
        } else {
          console.log('✅ Profile fetched successfully:')
          console.log('Name:', profile.name)
          console.log('Email:', profile.email)
          console.log('Role:', profile.role)
        }

        // Sign out
        await supabase.auth.signOut()
        console.log('🚪 Signed out')
        break
      }
    }

    // Test 4: Create a new test user
    console.log('\n📝 Test 4: Creating new test user...')
    const newEmail = `test${Date.now()}@example.com`
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: newEmail,
      password: 'password123'
    })

    if (signUpError) {
      console.log('❌ Sign up error:', signUpError.message)
    } else {
      console.log('✅ Sign up successful!')
      console.log('User ID:', signUpData.user?.id)
      
      // Create profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user.id,
          email: newEmail,
          name: 'Test User',
          phone: '08123456789',
          address: 'Test Address',
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.log('❌ Profile creation error:', profileError.message)
      } else {
        console.log('✅ Profile created successfully')
      }

      // Test login with new user
      console.log('\n🔐 Test 5: Testing login with new user...')
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: newEmail,
        password: 'password123'
      })

      if (loginError) {
        console.log('❌ Login with new user failed:', loginError.message)
      } else {
        console.log('✅ Login with new user successful!')
        console.log('User ID:', loginData.user?.id)
      }

      // Clean up
      await supabase.auth.signOut()
    }

    console.log('\n🎉 Test completed!')
    console.log('\n💡 If login works here but not in the app, the issue is likely:')
    console.log('1. Auth context not properly initialized')
    console.log('2. Loading state not being updated correctly')
    console.log('3. Component not re-rendering after auth state change')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLogin()
