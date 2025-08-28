export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  productId: string
  productName: string
  quantity: number
  eventDate: string
  eventTime: string
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "delivered" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock orders data
export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "Ahmad Wijaya",
    customerEmail: "ahmad@email.com",
    customerPhone: "08123456789",
    customerAddress: "Jl. Merdeka No. 123, Jakarta Selatan",
    productId: "paket-standar-50",
    productName: "Paket Standar 50 Porsi",
    quantity: 1,
    eventDate: "2024-12-25",
    eventTime: "12:00",
    totalAmount: 1500000,
    status: "confirmed",
    paymentStatus: "paid",
    notes: "Mohon disiapkan tepat waktu untuk acara aqiqah anak",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Siti Nurhaliza",
    customerEmail: "siti@email.com",
    customerPhone: "08987654321",
    customerAddress: "Jl. Sudirman No. 456, Jakarta Pusat",
    productId: "paket-premium-75",
    productName: "Paket Premium 75 Porsi",
    quantity: 1,
    eventDate: "2024-12-28",
    eventTime: "11:30",
    totalAmount: 2500000,
    status: "pending",
    paymentStatus: "pending",
    notes: "Tolong sediakan meja tambahan untuk tamu",
    createdAt: "2024-12-21T09:15:00Z",
    updatedAt: "2024-12-21T09:15:00Z",
  },
]

export const orderStatuses = [
  { id: "pending", name: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800" },
  { id: "confirmed", name: "Dikonfirmasi", color: "bg-blue-100 text-blue-800" },
  { id: "preparing", name: "Sedang Dipersiapkan", color: "bg-orange-100 text-orange-800" },
  { id: "delivered", name: "Dikirim", color: "bg-purple-100 text-purple-800" },
  { id: "completed", name: "Selesai", color: "bg-green-100 text-green-800" },
  { id: "cancelled", name: "Dibatalkan", color: "bg-red-100 text-red-800" },
]

export const paymentStatuses = [
  { id: "pending", name: "Menunggu Pembayaran", color: "bg-yellow-100 text-yellow-800" },
  { id: "paid", name: "Sudah Dibayar", color: "bg-green-100 text-green-800" },
  { id: "failed", name: "Pembayaran Gagal", color: "bg-red-100 text-red-800" },
]
