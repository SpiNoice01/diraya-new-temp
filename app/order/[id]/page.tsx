import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, MapPin, Package, Phone, Mail, User } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "@/components/order/order-status-badge"
import { orders } from "@/lib/data/orders"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = orders.find((o) => o.id === params.id)

  if (!order) {
    notFound()
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Katering Aqiqah</h1>
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Masuk
              </Link>
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/customer/orders" className="hover:text-foreground transition-colors">
            Pesanan
          </Link>
          <span>/</span>
          <span className="text-foreground">#{order.id}</span>
        </div>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/customer/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Pesanan
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">Pesanan #{order.id}</CardTitle>
                      <p className="text-muted-foreground">Dibuat pada {formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <OrderStatusBadge status={order.status} type="order" />
                      <OrderStatusBadge status={order.paymentStatus} type="payment" />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Detail Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{order.productName}</h3>
                      <p className="text-muted-foreground">Jumlah: {order.quantity} paket</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Detail Acara
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Tanggal Acara</p>
                        <p className="text-muted-foreground">{formatDate(order.eventDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Waktu Acara</p>
                        <p className="text-muted-foreground">{order.eventTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Alamat Pengiriman</p>
                      <p className="text-muted-foreground">{order.customerAddress}</p>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-medium mb-2">Catatan Tambahan:</p>
                      <p className="text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informasi Pemesan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.customerEmail}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {order.paymentStatus === "pending" && (
                    <Button className="w-full" asChild>
                      <Link href={`/payment?order=${order.id}`}>Bayar Sekarang</Link>
                    </Button>
                  )}
                  {order.status === "pending" && (
                    <Button variant="destructive" className="w-full">
                      Batalkan Pesanan
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent">
                    Hubungi Customer Service
                  </Button>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Pesanan Dibuat</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                      </div>
                    </div>
                    {order.status !== "pending" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Pesanan Dikonfirmasi</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(order.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
