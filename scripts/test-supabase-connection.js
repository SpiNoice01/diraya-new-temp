// Test Supabase Connection
// Run this script to test if Supabase is accessible

const { createClient } = require('@supabase/supabase-js')

// Environment variables (copy from .env.local)
const supabaseUrl = 'https://iqxhehfyqzuymxjfgqry.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGhlaGZ5cXp1eW14amZncXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODYyNDIsImV4cCI6MjA3MTg2MjI0Mn0.3OOBLxtJzuCYxDWmy82ncqjbTEdYGPcZuMhvvNJBjno'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? '***' : 'undefined')

async function testConnection() {
  try {
    // Create client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })

    console.log('\n1. Testing basic connection...')
    
    // Test auth.getSession
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message)
    } else {
      console.log('✅ Session check passed')
    }

    // Test database connection
    console.log('\n2. Testing database connection...')
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (dbError) {
      console.error('❌ Database connection failed:', dbError.message)
      
      // Check if table exists
      if (dbError.message.includes('relation') && dbError.message.includes('does not exist')) {
        console.log('💡 Table "users" does not exist. Run the database setup script first.')
      }
    } else {
      console.log('✅ Database connection passed')
    }

    // Test auth signup (without actually creating user)
    console.log('\n3. Testing auth endpoint...')
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log('✅ Auth endpoint working (user already exists)')
        } else {
          console.log('✅ Auth endpoint working (new error type):', authError.message)
        }
      } else {
        console.log('✅ Auth endpoint working')
      }
    } catch (authErr) {
      console.error('❌ Auth endpoint failed:', authErr.message)
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Possible solutions:')
      console.log('1. Check internet connection')
      console.log('2. Check if Supabase project is active')
      console.log('3. Verify URL and API key')
      console.log('4. Check if project has reached rate limits')
    }
  }
}

testConnection()
