# Alur Kerja Register dan Penyimpanan Database

## **Overview**

Proses register di aplikasi Katering Aqiqah menggunakan **Supabase Auth** untuk autentikasi dan **PostgreSQL** untuk menyimpan data user profile. Proses ini terdiri dari dua langkah utama:

1. **Membuat akun di Supabase Auth** (email + password)
2. **Menyimpan profile user di tabel `users`**

## **Alur Kerja Lengkap**

### **1. User Input dan Validation**
```
User mengisi form → Client-side validation → Server-side validation
```

**Field yang diperlukan:**
- Nama lengkap (required)
- Email (required, unique)
- Nomor telepon (required)
- Alamat lengkap (required)
- Password (min 6 karakter)
- Konfirmasi password

### **2. Proses Register di Frontend**

**File:** `components/auth/register-form.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Validation
  if (formData.password !== formData.confirmPassword) {
    setError("Password dan konfirmasi password tidak cocok")
    return
  }

  // 2. Call signUp from auth context
  const result = await signUp(
    formData.email,
    formData.password,
    {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      role: 'customer',
    }
  )

  // 3. Handle result
  if (result.error) {
    setError(result.error)
  } else {
    setSuccess("Akun berhasil dibuat!")
    // Redirect to login
  }
}
```

### **3. Auth Context Integration**

**File:** `lib/contexts/auth-context.tsx`

```typescript
const signUp = async (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // 1. Create user in Supabase Auth
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (user) {
      // 2. Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: user.id,           // Use Supabase Auth user ID
          email: user.email!,
          ...userData,           // name, phone, address, role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}
```

### **4. Database Schema**

**Tabel `users`:**
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

**Tabel `auth.users` (Supabase Auth):**
- `id`: UUID dari Supabase Auth
- `email`: Email user
- `encrypted_password`: Password yang di-hash
- `email_confirmed_at`: Timestamp konfirmasi email
- `created_at`, `updated_at`: Timestamps

### **5. Row Level Security (RLS)**

**Policy untuk tabel `users`:**
```sql
-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
```

## **Flow Diagram**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input   │───▶│  Validation      │───▶│  Supabase Auth  │
│   (Form Data)  │    │  (Client/Server) │    │  (signUp)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Success      │◀───│  Create Profile  │◀───│  Auth User ID   │
│   Redirect     │    │  (users table)   │    │  (UUID)         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## **Data yang Disimpan**

### **1. Supabase Auth (`auth.users`)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "encrypted_password": "$2b$10$hashed_password_here",
  "email_confirmed_at": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### **2. User Profile (`public.users`)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "Ahmad Wijaya",
  "phone": "08123456789",
  "address": "Jl. Merdeka No. 123, Jakarta",
  "role": "customer",
  "avatar_url": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## **Error Handling**

### **Common Errors:**
1. **Email already exists**: `User already registered`
2. **Weak password**: `Password should be at least 6 characters`
3. **Invalid email format**: `Invalid email format`
4. **Database constraint violation**: `duplicate key value violates unique constraint`

### **Error Response Format:**
```typescript
{
  error: "Error message here" | null
}
```

## **Security Features**

### **1. Password Security**
- Password di-hash menggunakan bcrypt
- Minimal 6 karakter
- Stored di Supabase Auth (not accessible via SQL)

### **2. Data Protection**
- Row Level Security (RLS) enabled
- Users hanya bisa akses data sendiri
- Admin bisa akses semua data

### **3. Email Verification**
- Email harus diverifikasi sebelum login
- Konfirmasi email otomatis dari Supabase

## **Testing Register Flow**

### **1. Setup Environment**
```bash
# Copy environment template
cp .env.local.example .env.local

# Fill in Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **2. Test Registration**
```bash
# Start development server
npm run dev

# Navigate to /auth/register
# Fill form with test data
# Submit and check database
```

### **3. Verify Database**
```sql
-- Check auth.users
SELECT * FROM auth.users WHERE email = 'test@example.com';

-- Check public.users
SELECT * FROM public.users WHERE email = 'test@example.com';
```

## **Troubleshooting**

### **1. "User already registered"**
- Email sudah ada di database
- Check `auth.users` table

### **2. "RLS policy violation"**
- User belum login
- Check RLS policies

### **3. "Invalid API key"**
- Environment variables salah
- Restart development server

### **4. "Relation does not exist"**
- Database schema belum dibuat
- Run `supabase-setup.sql` script

## **Next Steps**

Setelah register berhasil:
1. **Email verification** (otomatis dari Supabase)
2. **Login** dengan email dan password
3. **Complete profile** (optional fields)
4. **Start ordering** katering services

## **Performance Considerations**

- **Indexes** pada email untuk fast lookup
- **UUID** untuk distributed systems
- **Timestamps** untuk audit trail
- **RLS** untuk security tanpa performance impact
