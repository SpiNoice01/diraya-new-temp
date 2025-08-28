import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "@/components/order/order-status-badge"
import { orders } from "@/lib/data/orders"

interface RecentOrdersProps {
  customerId: string
  limit?: number
}

export function RecentOrders({ customerId, limit = 3 }: RecentOrdersProps) {
  // Mock: Filter and sort orders for current customer
  const customerOrders = orders
    .filter((order) => order.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)

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
        {customerOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Belum ada pesanan</p>
            <Button asChild>
              <Link href="/booking">Buat Pesanan Pertama</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {customerOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">#{order.id}</h4>
                    <OrderStatusBadge status={order.status} type="order" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{order.productName}</p>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(order.eventDate)}
                    </div>
                    <span className="font-medium text-primary">{formatPrice(order.totalAmount)}</span>
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
