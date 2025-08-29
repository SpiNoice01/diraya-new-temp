// Setup Supabase Storage with Admin API
// This script uses the service role key to properly configure storage

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function setupStorageWithAdmin() {
  console.log('🔧 Setting up Supabase Storage with Admin API...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    return
  }

  // Create admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 1. Create avatars bucket
    console.log('📦 Creating avatars bucket...')
    const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 2097152, // 2MB
    })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Avatars bucket already exists')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Avatars bucket created successfully')
    }

    // 2. Set up storage policies using admin API
    console.log('\n🛡️ Setting up storage policies...')

    // Policy 1: Allow authenticated users to upload to avatars bucket
    const { error: uploadPolicyError } = await supabaseAdmin.storage
      .from('avatars')
      .createPolicy('Allow authenticated uploads', {
        name: 'Allow authenticated uploads',
        definition: `
          (bucket_id = 'avatars'::text) AND 
          (auth.role() = 'authenticated')
        `,
        operation: 'INSERT'
      })

    if (uploadPolicyError) {
      if (uploadPolicyError.message.includes('already exists')) {
        console.log('✅ Upload policy already exists')
      } else {
        console.warn('⚠️ Upload policy error:', uploadPolicyError.message)
      }
    } else {
      console.log('✅ Upload policy created')
    }

    // Policy 2: Allow authenticated users to update files in avatars bucket
    const { error: updatePolicyError } = await supabaseAdmin.storage
      .from('avatars')
      .createPolicy('Allow authenticated updates', {
        name: 'Allow authenticated updates',
        definition: `
          (bucket_id = 'avatars'::text) AND 
          (auth.role() = 'authenticated')
        `,
        operation: 'UPDATE'
      })

    if (updatePolicyError) {
      if (updatePolicyError.message.includes('already exists')) {
        console.log('✅ Update policy already exists')
      } else {
        console.warn('⚠️ Update policy error:', updatePolicyError.message)
      }
    } else {
      console.log('✅ Update policy created')
    }

    // Policy 3: Allow authenticated users to delete files in avatars bucket
    const { error: deletePolicyError } = await supabaseAdmin.storage
      .from('avatars')
      .createPolicy('Allow authenticated deletes', {
        name: 'Allow authenticated deletes',
        definition: `
          (bucket_id = 'avatars'::text) AND 
          (auth.role() = 'authenticated')
        `,
        operation: 'DELETE'
      })

    if (deletePolicyError) {
      if (deletePolicyError.message.includes('already exists')) {
        console.log('✅ Delete policy already exists')
      } else {
        console.warn('⚠️ Delete policy error:', deletePolicyError.message)
      }
    } else {
      console.log('✅ Delete policy created')
    }

    // Policy 4: Public read access for avatars
    const { error: readPolicyError } = await supabaseAdmin.storage
      .from('avatars')
      .createPolicy('Public read access', {
        name: 'Public read access',
        definition: 'bucket_id = \'avatars\'::text',
        operation: 'SELECT'
      })

    if (readPolicyError) {
      if (readPolicyError.message.includes('already exists')) {
        console.log('✅ Read policy already exists')
      } else {
        console.warn('⚠️ Read policy error:', readPolicyError.message)
      }
    } else {
      console.log('✅ Read policy created')
    }

    console.log('\n🎉 Storage setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Test the avatar upload functionality')
    console.log('2. Check that avatars are publicly accessible')
    console.log('3. Verify that authenticated users can upload avatars')

  } catch (error) {
    console.error('❌ Storage setup failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Check your Supabase project settings')
    console.log('2. Verify your service role key has admin permissions')
    console.log('3. Make sure Storage is enabled in your Supabase project')
    console.log('4. Try running the simple SQL script instead')
  }
}

// Test storage functionality
async function testStorage() {
  console.log('\n🧪 Testing storage functionality...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      throw bucketsError
    }

    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (avatarsBucket) {
      console.log('✅ Avatars bucket found')
      console.log('   - Public:', avatarsBucket.public)
      console.log('   - File size limit:', avatarsBucket.file_size_limit)
      console.log('   - Allowed MIME types:', avatarsBucket.allowed_mime_types)
    } else {
      console.log('❌ Avatars bucket not found')
    }

    // Test policies
    const { data: policies, error: policiesError } = await supabaseAdmin.storage
      .from('avatars')
      .getPolicies()

    if (policiesError) {
      console.warn('⚠️ Could not fetch policies:', policiesError.message)
    } else {
      console.log('✅ Storage policies:')
      policies.forEach(policy => {
        console.log(`   - ${policy.name}: ${policy.operation}`)
      })
    }

  } catch (error) {
    console.error('❌ Storage test failed:', error.message)
  }
}

async function main() {
  await setupStorageWithAdmin()
  await testStorage()
}

main()
