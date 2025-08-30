"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Receipt, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get('order')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            products!inner(name, description),
            users!inner(name, email)
          `)
          .eq('id', orderId)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

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
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memverifikasi pembayaran...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran Berhasil!
            </h1>
            <p className="text-muted-foreground text-lg">
              Terima kasih, pembayaran Anda telah berhasil diproses
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Detail Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID Pesanan</p>
                    <p className="font-mono font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal Pembayaran</p>
                    <p className="font-medium">{formatDate(new Date().toISOString())}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Produk</p>
                    <p className="font-medium">{order.products.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jumlah</p>
                    <p className="font-medium">{order.quantity} paket</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal Acara</p>
                    <p className="font-medium">{formatDate(order.event_date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Pembayaran</p>
                    <p className="font-bold text-lg text-primary">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Langkah Selanjutnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Konfirmasi Pesanan</p>
                  <p className="text-sm text-muted-foreground">
                    Tim kami akan mengkonfirmasi pesanan Anda dalam 1x24 jam
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Persiapan Katering</p>
                  <p className="text-sm text-muted-foreground">
                    Katering akan disiapkan sesuai jadwal acara Anda
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Pengiriman</p>
                  <p className="text-sm text-muted-foreground">
                    Katering akan dikirim tepat waktu sesuai jadwal acara
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/customer/orders">
                <Receipt className="w-4 h-4 mr-2" />
                Lihat Pesanan Saya
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/katalog">
                <ArrowRight className="w-4 h-4 mr-2" />
                Pesan Lagi
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

