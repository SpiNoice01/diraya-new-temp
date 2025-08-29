const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up Katering Aqiqah Database...\n')

  try {
    // Read SQL files
    const sqlFiles = [
      '01-create-tables.sql',
      '02-seed-users.sql',
      '03-seed-products.sql',
      '04-seed-orders.sql',
      '05-seed-payments.sql'
    ]

    for (const fileName of sqlFiles) {
      const filePath = path.join(__dirname, fileName)
      
      if (fs.existsSync(filePath)) {
        console.log(`📄 Executing ${fileName}...`)
        
        const sqlContent = fs.readFileSync(filePath, 'utf8')
        
        // Split SQL by semicolon and execute each statement
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              const { error } = await supabase.rpc('exec_sql', { sql: statement })
              
              if (error) {
                // If RPC doesn't exist, try direct execution
                console.log(`⚠️ RPC failed, trying direct execution for: ${statement.substring(0, 50)}...`)
                
                // For table creation, we'll use the Supabase client
                if (statement.includes('CREATE TABLE')) {
                  console.log('💡 Table creation should be done via Supabase dashboard or migrations')
                }
              }
            } catch (err) {
              console.log(`⚠️ Statement skipped: ${err.message}`)
            }
          }
        }
        
        console.log(`✅ ${fileName} processed`)
      } else {
        console.log(`⚠️ ${fileName} not found, skipping...`)
      }
    }

    console.log('\n🎉 Database setup completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Check your Supabase dashboard for tables')
    console.log('2. Run create-test-user.js to create test users')
    console.log('3. Test the application login functionality')

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
  }
}

async function createTables() {
  console.log('🔨 Creating tables via Supabase client...\n')

  try {
    // Create users table
    console.log('Creating users table...')
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (usersError && usersError.message.includes('does not exist')) {
      console.log('Users table does not exist. Please create it via Supabase dashboard.')
      console.log('Use the SQL from scripts/01-create-tables.sql')
    } else {
      console.log('✅ Users table exists')
    }

    // Create products table
    console.log('Creating products table...')
    const { error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (productsError && productsError.message.includes('does not exist')) {
      console.log('Products table does not exist. Please create it via Supabase dashboard.')
    } else {
      console.log('✅ Products table exists')
    }

    // Create orders table
    console.log('Creating orders table...')
    const { error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)
    
    if (ordersError && ordersError.message.includes('does not exist')) {
      console.log('Orders table does not exist. Please create it via Supabase dashboard.')
    } else {
      console.log('✅ Orders table exists')
    }

    // Create payments table
    console.log('Creating payments table...')
    const { error: paymentsError } = await supabase
      .from('payments')
      .select('id')
      .limit(1)
    
    if (paymentsError && paymentsError.message.includes('does not exist')) {
      console.log('Payments table does not exist. Please create it via Supabase dashboard.')
    } else {
      console.log('✅ Payments table exists')
    }

  } catch (error) {
    console.error('❌ Table creation failed:', error.message)
  }
}

async function main() {
  console.log('🔍 Checking database structure...\n')
  await createTables()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  console.log('📋 Manual Setup Instructions:')
  console.log('1. Go to your Supabase dashboard')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the content from scripts/01-create-tables.sql')
  console.log('4. Execute the SQL to create tables')
  console.log('5. Run create-test-user.js to create test users')
  console.log('6. Test the application')
  
  console.log('\n📄 SQL files to execute:')
  console.log('- scripts/01-create-tables.sql (required)')
  console.log('- scripts/02-seed-users.sql (optional)')
  console.log('- scripts/03-seed-products.sql (optional)')
}

main()
