import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
  type: "order" | "payment"
}

export function OrderStatusBadge({ status, type }: OrderStatusBadgeProps) {
  // Order status mapping
  const orderStatusMap = {
    pending: { name: "Menunggu", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    confirmed: { name: "Dikonfirmasi", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    preparing: { name: "Disiapkan", color: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
    delivered: { name: "Dikirim", color: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
    completed: { name: "Selesai", color: "bg-green-100 text-green-800 hover:bg-green-100" },
    cancelled: { name: "Dibatalkan", color: "bg-red-100 text-red-800 hover:bg-red-100" },
  }

  // Payment status mapping
  const paymentStatusMap = {
    pending: { name: "Menunggu Bayar", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    paid: { name: "Lunas", color: "bg-green-100 text-green-800 hover:bg-green-100" },
    failed: { name: "Gagal", color: "bg-red-100 text-red-800 hover:bg-red-100" },
  }

  const statusMap = type === "order" ? orderStatusMap : paymentStatusMap
  const statusInfo = statusMap[status as keyof typeof statusMap]

  if (!statusInfo) {
    return <Badge variant="secondary">{status}</Badge>
  }

  return <Badge className={statusInfo.color}>{statusInfo.name}</Badge>
}
