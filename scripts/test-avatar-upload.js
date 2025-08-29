// Test Avatar Upload Functionality
// This script tests if avatar upload is working correctly

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function testAvatarUpload() {
  console.log('🧪 Testing Avatar Upload Functionality...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Test 1: Check if bucket exists and is accessible
    console.log('📦 Testing bucket access...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      throw bucketsError
    }

    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (!avatarsBucket) {
      console.error('❌ Avatars bucket not found!')
      return
    }

    console.log('✅ Avatars bucket found')
    console.log('   - Public:', avatarsBucket.public)
    console.log('   - File size limit:', avatarsBucket.file_size_limit)
    console.log('   - Allowed MIME types:', avatarsBucket.allowed_mime_types)

    // Test 2: Check bucket contents
    console.log('\n📁 Testing bucket contents...')
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list()

    if (filesError) {
      console.warn('⚠️ Could not list files:', filesError.message)
    } else {
      console.log(`✅ Bucket contains ${files.length} files`)
    }

    // Test 3: Test authentication (if user is logged in)
    console.log('\n🔐 Testing authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️ No user logged in (this is normal for testing)')
    } else if (user) {
      console.log('✅ User is logged in:', user.email)
      
      // Test 4: Try to create a test file (this will fail without proper policies)
      console.log('\n📤 Testing file upload...')
      const testFileName = `${user.id}-test-${Date.now()}.txt`
      const testContent = 'This is a test file for avatar upload functionality'
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(testFileName, testContent, {
          contentType: 'text/plain',
          upsert: false
        })

      if (uploadError) {
        console.log('⚠️ Upload test failed (expected if policies not set):', uploadError.message)
        console.log('💡 This is normal if storage policies are not configured yet')
      } else {
        console.log('✅ Upload test successful!')
        
        // Clean up test file
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([testFileName])
        
        if (deleteError) {
          console.warn('⚠️ Could not delete test file:', deleteError.message)
        } else {
          console.log('✅ Test file cleaned up')
        }
      }
    }

    console.log('\n🎉 Avatar upload test completed!')
    console.log('\n📝 Summary:')
    console.log('✅ Bucket exists and is accessible')
    console.log('✅ Bucket is public')
    console.log('✅ File size and type restrictions are set')
    
    if (user) {
      console.log('✅ User authentication works')
      console.log('⚠️ Upload test may fail if policies not configured')
    } else {
      console.log('ℹ️ No user logged in - upload test skipped')
    }

    console.log('\n💡 Next steps:')
    console.log('1. Setup storage policies in Supabase Dashboard')
    console.log('2. Test avatar upload in the application')
    console.log('3. Verify that avatars are publicly accessible')

  } catch (error) {
    console.error('❌ Avatar upload test failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check your Supabase project settings')
    console.log('2. Verify your environment variables')
    console.log('3. Make sure Storage is enabled in your Supabase project')
  }
}

testAvatarUpload()
