"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Receipt, RotateCcw, Home, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'

export default function PaymentErrorPage() {
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

  const handleRetryPayment = () => {
    if (orderId) {
      router.push(`/customer/orders`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat informasi pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran Gagal
            </h1>
            <p className="text-muted-foreground text-lg">
              Maaf, terjadi kesalahan dalam proses pembayaran Anda
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
                    <p className="text-muted-foreground">Status Pembayaran</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">Gagal</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Produk</p>
                    <p className="font-medium">{order.products.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Pembayaran</p>
                    <p className="font-bold text-lg text-primary">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Kemungkinan Penyebab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  Beberapa hal yang mungkin menyebabkan pembayaran gagal:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Saldo kartu kredit/debit tidak mencukupi</li>
                  <li>• Koneksi internet terputus saat proses pembayaran</li>
                  <li>• Session pembayaran expired (lebih dari 15 menit)</li>
                  <li>• Pembayaran ditolak oleh bank penerbit</li>
                  <li>• Informasi kartu tidak valid atau salah</li>
                  <li>• Limit transaksi harian sudah tercapai</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Apa yang bisa Anda lakukan:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Coba metode pembayaran yang berbeda</li>
                  <li>• Pastikan saldo rekening mencukupi</li>
                  <li>• Hubungi bank penerbit kartu Anda</li>
                  <li>• Coba lagi dalam beberapa menit</li>
                  <li>• Hubungi customer service kami jika masalah berlanjut</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Butuh Bantuan?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>info@kateringaqiqah.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WhatsApp:</span>
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telepon:</span>
                  <span>(021) 1234-5678</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetryPayment} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Coba Bayar Lagi
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/customer/orders">
                <Receipt className="w-4 h-4 mr-2" />
                Lihat Pesanan Saya
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

