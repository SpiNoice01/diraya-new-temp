import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { Package, CreditCard, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { adminService } from "@/lib/services/database"

export function AdminStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error('Error fetching admin stats:', err)
        setError("Gagal memuat statistik")
        // Fallback to default stats
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">{error || "Gagal memuat statistik"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statsArray = [
    {
      title: "Total Pesanan",
      value: stats.totalOrders?.toString() || "0",
      icon: Package,
      description: "Total pesanan",
      trend: "up" as const,
    },
    {
      title: "Total Pendapatan",
      value: formatPrice(stats.totalRevenue || 0),
      icon: CreditCard,
      description: "Total pendapatan",
      trend: "up" as const,
    },
    {
      title: "Total Customer",
      value: stats.totalCustomers?.toString() || "0",
      icon: Users,
      description: "Customer terdaftar",
      trend: "up" as const,
    },
    {
      title: "Pesanan Pending",
      value: stats.pendingOrders?.toString() || "0",
      icon: Clock,
      description: "Menunggu konfirmasi",
      trend: "neutral" as const,
    },
    {
      title: "Pesanan Selesai",
      value: stats.completedOrders?.toString() || "0",
      icon: CheckCircle,
      description: "Total selesai",
      trend: "up" as const,
    },
    {
      title: "Pesanan Dibatalkan",
      value: stats.cancelledOrders?.toString() || "0",
      icon: AlertCircle,
      description: "Total dibatalkan",
      trend: "neutral" as const,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsArray.map((stat, index) => (
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
