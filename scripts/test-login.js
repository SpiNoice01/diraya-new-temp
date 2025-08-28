// Test Login Script
// Run this in browser console to test login functionality

console.log('Testing Login Functionality...');

// Test with sample user
const testLogin = async () => {
  try {
    // Assuming you have a test user registered
    const testEmail = 'test@example.com';
    const testPassword = 'test123';
    
    console.log(`Testing login with: ${testEmail}`);
    
    // This would be called through the UI
    console.log('To test login:');
    console.log('1. Go to /auth/login');
    console.log('2. Enter credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log('3. Check browser console for debug output');
    console.log('4. Should redirect to dashboard after successful login');
    
    // Test admin login
    console.log('\nFor admin access:');
    console.log('   Email: admin@kateringaqiqah.com');
    console.log('   Password: admin123');
    console.log('   Should redirect to /admin/dashboard');
    
  } catch (error) {
    console.error('Test error:', error);
  }
};

testLogin();
