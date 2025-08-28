import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Package, CreditCard, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { adminStats } from "@/lib/data/admin"

export function AdminStats() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const stats = [
    {
      title: "Total Pesanan",
      value: adminStats.totalOrders.toString(),
      icon: Package,
      description: `+${adminStats.monthlyOrders} bulan ini`,
      trend: "up" as const,
    },
    {
      title: "Total Pendapatan",
      value: formatPrice(adminStats.totalRevenue),
      icon: CreditCard,
      description: `${formatPrice(adminStats.monthlyRevenue)} bulan ini`,
      trend: "up" as const,
    },
    {
      title: "Total Customer",
      value: adminStats.totalCustomers.toString(),
      icon: Users,
      description: "Customer terdaftar",
      trend: "up" as const,
    },
    {
      title: "Pesanan Pending",
      value: adminStats.pendingOrders.toString(),
      icon: Clock,
      description: "Menunggu konfirmasi",
      trend: "neutral" as const,
    },
    {
      title: "Pembayaran Pending",
      value: adminStats.pendingPayments.toString(),
      icon: AlertCircle,
      description: "Menunggu verifikasi",
      trend: "neutral" as const,
    },
    {
      title: "Pesanan Selesai",
      value: adminStats.completedOrders.toString(),
      icon: CheckCircle,
      description: "Total selesai",
      trend: "up" as const,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.trend === "up" && <TrendingUp className="w-3 h-3 mr-1 text-green-600" />}
              {stat.trend === "down" && <TrendingDown className="w-3 h-3 mr-1 text-red-600" />}
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
