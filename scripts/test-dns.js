// Test DNS Resolution for Supabase
const dns = require('dns')
const { promisify } = require('util')

const resolve4 = promisify(dns.resolve4)
const resolveCname = promisify(dns.resolveCname)

const supabaseUrl = 'iqxhehfyqzuymxjfgqry.supabase.co'

async function testDNS() {
  console.log('🔍 Testing DNS Resolution...')
  console.log('Domain:', supabaseUrl)
  
  try {
    // Test IPv4 resolution
    console.log('\n1. Testing IPv4 resolution...')
    const ipv4 = await resolve4(supabaseUrl)
    console.log('✅ IPv4 resolved:', ipv4)
    
    // Test CNAME resolution
    console.log('\n2. Testing CNAME resolution...')
    try {
      const cname = await resolveCname(supabaseUrl)
      console.log('✅ CNAME resolved:', cname)
    } catch (cnameError) {
      console.log('ℹ️ No CNAME record (this is normal)')
    }
    
    // Test connection to resolved IP
    console.log('\n3. Testing connection to resolved IP...')
    const testIP = ipv4[0]
    console.log('Testing connection to:', testIP)
    
    // Simple HTTP test
    const https = require('https')
    const testConnection = () => {
      return new Promise((resolve, reject) => {
        const req = https.request({
          hostname: supabaseUrl,
          port: 443,
          path: '/auth/v1/health',
          method: 'GET',
          timeout: 5000
        }, (res) => {
          console.log('✅ Connection successful, status:', res.statusCode)
          resolve(res.statusCode)
        })
        
        req.on('error', (error) => {
          console.log('❌ Connection failed:', error.message)
          reject(error)
        })
        
        req.on('timeout', () => {
          req.destroy()
          reject(new Error('Connection timeout'))
        })
        
        req.end()
      })
    }
    
    await testConnection()
    
  } catch (error) {
    console.error('❌ DNS Resolution failed:', error.message)
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Possible solutions:')
      console.log('1. Check internet connection')
      console.log('2. Try different DNS server:')
      console.log('   - Google DNS: 8.8.8.8, 8.8.4.4')
      console.log('   - Cloudflare: 1.1.1.1, 1.0.0.1')
      console.log('3. Check firewall/antivirus')
      console.log('4. Try VPN or different network')
      console.log('5. Check if domain is correct')
    }
  }
}

testDNS()
