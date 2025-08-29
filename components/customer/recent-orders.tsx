import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Package, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "@/components/order/order-status-badge"
import { useEffect, useState } from "react"
import { orderService } from "@/lib/services/database"
import type { Order } from "@/lib/types/database"

interface RecentOrdersProps {
  customerId: string
  limit?: number
}

export function RecentOrders({ customerId, limit = 3 }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const customerOrders = await orderService.getOrdersByUserId(customerId)
        // Sort by created_at and take the most recent ones
        const sortedOrders = customerOrders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit)
        setOrders(sortedOrders)
      } catch (error) {
        console.error('Error fetching recent orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (customerId) {
      fetchOrders()
    }
  }, [customerId, limit])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Pesanan Terbaru
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customer/orders">
            Lihat Semua
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Belum ada pesanan</p>
            <Button asChild>
              <Link href="/booking">Buat Pesanan Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">#{order.id}</h4>
                    <OrderStatusBadge status={order.status} type="order" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.products?.name || `Produk #${order.product_id}`}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(order.event_date)}
                    </div>
                    <span className="font-medium text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/order/${order.id}`}>Detail</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
