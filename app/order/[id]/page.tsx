"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, MapPin, Package, Phone, Mail, FileText, CreditCard, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import { orderService, productService, userService } from "@/lib/services/database"
import { useRouter } from "next/navigation"
import type { Order, Product, User } from "@/lib/types/database"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [customer, setCustomer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const orderId = unwrappedParams.id

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        setError("")
        
        console.log('Fetching order details for ID:', orderId)
        
        // Fetch order
        const orderData = await orderService.getOrderById(orderId)
        setOrder(orderData)
        
        // Fetch product details
        if (orderData.product_id) {
          const productData = await productService.getProductById(orderData.product_id)
          setProduct(productData)
        }
        
        // Fetch customer details
        if (orderData.user_id) {
          const customerData = await userService.getUserById(orderData.user_id)
          setCustomer(customerData)
        }
        
        console.log('Order details fetched successfully')
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError("Gagal memuat detail pesanan. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Memuat detail pesanan...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
              <Button variant="outline" asChild>
                <Link href="/customer/orders">
                  Kembali ke Pesanan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Pesanan Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-6">Pesanan dengan ID tersebut tidak ditemukan atau telah dihapus.</p>
            <Button asChild>
              <Link href="/customer/orders">
                Kembali ke Pesanan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/customer/orders" className="hover:text-foreground transition-colors">
            Pesanan Saya
          </Link>
          <span>/</span>
          <span className="text-foreground">Detail Pesanan #{order.id}</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/customer/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Pesanan
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Detail Pesanan #{order.id}</h2>
              <p className="text-muted-foreground">Dibuat pada {formatDate(order.created_at)}</p>
            </div>
            <div className="flex gap-2">
              {order.payment_status === "pending" && (
                <Button asChild>
                  <Link href={`/payment?order=${order.id}`}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Bayar Sekarang
                  </Link>
                </Button>
              )}
              {order.status === "pending" && (
                <Button variant="destructive">
                  Batalkan Pesanan
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Status Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>
                      {order.status === "pending" && "Menunggu"}
                      {order.status === "confirmed" && "Dikonfirmasi"}
                      {order.status === "preparing" && "Disiapkan"}
                      {order.status === "delivered" && "Dikirim"}
                      {order.status === "completed" && "Selesai"}
                      {order.status === "cancelled" && "Dibatalkan"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Status Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getPaymentStatusIcon(order.payment_status)}
                    <Badge variant={order.payment_status === "paid" ? "default" : order.payment_status === "failed" ? "destructive" : "secondary"}>
                      {order.payment_status === "pending" && "Menunggu Pembayaran"}
                      {order.payment_status === "paid" && "Lunas"}
                      {order.payment_status === "failed" && "Gagal"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informasi Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  {product?.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product?.name || `Produk #${order.product_id}`}</h3>
                    <p className="text-muted-foreground mb-2">{product?.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Jumlah: {order.quantity} paket</p>
                        <p className="text-sm text-muted-foreground">Harga per paket: {formatPrice(product?.price || 0)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatPrice(order.total_amount)}</p>
                        <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informasi Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Telepon:</span>
                      <span>{customer?.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{customer?.email || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Tanggal Acara:</span>
                      <span>{formatDate(order.event_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Waktu Acara:</span>
                      <span>{formatTime(order.event_time)}</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Alamat Pengiriman:</span>
                    <p className="text-muted-foreground">{customer?.address || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Catatan Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Pesanan Dibuat</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  {order.status !== "pending" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Pesanan Dikonfirmasi</p>
                        <p className="text-sm text-muted-foreground">Akan diperbarui</p>
                      </div>
                    </div>
                  )}
                  {order.status === "completed" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Pesanan Selesai</p>
                        <p className="text-sm text-muted-foreground">Akan diperbarui</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}


