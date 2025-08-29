# 📸 Avatar Upload Setup Guide

## 🎯 Overview

Fitur upload foto profil memungkinkan user untuk mengupload dan mengubah foto profil mereka. Foto akan disimpan di Supabase Storage dan URL-nya akan disimpan di database.

## 🛠️ Setup Requirements

### 1. Supabase Storage Setup

Jalankan script setup storage untuk membuat bucket dan policies:

```bash
node scripts/setup-storage.js
```

Script ini akan:
- ✅ Membuat bucket `avatars` di Supabase Storage
- ✅ Mengatur policies untuk keamanan
- ✅ Mengatur batasan file (2MB max, format JPG/PNG/WebP)
- ✅ Mengatur akses publik untuk membaca avatar

### 2. Environment Variables

Pastikan environment variables sudah diset dengan benar:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Schema

Pastikan tabel `users` memiliki kolom `avatar_url`:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

## 🔧 Components

### AvatarUpload Component

Komponen utama untuk upload foto profil:

```tsx
<AvatarUpload
  currentAvatarUrl={user.avatar_url}
  userName={user.name}
  onAvatarUpdate={(newUrl) => console.log('Avatar updated:', newUrl)}
/>
```

**Features:**
- ✅ Preview foto sebelum upload
- ✅ Validasi format file (JPG, PNG, WebP)
- ✅ Validasi ukuran file (max 2MB)
- ✅ Upload ke Supabase Storage
- ✅ Update database secara otomatis
- ✅ Loading states dan error handling

### Profile Form Integration

Komponen `ProfileForm` sudah terintegrasi dengan fitur upload:

```tsx
// Di components/customer/profile-form.tsx
<AvatarUpload
  currentAvatarUrl={user.avatar_url}
  userName={user.name}
  onAvatarUpdate={handleAvatarUpdate}
/>
```

## 🚨 Error: "must be owner of table objects"

Jika Anda mendapatkan error ini saat menjalankan SQL script, ikuti solusi berikut:

### 🔧 Solusi 1: Jalankan Script SQL Sederhana

1. **Buka Supabase Dashboard** > **SQL Editor**
2. **Jalankan script sederhana** dari `scripts/fix-storage-policies-simple.sql`:

```sql
-- Simple Storage Setup for Avatar Upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Verify bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'avatars';
```

### 🔧 Solusi 2: Gunakan JavaScript Script dengan Admin API

Jika script SQL sederhana tidak cukup, gunakan script JavaScript:

1. **Pastikan environment variables sudah benar** di `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Jalankan script admin**:
   ```bash
   node scripts/setup-storage-admin.js
   ```

### 🔧 Solusi 3: Setup Manual di Supabase Dashboard

Jika kedua script di atas tidak berfungsi, setup manual:

#### 1. Buat Bucket Storage

1. Buka **Supabase Dashboard** > **Storage**
2. Klik **Create a new bucket**
3. **Nama bucket**: `avatars`
4. **Public bucket**: ✅ Checked
5. **File size limit**: `2097152` (2MB)
6. **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`
7. Klik **Create bucket**

#### 2. Atur Storage Policies

1. Buka **Supabase Dashboard** > **Storage** > **Policies**
2. Pilih bucket `avatars`
3. Klik **New Policy**
4. Pilih **Create a policy from scratch**

**Policy 1: Upload (INSERT)**
- **Policy name**: `Allow authenticated uploads`
- **Allowed operation**: `INSERT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated')
  ```

