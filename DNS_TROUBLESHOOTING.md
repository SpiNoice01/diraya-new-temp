# DNS Troubleshooting Guide - ERR_NAME_NOT_RESOLVED

## **Error: `net::ERR_NAME_NOT_RESOLVED`**

### **Gejala:**
- Console error: `Failed to fetch`
- Network error: `net::ERR_NAME_NOT_RESOLVED`
- Domain `iqxhehfyqzuymxjfgqry.supabase.co` tidak bisa di-resolve
- Aplikasi tidak bisa connect ke Supabase

### **Penyebab:**
1. **DNS Resolution Failure** - Domain tidak bisa di-resolve ke IP address
2. **Internet Connection Issues** - Koneksi internet bermasalah
3. **Firewall/Antivirus** - Software security memblokir koneksi
4. **DNS Server Issues** - DNS server lokal bermasalah
5. **Domain Expired/Invalid** - Domain Supabase tidak valid

## **Langkah Troubleshooting:**

### **Step 1: Test DNS Resolution**

#### **A. Command Line Test**
```bash
# Windows
nslookup iqxhehfyqzuymxjfgqry.supabase.co

# Linux/Mac
dig iqxhehfyqzuymxjfgqry.supabase.co
nslookup iqxhehfyqzuymxjfgqry.supabase.co

# Test ping
ping iqxhehfyqzuymxjfgqry.supabase.co
```

#### **B. Node.js Test Script**
```bash
# Jalankan script test DNS
node scripts/test-dns.js
```

**Expected Output:**
```
🔍 Testing DNS Resolution...
Domain: iqxhehfyqzuymxjfgqry.supabase.co

1. Testing IPv4 resolution...
✅ IPv4 resolved: [IP_ADDRESS]

2. Testing CNAME resolution...
ℹ️ No CNAME record (this is normal)

3. Testing connection to resolved IP...
✅ Connection successful, status: 200
```

### **Step 2: Test Internet Connection**

#### **A. Basic Connectivity**
```bash
# Test basic internet
ping 8.8.8.8
ping google.com

# Test DNS resolution
nslookup google.com
```

#### **B. Test Different DNS Servers**
```bash
# Test dengan Google DNS
nslookup iqxhehfyqzuymxjfgqry.supabase.co 8.8.8.8

# Test dengan Cloudflare DNS
nslookup iqxhehfyqzuymxjfgqry.supabase.co 1.1.1.1
```

### **Step 3: Browser-based Tests**

#### **A. Test di Browser Console**
```javascript
// Test fetch dengan domain
fetch('https://iqxhehfyqzuymxjfgqry.supabase.co/auth/v1/health')
  .then(response => console.log('✅ Success:', response.status))
  .catch(error => console.log('❌ Error:', error.message))

// Test dengan IP langsung (jika DNS gagal)
fetch('https://8.8.8.8')
  .then(response => console.log('✅ IP test OK'))
  .catch(error => console.log('❌ IP test failed:', error.message))
```

#### **B. Test di Network Tab**
1. Buka Developer Tools → Network
2. Refresh halaman
3. Lihat apakah ada request ke Supabase
4. Periksa error details

### **Step 4: Environment Variables Check**

#### **A. Verify .env.local**
```bash
# Pastikan file .env.local ada
ls -la .env*

# Isi file harus benar
cat .env.local
```

**Expected Content:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://iqxhehfyqzuymxjfgqry.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **B. Test Environment Variables**
```javascript
// Di browser console
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : 'undefined')
```

### **Step 5: System-level Solutions**

#### **A. Change DNS Server**
**Windows:**
1. Control Panel → Network and Internet → Network and Sharing Center
2. Change adapter settings → Right-click network adapter
3. Properties → Internet Protocol Version 4 (TCP/IPv4)
4. Use following DNS servers:
   - Preferred: `8.8.8.8`
   - Alternate: `8.8.4.4`

**Mac:**
1. System Preferences → Network
2. Select network → Advanced → DNS
3. Add: `8.8.8.8`, `8.8.4.4`

#### **B. Flush DNS Cache**
```bash
# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux
sudo systemctl restart systemd-resolved
```

#### **C. Disable Firewall/Antivirus Temporarily**
1. **Windows Defender**: Add exception for Node.js
2. **Antivirus**: Disable real-time protection temporarily
3. **Firewall**: Allow Node.js and port 3000

### **Step 6: Alternative Solutions**

#### **A. Use VPN**
- Connect to different network
- Test if issue is network-specific

#### **B. Mobile Hotspot**
- Test dengan network berbeda
- Bypass local network issues

#### **C. Different Browser/Device**
- Test di browser berbeda
- Test di device berbeda

## **Common Solutions:**

### **1. DNS Server Issues**
```bash
# Set DNS to Google
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2
```

### **2. Hosts File Check**
```bash
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

# Pastikan tidak ada entry yang memblokir Supabase
```

### **3. Proxy Settings**
- Check browser proxy settings
- Check system proxy settings
- Disable proxy temporarily

### **4. Network Adapter Reset**
```bash
# Windows
netsh winsock reset
netsh int ip reset
ipconfig /release
ipconfig /renew
```

## **Testing Checklist:**

- [ ] DNS resolution berhasil
- [ ] Internet connection OK
- [ ] Environment variables terbaca
- [ ] Firewall tidak memblokir
- [ ] DNS server berfungsi
- [ ] Domain valid dan aktif
- [ ] Network adapter OK
- [ ] Browser bisa connect

## **Next Steps:**

1. **Jalankan DNS test script**
2. **Test dengan DNS server berbeda**
3. **Periksa firewall/antivirus**
4. **Test di network berbeda**
5. **Contact network admin** jika di corporate network

## **Support:**

Jika masalah masih berlanjut:
1. **Network Administrator** - untuk corporate networks
2. **ISP Support** - untuk home networks
3. **Supabase Support** - untuk domain issues
4. **System Administrator** - untuk system-level issues

## **Prevention:**

1. **Use reliable DNS servers** (8.8.8.8, 1.1.1.1)
2. **Regular network maintenance**
3. **Keep firewall/antivirus updated**
4. **Monitor network performance**
5. **Have backup network options**
