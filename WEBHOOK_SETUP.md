# 🔗 Webhook Setup Guide - Midtrans Integration

Panduan lengkap untuk setup webhook URL Midtrans di berbagai environment.

## 🚨 **PENTING: Webhook URL Requirements**

❌ **TIDAK BISA menggunakan localhost langsung:**
```
❌ http://localhost:3000/api/payment/webhook
❌ http://127.0.0.1:3000/api/payment/webhook
```

✅ **HARUS menggunakan URL yang accessible dari internet:**
```
✅ https://abc123.ngrok.io/api/payment/webhook
✅ https://your-app.vercel.app/api/payment/webhook
```

---

## 🛠️ **Development Environment**

### **Option 1: Menggunakan ngrok (Recommended)**

#### **Setup ngrok:**
```bash
# 1. Install ngrok (sudah terinstall)
npm install -g ngrok

# 2. Start development dengan ngrok
npm run dev:ngrok
```

#### **Setelah ngrok berjalan:**
1. Lihat output ngrok untuk mendapatkan HTTPS URL
2. Copy URL tersebut (contoh: `https://abc123.ngrok.io`)

#### **Setup di Midtrans Dashboard:**
1. Login ke [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Pilih environment **Sandbox**
3. Masuk ke **Settings** → **Configuration**
4. Set **Notification URL**:
   ```
   https://abc123.ngrok.io/api/payment/webhook
   ```
5. Set **Redirect URLs**:
   ```
   Finish:   https://abc123.ngrok.io/payment/success
   Unfinish: https://abc123.ngrok.io/payment/pending
   Error:    https://abc123.ngrok.io/payment/error
   ```

#### **⚠️ Catatan penting ngrok:**
- **Free Plan**: URL berubah setiap restart
- **Paid Plan**: Bisa pakai custom subdomain
- Harus update Midtrans setiap kali restart ngrok

### **Option 2: Menggunakan LocalTunnel**
```bash
# Install dan jalankan
npx localtunnel --port 3000

# URL akan muncul seperti: https://abc123.loca.lt
```

### **Option 3: Menggunakan Cloudflare Tunnel**
```bash
# Install cloudflared
# Download dari: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

# Jalankan tunnel
cloudflared tunnel --url http://localhost:3000
```

---

## 🚀 **Production Environment**

### **Option 1: Deploy ke Vercel (Gratis & Mudah)**

#### **Deploy ke Vercel:**
```bash
# 1. Build project
npm run build

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
vercel --prod
```

#### **Setup webhook di Midtrans:**
1. Switch ke environment **Production**
2. Set **Notification URL**:
   ```
   https://your-app-name.vercel.app/api/payment/webhook
   ```
3. Set **Redirect URLs**:
   ```
   Finish:   https://your-app-name.vercel.app/payment/success
   Unfinish: https://your-app-name.vercel.app/payment/pending
   Error:    https://your-app-name.vercel.app/payment/error
   ```

### **Option 2: Deploy ke Netlify**
```bash
# Build dan deploy
npm run build
npx netlify deploy --prod --dir=.next
```

### **Option 3: Deploy ke Railway**
```bash
# Deploy via Railway CLI
railway deploy
```

---

## 🧪 **Testing Webhook**

### **Test webhook endpoint:**
```bash
# Test dengan curl
curl -X GET https://your-webhook-url/api/payment/webhook

# Expected response:
{
  "message": "Midtrans webhook endpoint is active",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### **Test dengan Midtrans simulator:**
1. Buat test transaction di Midtrans Dashboard
2. Check apakah webhook notification diterima
3. Verify di logs aplikasi

---

## 📋 **Step-by-Step Setup (Development)**

### **1. Start aplikasi dengan ngrok:**
```bash
npm run dev:ngrok
```

### **2. Copy ngrok URL:**
Output akan menampilkan:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

### **3. Setup Midtrans Dashboard:**

#### **A. Login ke Midtrans:**
- Buka [Midtrans Dashboard](https://dashboard.midtrans.com/)
- Login dengan akun Anda

#### **B. Pilih Environment:**
- Untuk testing: **Sandbox**
- Untuk production: **Production**

#### **C. Configure URLs:**
- Masuk ke **Settings** → **Configuration**
- **Payment Notification URL:**
  ```
  https://abc123.ngrok.io/api/payment/webhook
  ```
- **Finish Redirect URL:**
  ```
  https://abc123.ngrok.io/payment/success
  ```
- **Unfinish Redirect URL:**
  ```
  https://abc123.ngrok.io/payment/pending
  ```
- **Error Redirect URL:**
  ```
  https://abc123.ngrok.io/payment/error
  ```

### **4. Update environment variables:**
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
```

### **5. Test integration:**
```bash
npm run test:payment
```

---

## 🔍 **Troubleshooting**

### **Problem: Webhook tidak diterima**
**Solusi:**
1. Check apakah ngrok masih running
2. Verify URL di Midtrans Dashboard
3. Check firewall settings
4. Test endpoint manual dengan curl

### **Problem: ngrok URL berubah terus**
**Solusi:**
1. Upgrade ke ngrok paid plan untuk fixed URL
2. Atau deploy ke Vercel untuk permanent URL
3. Gunakan script automation untuk update URL

### **Problem: Payment notification error**
**Solusi:**
1. Check signature verification
2. Verify server key di environment
3. Check database connection
4. Check logs untuk error details

---

## 📚 **Resources**

- [Midtrans Dashboard](https://dashboard.midtrans.com/)
- [Midtrans Documentation](https://docs.midtrans.com/)
- [ngrok Documentation](https://ngrok.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎯 **Quick Commands**

```bash
# Development dengan ngrok
npm run dev:ngrok

# Test payment integration
npm run test:payment

# Deploy ke Vercel
vercel --prod

# Test webhook
curl -X GET https://your-url/api/payment/webhook
```

---

**Pilih option yang sesuai dengan kebutuhan development Anda! 🚀**

