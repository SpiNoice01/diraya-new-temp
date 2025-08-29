const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true, // Auto confirm email
      user_metadata: {
        name: 'Test User',
        role: 'customer'
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return
    }

    console.log('User created in auth:', authData.user.id)

    // Create user profile in users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: 'Test User',
        phone: '081234567890',
        address: 'Jl. Test No. 123',
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return
    }

    console.log('User profile created:', profileData)
    console.log('\n✅ Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    console.log('User ID:', authData.user.id)

  } catch (error) {
    console.error('Error creating test user:', error)
  }
}

// Create admin user
async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@kateringaqiqah.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrator',
        role: 'admin'
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return
    }

    console.log('Admin created in auth:', authData.user.id)

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: 'Administrator',
        phone: '081234567890',
        address: 'Jl. Admin No. 1',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return
    }

    console.log('Admin profile created:', profileData)
    console.log('\n✅ Admin user created successfully!')
    console.log('Email: admin@kateringaqiqah.com')
    console.log('Password: admin123')
    console.log('User ID:', authData.user.id)

  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

// Run the functions
async function main() {
  console.log('🚀 Creating test users for Katering Aqiqah...\n')
  
  await createTestUser()
  console.log('\n' + '='.repeat(50) + '\n')
  await createAdminUser()
  
  console.log('\n🎉 All test users created!')
  console.log('\n📝 Login Credentials:')
  console.log('Customer: test@example.com / password123')
  console.log('Admin: admin@kateringaqiqah.com / admin123')
}

main()
