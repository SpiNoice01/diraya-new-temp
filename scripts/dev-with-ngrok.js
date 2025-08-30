const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 Starting development server with ngrok tunnel...\n')

// Start Next.js development server
console.log('1️⃣ Starting Next.js development server...')
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
})

// Wait a bit for Next.js to start
setTimeout(() => {
  console.log('\n2️⃣ Starting ngrok tunnel...')
  
  // Start ngrok tunnel
  const ngrokProcess = spawn('ngrok', ['http', '3000'], {
    stdio: 'inherit',
    shell: true
  })

  console.log('\n🌐 Your app will be available at:')
  console.log('   Local:  http://localhost:3000')
  console.log('   Tunnel: Check ngrok output above for HTTPS URL')
  console.log('\n📋 Setup Instructions:')
  console.log('1. Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok.io)')
  console.log('2. Go to Midtrans Dashboard → Settings → Configuration')
  console.log('3. Set Notification URL: https://your-ngrok-url.ngrok.io/api/payment/webhook')
  console.log('4. Set Redirect URLs:')
  console.log('   - Finish: https://your-ngrok-url.ngrok.io/payment/success')
  console.log('   - Unfinish: https://your-ngrok-url.ngrok.io/payment/pending')
  console.log('   - Error: https://your-ngrok-url.ngrok.io/payment/error')
  console.log('\n⚠️  Remember: ngrok URL changes every restart (unless you have paid plan)')
  console.log('\n🔍 Test webhook: GET https://your-ngrok-url.ngrok.io/api/payment/webhook')

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...')
    nextProcess.kill()
    ngrokProcess.kill()
    process.exit()
  })

}, 3000)

// Handle Next.js process exit
nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`)
  process.exit(code)
})

