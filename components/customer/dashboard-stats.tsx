import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CreditCard, Clock, CheckCircle } from "lucide-react"
import { orders } from "@/lib/data/orders"
import { payments } from "@/lib/data/payments"

interface DashboardStatsProps {
  customerId: string
}

export function DashboardStats({ customerId }: DashboardStatsProps) {
  // Mock: Filter data for current customer
  const customerOrders = orders.filter((order) => order.customerId === customerId)
  const customerPayments = payments.filter((payment) => customerOrders.some((order) => order.id === payment.orderId))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const completedOrders = customerOrders.filter((order) => order.status === "completed").length
  const pendingPayments = customerPayments.filter((payment) => payment.status === "pending").length

  const stats = [
    {
      title: "Total Pesanan",
      value: customerOrders.length.toString(),
      icon: Package,
      description: "Pesanan yang pernah dibuat",
    },
    {
      title: "Total Pengeluaran",
      value: formatPrice(totalSpent),
      icon: CreditCard,
      description: "Total yang telah dibelanjakan",
    },
    {
      title: "Pesanan Selesai",
      value: completedOrders.toString(),
      icon: CheckCircle,
      description: "Pesanan yang telah selesai",
    },
    {
      title: "Pembayaran Pending",
      value: pendingPayments.toString(),
      icon: Clock,
      description: "Pembayaran yang menunggu",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
