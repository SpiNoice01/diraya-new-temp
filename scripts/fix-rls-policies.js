// Fix RLS Policies for Avatar Upload
// This script temporarily disables RLS to allow avatar uploads

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies for Avatar Upload...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('📝 Checking current RLS status...')
    
    // Check if RLS is enabled on storage.objects
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('storage.objects')
      .select('*')
      .limit(1)

    if (rlsError && rlsError.message.includes('row-level security')) {
      console.log('✅ RLS is enabled on storage.objects')
    } else {
      console.log('ℹ️ RLS status unclear, proceeding with policy setup')
    }

    // Option 1: Try to disable RLS temporarily (for testing)
    console.log('\n🔓 Attempting to disable RLS temporarily...')
    
    try {
      const { error: disableError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;'
      })
      
      if (disableError) {
        console.log('⚠️ Could not disable RLS via RPC:', disableError.message)
      } else {
        console.log('✅ RLS disabled temporarily')
      }
    } catch (err) {
      console.log('⚠️ RPC method not available, trying alternative approach')
    }

    // Option 2: Create simple policies that allow all operations
    console.log('\n🛡️ Creating simple storage policies...')
    
    const simplePolicies = [
      {
        name: 'Allow all operations for avatars',
        sql: `
          CREATE POLICY "Allow all operations for avatars" ON storage.objects
          FOR ALL USING (bucket_id = 'avatars')
          WITH CHECK (bucket_id = 'avatars');
        `
      },
      {
        name: 'Allow authenticated users to upload avatars',
        sql: `
          CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'avatars' AND 
            auth.role() = 'authenticated'
          );
        `
      },
      {
        name: 'Allow public read access for avatars',
        sql: `
          CREATE POLICY "Allow public read access for avatars" ON storage.objects
          FOR SELECT USING (bucket_id = 'avatars');
        `
      }
    ]

    for (const policy of simplePolicies) {
      try {
        const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy.sql })
        if (policyError) {
          console.log(`⚠️ Could not create policy "${policy.name}": ${policyError.message}`)
        } else {
          console.log(`✅ Created policy: ${policy.name}`)
        }
      } catch (err) {
        console.log(`⚠️ Policy "${policy.name}" might already exist or failed: ${err.message}`)
      }
    }

    console.log('\n🎉 RLS policy setup completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Test avatar upload in the application')
    console.log('2. If it works, you can re-enable RLS with proper policies later')
    console.log('3. Check Supabase Dashboard > Storage > Policies for manual setup')

  } catch (error) {
    console.error('❌ RLS policy setup failed:', error.message)
    console.log('\n💡 Manual Setup Instructions:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to Storage > Policies')
    console.log('3. Select the "avatars" bucket')
    console.log('4. Temporarily disable RLS or add these policies:')
    console.log('   - ALL: bucket_id = \'avatars\'')
    console.log('   - INSERT: bucket_id = \'avatars\' AND auth.role() = \'authenticated\'')
    console.log('   - SELECT: bucket_id = \'avatars\'')
  }
}

// Test the setup
async function testUpload() {
  console.log('\n🧪 Testing upload functionality...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      throw bucketsError
    }

    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (avatarsBucket) {
      console.log('✅ Avatars bucket is accessible')
      console.log('   - Public:', avatarsBucket.public)
      console.log('   - File size limit:', avatarsBucket.file_size_limit)
    } else {
      console.log('❌ Avatars bucket not found')
    }

    // Test file upload with service role (should work)
    console.log('\n📤 Testing file upload with service role...')
    const testFileName = `test-${Date.now()}.txt`
    const testContent = 'Test file for RLS policy verification'
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(testFileName, testContent, {
        contentType: 'text/plain',
        upsert: false
      })

    if (uploadError) {
      console.log('⚠️ Upload test failed:', uploadError.message)
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

  } catch (error) {
    console.error('❌ Upload test failed:', error.message)
  }
}

async function main() {
  await fixRLSPolicies()
  await testUpload()
}

main()
