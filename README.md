# 🍽️ Katering Aqiqah - Platform Booking Katering Terpercaya

Platform booking katering aqiqah yang dibangun dengan teknologi modern untuk memberikan pengalaman terbaik bagi customer dan admin.

## 🚀 Features

### 👤 User Features
- ✅ **Authentication System** - Login/Register dengan Supabase Auth
- ✅ **Profile Management** - Update profil dan foto avatar
- ✅ **Product Catalog** - Browse paket katering dengan filter dan search
- ✅ **Order Management** - Place orders dan track status
- ✅ **Payment Integration** - Sistem pembayaran yang aman
- ✅ **Responsive Design** - Works perfectly di mobile dan desktop

### 🛠️ Admin Features
- ✅ **Dashboard Analytics** - Statistik dan insights
- ✅ **Order Management** - Kelola semua pesanan customer
- ✅ **Customer Management** - Data dan riwayat customer
- ✅ **Product Management** - Kelola paket katering
- ✅ **Payment Verification** - Verifikasi pembayaran
- ✅ **Reports & Analytics** - Laporan detail dan analytics

### 📸 Avatar Upload Feature
- ✅ **Photo Upload** - Upload foto profil dengan preview
- ✅ **File Validation** - Validasi format dan ukuran file
- ✅ **Supabase Storage** - Penyimpanan aman di cloud
- ✅ **Real-time Update** - Avatar langsung terupdate di header
- ✅ **Security Policies** - Keamanan file upload

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Context
- **Deployment**: Vercel Ready

## 📦 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd diraya-new-temp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Database Setup
```bash
# Setup database tables
node scripts/setup-database.js

# Setup storage for avatars
node scripts/setup-storage.js

# Create test users
node scripts/create-test-user.js
```

### 5. Start Development
```bash
npm run dev
```

## 🔐 Test Credentials

### Customer Account
- **Email**: `test@example.com`
- **Password**: `password123`

### Admin Account
- **Email**: `admin@kateringaqiqah.com`
- **Password**: `admin123`

## 📸 Avatar Upload Setup

### Quick Setup
```bash
# Setup storage bucket and policies
node scripts/setup-storage.js
```

### Features
- ✅ **File Validation**: JPG, PNG, WebP (max 2MB)
- ✅ **Preview**: Preview foto sebelum upload
- ✅ **Security**: User hanya bisa upload avatar sendiri
- ✅ **Real-time**: Avatar langsung terupdate di header

### Usage
1. Login ke aplikasi
2. Buka halaman profile (`/customer/profile`)
3. Klik "Pilih Foto" untuk upload avatar
4. Preview dan klik "Upload"
5. Avatar akan muncul di header dropdown

## 🗄️ Database Schema

### Tables
- **users** - User profiles dengan avatar_url
- **products** - Paket katering
- **orders** - Pesanan customer
- **payments** - Data pembayaran

### Storage
- **avatars** - Bucket untuk foto profil user

## 📱 Pages Structure

```
app/
├── page.tsx                 # Landing page
├── auth/
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Register page
├── katalog/
│   └── page.tsx           # Product catalog
├── customer/
│   ├── dashboard/page.tsx # Customer dashboard
│   ├── profile/page.tsx   # Profile management
│   ├── orders/page.tsx    # Order history
│   └── payments/page.tsx  # Payment management
└── admin/
    ├── dashboard/page.tsx # Admin dashboard
    ├── orders/page.tsx    # Order management
    ├── customers/page.tsx # Customer management
    ├── products/page.tsx  # Product management
    └── payments/page.tsx  # Payment verification
```

## 🎨 Components

### UI Components
- **AvatarUpload** - Upload foto profil dengan preview
- **Header** - Dynamic header dengan avatar dropdown
- **ProfileForm** - Form update profil terintegrasi
- **ProductCard** - Card untuk paket katering
- **OrderCard** - Card untuk pesanan

### Layout Components
- **Header** - Navigation dengan user menu
- **AuthProvider** - Authentication context
- **ThemeProvider** - Theme management

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database & Storage
node scripts/setup-database.js    # Setup database
node scripts/setup-storage.js     # Setup storage
node scripts/create-test-user.js  # Create test users

# Testing
node scripts/test-supabase-connection.js  # Test connection
node scripts/test-login.js                # Test authentication
```

## 🚀 Deployment

### Vercel Deployment
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy otomatis

### Manual Deployment
```bash
npm run build
npm run start
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Issues
```bash
# Test connection
node scripts/test-supabase-connection.js

# Create test users
node scripts/create-test-user.js
```

#### 2. Avatar Upload Issues
```bash
# Setup storage
node scripts/setup-storage.js

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### 3. Database Issues
```bash
# Setup database
node scripts/setup-database.js

# Check tables
node scripts/test-supabase-connection.js
```

## 📚 Documentation

- [Setup Guide](./SETUP.md)
- [Avatar Upload Guide](./AVATAR_UPLOAD_SETUP.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Supabase Setup](./SUPABASE_SETUP.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Jika mengalami masalah:
1. Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search existing issues
3. Create new issue dengan detail lengkap

---

**Happy Coding! 🎉**