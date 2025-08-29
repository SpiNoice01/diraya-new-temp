import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CreditCard, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { orderService, paymentService } from "@/lib/services/database"
import type { Order, Payment } from "@/lib/types/database"

interface DashboardStatsProps {
  customerId: string
}

export function DashboardStats({ customerId }: DashboardStatsProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch customer orders
        const customerOrders = await orderService.getOrdersByUserId(customerId)
        setOrders(customerOrders)
        
        // Fetch payments for all customer orders
        const orderIds = customerOrders.map(order => order.id)
        const allPayments: Payment[] = []
        
        for (const orderId of orderIds) {
          const orderPayments = await paymentService.getPaymentsByOrderId(orderId)
          allPayments.push(...orderPayments)
        }
        
        setPayments(allPayments)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      fetchData()
    }
  }, [customerId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const pendingPayments = payments.filter((payment) => payment.status === "pending").length

  const stats = [
    {
      title: "Total Pesanan",
      value: loading ? "..." : orders.length.toString(),
      icon: Package,
      description: "Pesanan yang pernah dibuat",
    },
    {
      title: "Total Pengeluaran",
      value: loading ? "..." : formatPrice(totalSpent),
      icon: CreditCard,
      description: "Total yang telah dibelanjakan",
    },
    {
      title: "Pesanan Selesai",
      value: loading ? "..." : completedOrders.toString(),
      icon: CheckCircle,
      description: "Pesanan yang telah selesai",
    },
    {
      title: "Pembayaran Pending",
      value: loading ? "..." : pendingPayments.toString(),
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
