import { Badge } from "@/components/ui/badge"
import { orderStatuses, paymentStatuses } from "@/lib/data/orders"

interface OrderStatusBadgeProps {
  status: string
  type: "order" | "payment"
}

export function OrderStatusBadge({ status, type }: OrderStatusBadgeProps) {
  const statuses = type === "order" ? orderStatuses : paymentStatuses
  const statusInfo = statuses.find((s) => s.id === status)

  if (!statusInfo) return null

  return <Badge className={statusInfo.color}>{statusInfo.name}</Badge>
}