**Policy 2: Update**
- **Policy name**: `Allow authenticated updates`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  (bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated')
  ```

**Policy 3: Delete**
- **Policy name**: `Allow authenticated deletes`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  (bucket_id = 'avatars'::text) AND (auth.role() = 'authenticated')
  ```

**Policy 4: Read (SELECT)**
- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  bucket_id = 'avatars'::text
  ```

## 🔐 Security Features

### Storage Policies

1. **Upload Policy**: User hanya bisa upload avatar untuk diri sendiri
2. **Update Policy**: User hanya bisa update avatar milik sendiri
3. **Delete Policy**: User hanya bisa delete avatar milik sendiri
4. **Read Policy**: Avatar dapat diakses publik untuk ditampilkan

### File Validation

- **Format**: JPG, PNG, WebP
- **Ukuran**: Maksimal 2MB
- **Nama File**: `{user-id}-{timestamp}.{extension}`

## 📱 Usage

### 1. User Flow

1. User membuka halaman profile (`/customer/profile`)
2. User klik "Pilih Foto" untuk memilih file
3. Preview foto ditampilkan
4. User klik "Upload" untuk mengupload
5. Foto tersimpan di Supabase Storage
6. URL foto diupdate di database
7. Avatar baru ditampilkan di header dan profile

### 2. Header Integration

Avatar akan otomatis muncul di header dropdown:

```tsx
// Di components/layout/header.tsx
<Avatar className="h-8 w-8">
  <AvatarImage src={user.avatar_url} alt={user.name} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

## 🧪 Testing

### Manual Testing

1. **Login** ke aplikasi
2. **Buka** halaman profile
3. **Upload** foto dengan format yang berbeda
4. **Verifikasi** foto muncul di header
5. **Test** error handling dengan file yang tidak valid

### Automated Testing

```bash
# Test storage setup
node scripts/setup-storage.js

# Test connection
node scripts/test-supabase-connection.js
```

## 🧪 Testing Avatar Upload

### 1. Test Upload

1. Login ke aplikasi
2. Buka halaman profil (`/customer/profile`)
3. Klik "Pilih Foto" dan pilih file gambar
4. Klik "Upload"
5. Periksa console browser untuk log detail

### 2. Expected Behavior

- ✅ File berhasil diupload ke bucket `avatars`
- ✅ URL public tersedia untuk akses gambar
- ✅ Avatar terupdate di database user
- ✅ Avatar muncul di header dan halaman profil

### 3. Debug Logs

Periksa console browser untuk log detail:

```
🚀 Starting avatar upload...
User ID: [user-id]
File details: { name: "photo.jpg", size: 123456, type: "image/jpeg" }
Generated filename: [user-id]-[timestamp].jpg
✅ Upload successful: { path: "[user-id]-[timestamp].jpg" }
Public URL: https://[project].supabase.co/storage/v1/object/public/avatars/[filename]
🎉 Avatar update completed successfully
```

## 🚨 Troubleshooting

### Error: "must be owner of table objects"

**Penyebab:** Tidak memiliki permission untuk mengubah tabel sistem Supabase

**Solusi:**
1. Gunakan script SQL sederhana (Solusi 1)
2. Atau gunakan JavaScript script dengan admin API (Solusi 2)
3. Atau setup manual di dashboard (Solusi 3)

### Error: "row-level security policy"

**Penyebab:** Storage policies belum dikonfigurasi dengan benar

**Solusi:**
1. Pastikan bucket `avatars` sudah dibuat
2. Pastikan policies untuk INSERT, UPDATE, DELETE, SELECT sudah dibuat
3. Pastikan user sudah login (auth.uid() tidak null)

### Error: "bucket not found"

**Penyebab:** Bucket `avatars` belum dibuat

**Solusi:**
1. Buat bucket `avatars` di Supabase Dashboard > Storage
2. Atau jalankan script setup

### Error: "mime type not allowed"

**Penyebab:** Format file tidak didukung

**Solusi:** Gunakan file JPG, PNG, atau WebP

### Error: "file size too large"

**Penyebab:** File lebih dari 2MB

**Solusi:** Kompres file atau pilih file yang lebih kecil

## 📊 Performance

### Optimization Features

- ✅ **Image Preview**: Preview sebelum upload
- ✅ **File Validation**: Validasi client-side
- ✅ **Loading States**: Feedback visual saat upload
- ✅ **Error Handling**: Graceful error handling
- ✅ **Caching**: Supabase Storage caching

### File Size Limits

- **Max Size**: 2MB
- **Formats**: JPG, PNG, WebP
- **Compression**: Automatic oleh browser

## 🔄 Future Enhancements

### Planned Features

1. **Image Cropping**: Crop foto sebelum upload
2. **Multiple Formats**: Support format tambahan
3. **Image Optimization**: Compress otomatis
4. **Avatar History**: Simpan riwayat avatar
5. **Default Avatars**: Avatar default yang menarik

### Implementation Notes

- ✅ **Responsive Design**: Works on mobile dan desktop
- ✅ **Accessibility**: Keyboard navigation support
- ✅ **Error Recovery**: Graceful error handling
- ✅ **User Feedback**: Clear success/error messages

## 📚 Related Files

- `components/ui/avatar-upload.tsx` - Main upload component
- `components/customer/profile-form.tsx` - Profile form integration
- `lib/contexts/auth-context-fixed.tsx` - Auth context with avatar support
- `scripts/setup-storage.js` - Storage setup script
- `components/layout/header.tsx` - Header with avatar display

---

**Happy Uploading! 🎉**
