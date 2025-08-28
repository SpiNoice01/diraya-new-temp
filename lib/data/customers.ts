export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  joinedAt: string
  totalOrders: number
  totalSpent: number
  avatar?: string
}

// Mock customer data
export const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "Ahmad Wijaya",
    email: "ahmad@email.com",
    phone: "08123456789",
    address: "Jl. Merdeka No. 123, Jakarta Selatan",
    joinedAt: "2024-01-15T10:00:00Z",
    totalOrders: 3,
    totalSpent: 4500000,
    avatar: "/placeholder.svg?height=100&width=100&text=AW",
  },
  {
    id: "CUST-002",
    name: "Siti Nurhaliza",
    email: "siti@email.com",
    phone: "08987654321",
    address: "Jl. Sudirman No. 456, Jakarta Pusat",
    joinedAt: "2024-02-20T14:30:00Z",
    totalOrders: 1,
    totalSpent: 2500000,
    avatar: "/placeholder.svg?height=100&width=100&text=SN",
  },
]

// Mock current user (in real app, this would come from auth context)
export const currentCustomer = customers[0]
