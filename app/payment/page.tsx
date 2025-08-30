import { redirect } from "next/navigation"
import { PaymentForm } from "@/components/payment/payment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { orders } from "@/lib/data/orders"
import { Header } from "@/components/layout/header"

interface PaymentPageProps {
  searchParams: Promise<{
    order?: string
  }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams
  const orderId = params.order

  if (!orderId) {
    redirect("/customer/orders")
  }

  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    redirect("/customer/orders")
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
          <Link href={`/order/${order.id}`} className="hover:text-foreground transition-colors">
            Pesanan #{order.id}
          </Link>
          <span>/</span>
          <span className="text-foreground">Pembayaran</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/order/${order.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Detail Pesanan
            </Link>
          </Button>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pembayaran</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Lakukan pembayaran untuk mengkonfirmasi pesanan Anda. Setelah pembayaran diverifikasi, pesanan akan segera
            diproses.
          </p>
        </div>
      </section>

      {/* Payment Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <PaymentForm order={order} />
        </div>
      </section>
    </div>
  )
}
