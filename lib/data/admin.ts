export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  pendingOrders: number
  pendingPayments: number
  completedOrders: number
  monthlyRevenue: number
  monthlyOrders: number
}

// Mock admin statistics
export const adminStats: AdminStats = {
  totalOrders: 156,
  totalRevenue: 234500000,
  totalCustomers: 89,
  pendingOrders: 12,
  pendingPayments: 8,
  completedOrders: 134,
  monthlyRevenue: 45600000,
  monthlyOrders: 23,
}

// Mock recent activities
export const recentActivities = [
  {
    id: "1",
    type: "order",
    message: "Pesanan baru #ORD-003 dari Ahmad Wijaya",
    timestamp: "2024-12-21T10:30:00Z",
  },
  {
    id: "2",
    type: "payment",
    message: "Pembayaran #PAY-002 telah diverifikasi",
    timestamp: "2024-12-21T09:15:00Z",
  },
  {
    id: "3",
    type: "customer",
    message: "Customer baru: Siti Nurhaliza bergabung",
    timestamp: "2024-12-20T16:45:00Z",
  },
  {
    id: "4",
    type: "order",
    message: "Pesanan #ORD-001 telah selesai",
    timestamp: "2024-12-20T14:30:00Z",
  },
]
