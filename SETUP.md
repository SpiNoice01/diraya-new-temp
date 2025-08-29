# 🚀 Setup Guide - Katering Aqiqah

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account
- Git

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd diraya-new-temp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Setup Supabase Database

#### Option A: Manual Setup (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project or select existing project
3. Go to **SQL Editor**
4. Copy and paste content from `scripts/01-create-tables.sql`
5. Execute the SQL

#### Option B: Automated Setup
```bash
# Check database structure
node scripts/setup-database.js
```

### 5. Create Test Users
```bash
# Create test users with valid credentials
node scripts/create-test-user.js
```

### 6. Test Setup
```bash
# Test connection and authentication
node scripts/test-supabase-connection.js
node scripts/test-login.js
```

### 7. Start Development Server
```bash
npm run dev
```

## 🔐 Test Credentials

After running `create-test-user.js`, you can use these credentials:

### Customer Account
- **Email**: `test@example.com`
- **Password**: `password123`
- **Access**: Customer dashboard

### Admin Account
- **Email**: `admin@kateringaqiqah.com`
- **Password**: `admin123`
- **Access**: Admin dashboard

## 📁 Project Structure

```
diraya-new-temp/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── customer/          # Customer pages
│   ├── katalog/           # Product catalog
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Auth components
│   ├── customer/         # Customer components
│   └── ui/               # UI components
├── lib/                  # Utilities and services
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   ├── supabase/         # Supabase configuration
│   └── types/            # TypeScript types
├── scripts/              # Setup and utility scripts
└── public/               # Static assets
```

## 🗄️ Database Schema

### Tables
- **users**: User profiles and authentication
- **products**: Catering packages and products
- **orders**: Customer orders and bookings
- **payments**: Payment tracking and verification

### Key Features
- Row Level Security (RLS) enabled
- Automatic timestamps
- Foreign key relationships
- Indexes for performance

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database & Testing
node scripts/test-supabase-connection.js  # Test Supabase connection
node scripts/create-test-user.js          # Create test users
node scripts/test-login.js                # Test authentication
node scripts/setup-database.js            # Setup database structure
```

## 🎯 Features

### Customer Features
- ✅ User registration and login
- ✅ Product catalog browsing
- ✅ Order placement and tracking
- ✅ Payment management
- ✅ Profile management

### Admin Features
- ✅ Dashboard with statistics
- ✅ Order management
- ✅ Customer management
- ✅ Product management
- ✅ Payment verification
- ✅ Reports and analytics

### Technical Features
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Supabase integration
- ✅ Authentication system
- ✅ Role-based access control
- ✅ Error handling
- ✅ Loading states

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid login credentials"
- Run `node scripts/create-test-user.js` to create test users
- Check environment variables in `.env.local`
- Verify Supabase project is active

#### 2. "Failed to fetch"
- Check internet connection
- Verify Supabase URL and API keys
- Restart development server

#### 3. "Table does not exist"
- Run database setup script
- Check SQL execution in Supabase dashboard
- Verify table names and schema

### Debug Commands
```bash
# Test connection
node scripts/test-supabase-connection.js

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📚 Documentation

- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search existing issues
3. Create new issue with detailed information
4. Include error messages and steps to reproduce

---

**Happy Coding! 🎉**
