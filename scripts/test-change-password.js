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

async function testChangePassword() {
  console.log('🚀 Testing Change Password Functionality with Current Password Verification...\n')

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

    // 2. Test password verification with correct password
    console.log('\n🔐 Step 2: Testing password verification with correct password...')
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (verifyError) {
      console.error('❌ Password verification failed:', verifyError.message)
      return
    }

    console.log('✅ Password verification successful!')

    // 3. Test password verification with wrong password
    console.log('\n❌ Step 3: Testing password verification with wrong password...')
    const { error: wrongVerifyError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    if (wrongVerifyError) {
      console.log('✅ Password verification correctly rejected wrong password:', wrongVerifyError.message)
    } else {
      console.error('❌ Password verification should have failed with wrong password!')
      return
    }

    // 4. Test password update with correct current password
    console.log('\n🔑 Step 4: Testing password update with correct current password...')
    const newPassword = 'newpassword123'
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('❌ Password update failed:', updateError.message)
      return
    }

    console.log('✅ Password updated successfully!')

    // 5. Test login with new password
    console.log('\n🔐 Step 5: Testing login with new password...')
    const { data: { user: user2 }, error: loginError2 } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: newPassword
    })

    if (loginError2) {
      console.error('❌ Login with new password failed:', loginError2.message)
      return
    }

    console.log('✅ Login with new password successful!')

    // 6. Change password back to original
    console.log('\n🔄 Step 6: Changing password back to original...')
    const { error: revertError } = await supabase.auth.updateUser({
      password: 'password123'
    })

    if (revertError) {
      console.error('❌ Password revert failed:', revertError.message)
      return
    }

    console.log('✅ Password reverted to original successfully!')

    // 7. Test login with original password
    console.log('\n🔐 Step 7: Testing login with original password...')
    const { data: { user: user3 }, error: loginError3 } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (loginError3) {
      console.error('❌ Login with original password failed:', loginError3.message)
      return
    }

    console.log('✅ Login with original password successful!')

    // 8. Logout
    console.log('\n👋 Step 8: Logout...')
    await supabase.auth.signOut()
    console.log('✅ Logged out successfully')

    console.log('\n🎉 Change password test completed successfully!')
    console.log('📝 Summary:')
    console.log('   ✅ Login works')
    console.log('   ✅ Password verification works with correct password')
    console.log('   ✅ Password verification correctly rejects wrong password')
    console.log('   ✅ Password can be updated')
    console.log('   ✅ Login with new password works')
    console.log('   ✅ Password can be reverted')
    console.log('   ✅ Login with original password works')
    console.log('   ✅ Supabase Auth integration works')

    console.log('\n💡 Next steps:')
    console.log('   1. Login to the application with test@example.com')
    console.log('   2. Go to /customer/profile page')
    console.log('   3. Click "Ubah Password" button')
    console.log('   4. Test with wrong current password - should be rejected')
    console.log('   5. Test with correct current password - should work')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testChangePassword()
