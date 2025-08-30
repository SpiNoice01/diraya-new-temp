import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Package, Phone, Mail, CreditCard } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "./order-status-badge"
import type { Order } from "@/lib/types/database"
import { userService } from "@/lib/services/database"
import { useEffect, useState } from "react"
import { MidtransPayment } from "@/components/payment/midtrans-payment"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface OrderCardProps {
  order: Order & {
    products?: {
      name: string
      description: string
      price: number
      image_url: string
    }
    users?: {
      id: string
      name: string
      email: string
      phone: string
      address: string
      role: string
      avatar_url?: string
      created_at: string
      updated_at: string
    }
  }
}

export function OrderCard({ order }: OrderCardProps) {
  const [userData, setUserData] = useState(order.users || null)
  const [loadingUser, setLoadingUser] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const router = useRouter()

  // Fetch user data if not available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!order.users && order.user_id) {
        try {
          setLoadingUser(true)
          const user = await userService.getUserById(order.user_id)
          setUserData(user)
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          setLoadingUser(false)
        }
      }
    }

    fetchUserData()
  }, [order.users, order.user_id])

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

  // Get product name from joined data or fallback
  const productName = order.products?.name || `Produk #${order.product_id}`
  const productPrice = order.products?.price || 0
  
  // Get user info from joined data or fallback
  const customerName = userData?.name || "Customer"
  const customerEmail = userData?.email || "N/A"
  const customerPhone = userData?.phone || "N/A"
  const customerAddress = userData?.address || "N/A"

  // Payment handlers
  const handlePaymentSuccess = (result: any) => {
    console.log('✅ Payment successful:', result)
    setShowPaymentDialog(false)
    // Refresh the page to show updated status
    window.location.reload()
  }

  const handlePaymentPending = (result: any) => {
    console.log('⏳ Payment pending:', result)
    setShowPaymentDialog(false)
    router.push(`/payment/pending?order=${order.id}`)
  }

  const handlePaymentError = (result: any) => {
    console.error('❌ Payment error:', result)
    setShowPaymentDialog(false)
    router.push(`/payment/error?order=${order.id}`)
  }

  const handlePaymentClose = () => {
    console.log('🚪 Payment dialog closed')
    setShowPaymentDialog(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pesanan #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">Dibuat pada {formatDate(order.created_at)}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <OrderStatusBadge status={order.status} type="order" />
            <OrderStatusBadge status={order.payment_status} type="payment" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Info */}
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-primary mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold">{productName}</h4>
            <p className="text-sm text-muted-foreground">Jumlah: {order.quantity} paket</p>
            {order.products?.description && (
              <p className="text-sm text-muted-foreground mt-1">{order.products.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{formatPrice(order.total_amount)}</p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(productPrice)} per paket
            </p>
          </div>
        </div>

        <Separator />

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className={customerPhone === "N/A" ? "text-muted-foreground" : ""}>
                {loadingUser ? "Loading..." : customerPhone}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className={customerEmail === "N/A" ? "text-muted-foreground" : ""}>
                {loadingUser ? "Loading..." : customerEmail}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(order.event_date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTime(order.event_time)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
          <span className={`text-sm ${customerAddress === "N/A" ? "text-muted-foreground" : ""}`}>
            {loadingUser ? "Loading..." : customerAddress}
          </span>
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
          {order.payment_status === "pending" && (
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bayar Sekarang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Pembayaran Pesanan #{order.id}</DialogTitle>
                </DialogHeader>
                <MidtransPayment
                  orderId={order.id}
                  amount={order.total_amount}
                  customerName={customerName}
                  productName={productName}
                  onSuccess={handlePaymentSuccess}
                  onPending={handlePaymentPending}
                  onError={handlePaymentError}
                  onClose={handlePaymentClose}
                />
              </DialogContent>
            </Dialog>
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
