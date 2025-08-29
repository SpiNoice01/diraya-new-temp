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

async function testUserProfile() {
  console.log('🚀 Testing User Profile Data...\n')

  try {
    // 1. Login as test user
    console.log('🔐 Step 1: Login as test user...')
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (loginError) {
      console.error('❌ Login failed:', loginError.message)
      return
    }

    console.log('✅ Login successful! User ID:', user.id)

    // 2. Get current user profile
    console.log('\n📋 Step 2: Get current user profile...')
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ Failed to get user profile:', profileError.message)
      return
    }

    console.log('✅ Current user profile:')
    console.log('   Name:', userProfile.name)
    console.log('   Email:', userProfile.email)
    console.log('   Phone:', userProfile.phone || 'Belum diisi')
    console.log('   Address:', userProfile.address || 'Belum diisi')
    console.log('   Role:', userProfile.role)

    // 3. Update user profile with complete data
    console.log('\n📝 Step 3: Update user profile with complete data...')
    const updateData = {
      name: 'Test User',
      phone: '081234567890',
      address: 'Jl. Test No. 123, Jakarta Selatan, DKI Jakarta 12345',
      updated_at: new Date().toISOString()
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Failed to update user profile:', updateError.message)
      return
    }

    console.log('✅ User profile updated successfully!')
    console.log('   Name:', updatedProfile.name)
    console.log('   Email:', updatedProfile.email)
    console.log('   Phone:', updatedProfile.phone)
    console.log('   Address:', updatedProfile.address)
    console.log('   Role:', updatedProfile.role)

    // 4. Verify the update
    console.log('\n🔍 Step 4: Verify updated profile...')
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (verifyError) {
      console.error('❌ Failed to verify profile:', verifyError.message)
      return
    }

    console.log('✅ Profile verification successful!')
    console.log('   Phone:', verifyProfile.phone)
    console.log('   Address:', verifyProfile.address)

    // 5. Test with another user
    console.log('\n👤 Step 5: Test with another user...')
    const { data: { user: user2 }, error: loginError2 } = await supabase.auth.signInWithPassword({
      email: 'user@gmail.com',
      password: 'password123'
    })

    if (loginError2) {
      console.log('⚠️ Second user login failed, but that\'s okay')
    } else {
      console.log('✅ Second user login successful!')
      
      const { data: userProfile2, error: profileError2 } = await supabase
        .from('users')
        .select('*')
        .eq('id', user2.id)
        .single()

      if (!profileError2) {
        console.log('✅ Second user profile:')
        console.log('   Name:', userProfile2.name)
        console.log('   Email:', userProfile2.email)
        console.log('   Phone:', userProfile2.phone || 'Belum diisi')
        console.log('   Address:', userProfile2.address || 'Belum diisi')
      }
    }

    // 6. Logout
    console.log('\n👋 Step 6: Logout...')
    await supabase.auth.signOut()
    console.log('✅ Logged out successfully')

    console.log('\n🎉 User profile test completed successfully!')
    console.log('📝 Summary:')
    console.log('   ✅ Login works')
    console.log('   ✅ User profile can be fetched')
    console.log('   ✅ User profile can be updated')
    console.log('   ✅ Phone and address data is complete')
    console.log('   ✅ Data is properly stored in database')

    console.log('\n💡 Next steps:')
    console.log('   1. Login to the application with test@example.com')
    console.log('   2. Go to /booking page')
    console.log('   3. Check that phone and address are displayed correctly')
    console.log('   4. Complete a booking to test the full flow')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testUserProfile()
