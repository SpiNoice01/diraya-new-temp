# 🔧 Troubleshooting Guide - Katering Aqiqah

## 🚨 Error: "Invalid login credentials"

### Penyebab Umum:
1. **User belum terdaftar** di Supabase Auth
2. **Password salah** atau tidak sesuai
3. **Email belum dikonfirmasi** (jika email confirmation diaktifkan)
4. **Koneksi ke Supabase** bermasalah
5. **Environment variables** tidak dikonfigurasi dengan benar

### Solusi Step-by-Step:

#### 1. ✅ Setup Environment Variables
```bash
# Copy file contoh
cp env.example .env.local

# Edit .env.local dengan credentials Supabase Anda
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### 2. 🔍 Test Koneksi Supabase
```bash
# Install dependencies jika belum
npm install

# Test koneksi
node scripts/test-supabase-connection.js
```

#### 3. 🗄️ Setup Database
```bash
# Check database structure
node scripts/setup-database.js

# Atau manual via Supabase Dashboard:
# 1. Buka Supabase Dashboard
# 2. SQL Editor
# 3. Copy paste content dari scripts/01-create-tables.sql
# 4. Execute SQL
```

#### 4. 👤 Buat Test Users
```bash
# Buat user test dengan password yang valid
node scripts/create-test-user.js
```

#### 5. 🧪 Test Login
Gunakan credentials yang dibuat:
- **Customer**: `test@example.com` / `password123`
- **Admin**: `admin@kateringaqiqah.com` / `admin123`

## 🔐 Masalah Autentikasi Lainnya

### Error: "Email not confirmed"
**Solusi:**
1. Cek inbox email untuk link konfirmasi
2. Atau gunakan service role key untuk auto-confirm:
```javascript
// Di create-test-user.js
email_confirm: true
```

### Error: "User not found"
**Solusi:**
1. Pastikan user terdaftar di Supabase Auth
2. Pastikan profile user ada di tabel `users`
3. Cek RLS (Row Level Security) policies

### Error: "Network error" atau "fetch failed"
**Solusi:**
1. Cek koneksi internet
2. Pastikan Supabase project aktif
3. Cek URL dan API key
4. Cek rate limits

## 🛠️ Debug Mode

### Enable Debug Logging
```javascript
// Di lib/supabase/client.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'katering-aqiqah'
    }
  }
})
```

### Check Browser Console
1. Buka Developer Tools (F12)
2. Tab Console
3. Lihat error messages dan logs

## 📋 Checklist Setup

- [ ] Environment variables dikonfigurasi
- [ ] Supabase project aktif
- [ ] Database tables dibuat
- [ ] Test users dibuat
- [ ] Koneksi berhasil ditest
- [ ] Login berfungsi

## 🆘 Masih Bermasalah?

### 1. Reset Database
```sql
-- Di Supabase SQL Editor
DROP TABLE IF EXISTS payments, orders, products, users CASCADE;
-- Kemudian jalankan scripts/01-create-tables.sql lagi
```

### 2. Clear Browser Data
- Clear cookies dan local storage
- Coba di incognito/private mode

### 3. Check Supabase Dashboard
- Authentication > Users (cek user ada)
- Table Editor > users (cek profile ada)
- Logs > API (cek error logs)

### 4. Contact Support
Jika masih bermasalah, siapkan informasi:
- Error message lengkap
- Browser dan OS
- Supabase project URL
- Steps to reproduce

## 📞 Quick Commands

```bash
# Test koneksi
node scripts/test-supabase-connection.js

# Buat test users
node scripts/create-test-user.js

# Setup database
node scripts/setup-database.js

# Start development server
npm run dev
```

## 🎯 Expected Flow

1. **Register** → User dibuat di Auth + Profile di tabel users
2. **Login** → Auth check + Profile fetch
3. **Dashboard** → Redirect berdasarkan role (customer/admin)

## 🔍 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Invalid credentials | User tidak ada | Buat user via register atau script |
| Email not confirmed | Email confirmation aktif | Auto-confirm atau cek email |
| Network error | Koneksi bermasalah | Cek internet & Supabase status |
| RLS error | Policy blocking | Cek RLS policies di Supabase |
| Profile not found | Profile tidak dibuat | Pastikan signUp membuat profile |
