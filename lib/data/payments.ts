export interface Payment {
  id: string
  orderId: string
  amount: number
  method: "bank_transfer" | "e_wallet" | "cash"
  status: "pending" | "uploaded" | "verified" | "failed"
  proofImage?: string
  bankAccount?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  uploadedAt?: string
  verifiedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock payment data
export const payments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    amount: 1500000,
    method: "bank_transfer",
    status: "verified",
    proofImage: "/placeholder.svg?height=400&width=300&text=Transfer+Receipt",
    bankAccount: {
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Katering Aqiqah",
    },
    uploadedAt: "2024-12-20T11:00:00Z",
    verifiedAt: "2024-12-20T14:30:00Z",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    amount: 2500000,
    method: "bank_transfer",
    status: "pending",
    bankAccount: {
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Katering Aqiqah",
    },
    createdAt: "2024-12-21T09:15:00Z",
    updatedAt: "2024-12-21T09:15:00Z",
  },
]

export const bankAccounts = [
  {
    id: "bca",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountName: "Katering Aqiqah",
    logo: "/placeholder.svg?height=40&width=80&text=BCA",
  },
  {
    id: "mandiri",
    bankName: "Bank Mandiri",
    accountNumber: "0987654321",
    accountName: "Katering Aqiqah",
    logo: "/placeholder.svg?height=40&width=80&text=Mandiri",
  },
  {
    id: "bni",
    bankName: "Bank BNI",
    accountNumber: "5555666677",
    accountName: "Katering Aqiqah",
    logo: "/placeholder.svg?height=40&width=80&text=BNI",
  },
]

export const paymentStatuses = [
  {
    id: "pending",
    name: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-800",
    description: "Silakan lakukan pembayaran sesuai instruksi",
  },
  {
    id: "uploaded",
    name: "Bukti Diunggah",
    color: "bg-blue-100 text-blue-800",
    description: "Bukti pembayaran sedang diverifikasi",
  },
  {
    id: "verified",
    name: "Pembayaran Terverifikasi",
    color: "bg-green-100 text-green-800",
    description: "Pembayaran berhasil diverifikasi",
  },
  {
    id: "failed",
    name: "Pembayaran Gagal",
    color: "bg-red-100 text-red-800",
    description: "Pembayaran tidak valid, silakan hubungi customer service",
  },
]
