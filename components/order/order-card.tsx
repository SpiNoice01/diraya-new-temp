import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Package, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "./order-status-badge"
import type { Order } from "@/lib/data/orders"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
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
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pesanan #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">Dibuat pada {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <OrderStatusBadge status={order.status} type="order" />
            <OrderStatusBadge status={order.paymentStatus} type="payment" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Info */}
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-primary mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold">{order.productName}</h4>
            <p className="text-sm text-muted-foreground">Jumlah: {order.quantity} paket</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        <Separator />

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{order.customerEmail}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(order.eventDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTime(order.eventTime)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
          <span className="text-sm">{order.customerAddress}</span>
        </div>

        {order.notes && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Catatan:</p>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/order/${order.id}`}>Detail Pesanan</Link>
          </Button>
          {order.paymentStatus === "pending" && (
            <Button size="sm" asChild>
              <Link href={`/payment?order=${order.id}`}>Bayar Sekarang</Link>
            </Button>
          )}
          {order.status === "pending" && (
            <Button variant="destructive" size="sm">
              Batalkan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
