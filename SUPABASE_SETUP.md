# Setup Supabase untuk Aplikasi Katering Aqiqah

## **Langkah-langkah Setup**

### **1. Buat Project Supabase**

1. Kunjungi [supabase.com](https://supabase.com)
2. Login/Sign up dengan GitHub atau Google
3. Klik "New Project"
4. Pilih organization
5. Isi detail project:
   - **Name**: `katering-aqiqah`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih region terdekat (Asia Southeast 1)
6. Klik "Create new project"
7. Tunggu setup selesai (5-10 menit)

### **2. Setup Database**

1. Buka project Supabase yang sudah dibuat
2. Klik menu **SQL Editor** di sidebar kiri
3. Buat **New Query**
4. Copy dan paste seluruh isi file `scripts/supabase-setup.sql`
5. Klik **Run** untuk menjalankan script
6. Script akan membuat:
   - 4 tabel: `users`, `products`, `orders`, `payments`
   - Sample data: 6 produk katering + 1 admin user
   - Row Level Security (RLS) policies
   - Indexes untuk performance

### **3. Setup Authentication**

1. Di Supabase dashboard, klik **Authentication** → **Settings**
2. Scroll ke **Site URL**, isi dengan:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Di **Redirect URLs**, tambahkan:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
4. Klik **Save**

### **4. Setup Environment Variables**

1. Di Supabase dashboard, klik **Settings** → **API**
2. Copy **Project URL** dan **anon public** key
3. Update file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **5. Test Setup**

1. Jalankan aplikasi: `npm run dev`
2. Buka `http://localhost:3000`
3. Test login dengan admin:
   - Email: `admin@kateringaqiqah.com`
   - Password: `admin123`
4. Test katalog produk (harus load dari database)

## **Struktur Database**

### **Tabel Users**
- `id`: UUID (Primary Key)
- `email`: Email user (unique)
- `name`: Nama lengkap
- `phone`: Nomor telepon
- `address`: Alamat lengkap
- `role`: 'customer' atau 'admin'
- `avatar_url`: URL foto profil (optional)
- `created_at`, `updated_at`: Timestamps

### **Tabel Products**
- `id`: UUID (Primary Key)
- `name`: Nama produk
- `description`: Deskripsi produk
- `price`: Harga (decimal)
- `image_url`: URL gambar produk
- `category`: Kategori produk
- `servings`: Jumlah porsi
- `features`: Array fitur-fitur
- `is_popular`: Flag produk populer
- `created_at`, `updated_at`: Timestamps

### **Tabel Orders**
- `id`: UUID (Primary Key)
- `user_id`: Foreign key ke users
- `product_id`: Foreign key ke products
- `quantity`: Jumlah paket
- `event_date`: Tanggal acara
- `event_time`: Waktu acara
- `total_amount`: Total harga
- `status`: Status pesanan
- `payment_status`: Status pembayaran
- `notes`: Catatan tambahan
- `created_at`, `updated_at`: Timestamps

### **Tabel Payments**
- `id`: UUID (Primary Key)
- `order_id`: Foreign key ke orders
- `amount`: Jumlah pembayaran
- `payment_method`: Metode pembayaran
- `status`: Status pembayaran
- `transaction_id`: ID transaksi
- `payment_date`: Tanggal pembayaran
- `created_at`, `updated_at`: Timestamps

## **Row Level Security (RLS)**

Aplikasi menggunakan RLS untuk keamanan data:

- **Users**: Hanya bisa lihat/edit profil sendiri
- **Products**: Bisa dibaca semua user, hanya admin yang bisa edit
- **Orders**: User hanya bisa lihat pesanan sendiri, admin bisa lihat semua
- **Payments**: User hanya bisa lihat pembayaran untuk pesanan sendiri

## **Sample Data**

Setelah menjalankan setup script, akan tersedia:

### **Admin User**
- Email: `admin@kateringaqiqah.com`
- Password: `admin123`
- Role: `admin`

### **6 Produk Katering**
1. Paket Ekonomis 25 Porsi - Rp 750.000
2. Paket Standar 50 Porsi - Rp 1.500.000
3. Paket Premium 75 Porsi - Rp 2.500.000
4. Paket Deluxe 100 Porsi - Rp 3.500.000
5. Paket Kambing 50 Porsi - Rp 2.800.000
6. Paket Kambing 100 Porsi - Rp 5.500.000

## **Troubleshooting**

### **Error: "relation does not exist"**
- Pastikan script SQL sudah dijalankan dengan benar
- Cek apakah tabel sudah terbuat di **Table Editor**

### **Error: "RLS policy violation"**
- Pastikan user sudah login
- Cek apakah RLS policies sudah dibuat
- Pastikan user memiliki role yang sesuai

### **Error: "Invalid API key"**
- Cek environment variables sudah benar
- Pastikan URL dan key dari Supabase dashboard
- Restart development server setelah update .env

### **Login tidak berfungsi**
- Cek apakah admin user sudah dibuat
- Pastikan password hash sudah benar
- Cek console browser untuk error details

## **Next Steps**

Setelah setup berhasil:

1. **Test semua fitur**:
   - Login/Register
   - Browse produk
   - Create order
   - Admin dashboard

2. **Customize data**:
   - Tambah produk baru
   - Update informasi produk
   - Tambah user baru

3. **Deploy ke production**:
   - Update environment variables
   - Setup custom domain
   - Configure production database

## **Support**

Jika ada masalah:
1. Cek [Supabase Documentation](https://supabase.com/docs)
2. Cek console browser dan terminal
3. Pastikan semua langkah setup sudah benar
4. Restart development server jika diperlukan
