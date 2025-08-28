-- Supabase Database Setup Script
-- Jalankan script ini di SQL Editor Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
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

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    servings INTEGER NOT NULL,
    features TEXT[] NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON public.products
    FOR SELECT USING (true);

-- Only admins can modify products
CREATE POLICY "Only admins can modify products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can modify orders
CREATE POLICY "Only admins can modify orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Users can view payments for their own orders
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
        )
    );

-- Users can create payments for their own orders
CREATE POLICY "Users can create own payments" ON public.payments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
        )
    );

-- Only admins can modify payments
CREATE POLICY "Only admins can modify payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Insert sample admin user (password: admin123)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@kateringaqiqah.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Insert admin profile
INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    address,
    role,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@kateringaqiqah.com'),
    'admin@kateringaqiqah.com',
    'Administrator',
    '08123456789',
    'Jl. Admin No. 1, Jakarta',
    'admin',
    NOW(),
    NOW()
);

-- Insert sample products
INSERT INTO public.products (
    name,
    description,
    price,
    image_url,
    category,
    servings,
    features,
    is_popular,
    created_at,
    updated_at
) VALUES 
(
    'Paket Ekonomis 25 Porsi',
    'Paket hemat untuk acara aqiqah keluarga kecil dengan menu lengkap dan berkualitas',
    750000,
    '/indonesian-catering-food-spread-with-rice-and-dish.png',
    'ekonomis',
    25,
    ARRAY['Nasi putih', 'Ayam gulai', 'Sayur lodeh', 'Kerupuk', 'Sambal', 'Air mineral'],
    false,
    NOW(),
    NOW()
),
(
    'Paket Standar 50 Porsi',
    'Paket populer dengan menu beragam dan porsi yang cukup untuk acara aqiqah menengah',
    1500000,
    '/elegant-indonesian-buffet-catering-setup.png',
    'standar',
    50,
    ARRAY['Nasi putih & nasi kuning', 'Ayam gulai & rendang', 'Sayur lodeh & tumis kangkung', 'Kerupuk & emping', 'Sambal & acar', 'Air mineral & teh manis'],
    true,
    NOW(),
    NOW()
),
(
    'Paket Premium 75 Porsi',
    'Paket premium dengan menu mewah dan pelayanan terbaik untuk acara aqiqah yang berkesan',
    2500000,
    '/luxury-indonesian-catering-with-traditional-decora.png',
    'premium',
    75,
    ARRAY['Nasi putih, kuning & uduk', 'Ayam gulai, rendang & bakar', 'Sayur lodeh, tumis kangkung & gado-gado', 'Kerupuk, emping & rempeyek', 'Sambal, acar & lalap', 'Air mineral, teh manis & es jeruk', 'Buah potong'],
    false,
    NOW(),
    NOW()
),
(
    'Paket Deluxe 100 Porsi',
    'Paket terlengkap dengan menu istimewa dan dekorasi menarik untuk acara aqiqah besar',
    3500000,
    '/grand-indonesian-feast-catering-with-decorative-se.png',
    'deluxe',
    100,
    ARRAY['Nasi putih, kuning, uduk & liwet', 'Ayam gulai, rendang, bakar & opor', 'Sayur lodeh, tumis kangkung, gado-gado & sop', 'Kerupuk, emping, rempeyek & kacang', 'Sambal, acar, lalap & asinan', 'Air mineral, teh manis, es jeruk & kopi', 'Buah potong & es buah', 'Dekorasi meja'],
    false,
    NOW(),
    NOW()
),
(
    'Paket Kambing 50 Porsi',
    'Paket spesial dengan menu kambing untuk tradisi aqiqah yang lebih lengkap',
    2800000,
    '/traditional-indonesian-goat-curry-catering-spread.png',
    'spesial',
    50,
    ARRAY['Nasi putih & nasi kuning', 'Gulai kambing', 'Sate kambing', 'Sayur lodeh', 'Kerupuk & emping', 'Sambal & acar', 'Air mineral & teh manis'],
    true,
    NOW(),
    NOW()
),
(
    'Paket Kambing 100 Porsi',
    'Paket kambing premium untuk acara aqiqah besar dengan cita rasa autentik',
    5500000,
    '/premium-indonesian-goat-feast-catering-with-tradit.png',
    'spesial',
    100,
    ARRAY['Nasi putih, kuning & uduk', 'Gulai kambing', 'Sate kambing', 'Rendang kambing', 'Sayur lodeh & tumis kangkung', 'Kerupuk, emping & rempeyek', 'Sambal, acar & lalap', 'Air mineral, teh manis & es jeruk', 'Buah potong', 'Dekorasi tradisional'],
    false,
    NOW(),
    NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
