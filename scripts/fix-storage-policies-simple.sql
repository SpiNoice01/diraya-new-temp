-- Simple Storage Setup for Avatar Upload
-- Run this script in Supabase Dashboard > SQL Editor

-- 1. Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 2. Verify bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'avatars';

-- 3. Note: Supabase automatically handles RLS policies for storage
-- Users with valid auth.uid() can upload to any bucket
-- Public buckets allow public read access
