# Troubleshooting Guide - Katering Aqiqah App

## **Error: "Failed to fetch" pada Register**

### **Gejala:**
- Console error: `Error: Failed to fetch`
- Error terjadi di `lib/contexts/auth-context.tsx` line 83
- Form register tidak bisa submit
- Tidak ada response dari server

### **Penyebab Umum:**

#### **1. Environment Variables Tidak Terbaca**
```bash
# Periksa file .env.local
NEXT_PUBLIC_SUPABASE_URL=https://iqxhehfyqzuymxjfgqry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Solusi:**
- Restart development server setelah update `.env.local`
- Pastikan file `.env.local` ada di root project
- Periksa tidak ada spasi atau karakter aneh

#### **2. Supabase Project Tidak Aktif**
- Project mungkin di-suspend karena inactivity
- Rate limits terlampaui
- Project di-delete atau di-rename

**Solusi:**
- Login ke [supabase.com](https://supabase.com)
- Periksa status project
- Aktifkan project jika suspended

#### **3. Network/Firewall Issues**
- Internet connection bermasalah
- Firewall memblokir request
- CORS policy issues

**Solusi:**
- Test koneksi internet
- Cek browser console untuk CORS errors
- Coba di browser/network berbeda

#### **4. Database Schema Belum Dibuat**
- Tabel `users` belum ada
- RLS policies belum dibuat
- Database belum di-setup

**Solusi:**
- Jalankan script `supabase-setup.sql`
- Periksa apakah tabel sudah terbuat

### **Langkah Troubleshooting:**

#### **Step 1: Test Koneksi Supabase**
```bash
# Jalankan script test
node scripts/test-supabase-connection.js
```

**Expected Output:**
```
✅ Session check passed
✅ Database connection passed
✅ Auth endpoint working
```

#### **Step 2: Periksa Environment Variables**
```bash
# Di browser console, jalankan:
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'undefined')
```

#### **Step 3: Test Manual di Browser Console**
```javascript
// Test Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iqxhehfyqzuymxjfgqry.supabase.co',
  'your-anon-key'
)

// Test connection
supabase.auth.getSession().then(console.log)
```

#### **Step 4: Periksa Network Tab**
1. Buka Developer Tools → Network
2. Submit form register
3. Lihat apakah ada request ke Supabase
4. Periksa response dan error details

### **Solusi Spesifik:**

#### **1. Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf .next
# Restart
npm run dev
```

#### **2. Update Supabase Client**
```bash
npm install @supabase/supabase-js@latest
```

#### **3. Periksa Supabase Dashboard**
- Authentication → Settings → Site URL
- Pastikan `http://localhost:3000` ada di Site URL
- Pastikan redirect URLs sudah benar

#### **4. Test dengan Postman/Insomnia**
```http
POST https://iqxhehfyqzuymxjfgqry.supabase.co/auth/v1/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

### **Debug Mode:**

#### **1. Enable Console Logging**
```typescript
// Di auth-context.tsx
console.log('Starting signUp process for email:', email)
console.log('Supabase connection OK, proceeding with signUp')
console.log('User created in auth, ID:', user.id)
```

#### **2. Check Browser Console**
- Error messages
- Network requests
- Supabase responses

#### **3. Check Terminal/Server Logs**
- Next.js server errors
- Environment variable loading
- Build errors

### **Common Error Messages:**

#### **"Invalid API key"**
- API key salah atau expired
- Periksa `.env.local`
- Restart server

#### **"RLS policy violation"**
- Row Level Security policy error
- User belum login
- Periksa RLS policies di Supabase

#### **"relation does not exist"**
- Tabel belum dibuat
- Jalankan database setup script
- Periksa schema name

#### **"fetch failed"**
- Network issue
- Supabase down
- CORS policy
- Rate limiting

### **Prevention:**

#### **1. Environment Variables Validation**
```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL')
}
```

#### **2. Connection Testing**
```typescript
// Test connection on app start
supabase.auth.getSession().then(({ error }) => {
  if (error) console.error('Supabase connection failed:', error)
})
```

#### **3. Error Boundaries**
```typescript
// Wrap auth operations in try-catch
try {
  const result = await signUp(email, password, userData)
} catch (error) {
  console.error('Registration failed:', error)
  // Show user-friendly error
}
```

### **Testing Checklist:**

- [ ] Environment variables terbaca
- [ ] Supabase project aktif
- [ ] Database schema sudah dibuat
- [ ] RLS policies sudah dibuat
- [ ] Network requests berhasil
- [ ] Console tidak ada errors
- [ ] Form submission berhasil
- [ ] User profile tersimpan

### **Next Steps:**

1. **Jalankan test script** untuk identifikasi masalah
2. **Periksa environment variables** dan restart server
3. **Test koneksi manual** di browser console
4. **Periksa Supabase dashboard** untuk project status
5. **Update auth context** dengan error handling yang lebih baik
6. **Test register flow** dengan data valid

### **Support:**

Jika masalah masih berlanjut:
1. Cek [Supabase Status Page](https://status.supabase.com)
2. Periksa [Supabase Documentation](https://supabase.com/docs)
3. Cek [GitHub Issues](https://github.com/supabase/supabase-js/issues)
4. Restart project dari awal jika diperlukan
