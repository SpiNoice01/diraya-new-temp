-- Setup Products Table and Initial Data
-- Run this script in your Supabase SQL Editor

-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(50) NOT NULL,
  servings INTEGER NOT NULL DEFAULT 50,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to manage products (for admin)
CREATE POLICY "Allow authenticated users to manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial product data
INSERT INTO products (name, description, price, image_url, category, servings, features, is_popular) VALUES
(
  'Paket Ekonomis Aqiqah',
  'Paket katering aqiqah dengan harga terjangkau namun tetap berkualitas. Cocok untuk acara keluarga yang sederhana.',
  2500000,
  '/traditional-indonesian-goat-curry-catering-spread.png',
  'ekonomis',
  50,
  ARRAY['Menu Lengkap', 'Minuman', 'Dekorasi Sederhana', 'Pelayanan 4 Jam'],
  false
),
(
  'Paket Standar Aqiqah',
  'Paket katering aqiqah standar dengan menu lengkap dan porsi yang cukup untuk 50-100 tamu.',
  3500000,
  '/elegant-indonesian-buffet-catering-setup.png',
  'standar',
  100,
  ARRAY['Menu Lengkap', 'Minuman', 'Dekorasi Menengah', 'Pelayanan 6 Jam', 'Tenda'],
  true
),
(
  'Paket Premium Aqiqah',
  'Paket katering aqiqah premium dengan menu mewah dan pelayanan VIP. Cocok untuk acara besar.',
  5000000,
  '/grand-indonesian-feast-catering-with-decorative-se.png',
  'premium',
  150,
  ARRAY['Menu Premium', 'Minuman Premium', 'Dekorasi Mewah', 'Pelayanan 8 Jam', 'Tenda Mewah', 'Sound System'],
  false
),
(
  'Paket Deluxe Aqiqah',
  'Paket katering aqiqah deluxe dengan menu eksklusif dan dekorasi mewah. Untuk acara spesial.',
  7500000,
  '/luxury-indonesian-catering-with-traditional-decora.png',
  'deluxe',
  200,
  ARRAY['Menu Eksklusif', 'Minuman Premium', 'Dekorasi Deluxe', 'Pelayanan 10 Jam', 'Tenda Deluxe', 'Sound System', 'Fotografer'],
  false
),
(
  'Paket Spesial Aqiqah',
  'Paket katering aqiqah spesial dengan menu kustom dan pelayanan personal. Sesuai permintaan.',
  10000000,
  '/premium-indonesian-goat-feast-catering-with-tradit.png',
  'spesial',
  250,
  ARRAY['Menu Kustom', 'Minuman Premium', 'Dekorasi Kustom', 'Pelayanan 12 Jam', 'Tenda Kustom', 'Sound System', 'Fotografer', 'Videografer'],
  false
),
(
  'Paket Keluarga Aqiqah',
  'Paket katering aqiqah untuk keluarga dengan menu tradisional dan suasana yang hangat.',
  3000000,
  '/traditional-indonesian-goat-curry-catering-spread.png',
  'ekonomis',
  75,
  ARRAY['Menu Tradisional', 'Minuman', 'Dekorasi Sederhana', 'Pelayanan 5 Jam'],
  true
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_popular ON products(is_popular);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

