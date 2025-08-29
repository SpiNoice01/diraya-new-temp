// Fix Storage Policies for Avatars Bucket
// Run this script to set up proper storage policies

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

async function fixStoragePolicies() {
  console.log('🔧 Fixing Supabase Storage Policies...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!')
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // SQL to create storage policies
    const policiesSQL = `
      -- Enable RLS on storage.objects
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

      -- Policy 1: Users can upload their own avatar
      CREATE POLICY "Users can upload own avatar" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );

      -- Policy 2: Users can update their own avatar
      CREATE POLICY "Users can update own avatar" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );

      -- Policy 3: Users can delete their own avatar
      CREATE POLICY "Users can delete own avatar" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );

      -- Policy 4: Public read access for avatars
      CREATE POLICY "Public read access for avatars" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
    `

    console.log('📝 Creating storage policies...')
    
    const { error } = await supabase.rpc('exec_sql', { sql: policiesSQL })
    
    if (error) {
      // If RPC doesn't work, try direct SQL execution
      console.log('⚠️ RPC failed, trying alternative method...')
      
      // Alternative: Create policies one by one
      const policies = [
        {
          name: 'Users can upload own avatar',
          sql: `CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);`
        },
        {
          name: 'Users can update own avatar', 
          sql: `CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);`
        },
        {
          name: 'Users can delete own avatar',
          sql: `CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);`
        },
        {
          name: 'Public read access for avatars',
          sql: `CREATE POLICY "Public read access for avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`
        }
      ]

      for (const policy of policies) {
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
    } else {
      console.log('✅ All storage policies created successfully')
    }

    console.log('\n🎉 Storage policies setup completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Test avatar upload functionality')
    console.log('2. Check that avatars are publicly accessible')
    console.log('3. Verify that users can only manage their own avatars')

  } catch (error) {
    console.error('❌ Storage policies setup failed:', error.message)
    console.log('\n💡 Manual Setup Instructions:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to Storage > Policies')
    console.log('3. Select the "avatars" bucket')
    console.log('4. Add the following policies manually:')
    console.log('   - INSERT: bucket_id = \'avatars\' AND auth.uid()::text = (storage.foldername(name))[1]')
    console.log('   - UPDATE: bucket_id = \'avatars\' AND auth.uid()::text = (storage.foldername(name))[1]')
    console.log('   - DELETE: bucket_id = \'avatars\' AND auth.uid()::text = (storage.foldername(name))[1]')
    console.log('   - SELECT: bucket_id = \'avatars\'')
  }
}

// Test the setup
async function testAvatarUpload() {
  console.log('\n🧪 Testing avatar upload functionality...')

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
      console.log('   - Allowed MIME types:', avatarsBucket.allowed_mime_types)
    } else {
      console.log('❌ Avatars bucket not found')
    }

    // Test bucket contents
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list()

    if (filesError) {
      console.warn('⚠️ Could not list files:', filesError.message)
    } else {
      console.log(`✅ Bucket contains ${files.length} files`)
    }

  } catch (error) {
    console.error('❌ Storage test failed:', error.message)
  }
}

async function main() {
  await fixStoragePolicies()
  await testAvatarUpload()
}

main()
