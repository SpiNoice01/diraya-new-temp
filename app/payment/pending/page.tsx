"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Receipt, RefreshCw, Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'

export default function PaymentPendingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get('order')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState(false)

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

  const checkPaymentStatus = async () => {
    if (!orderId) return

    setCheckingStatus(true)
    try {
      const response = await fetch(`/api/payment/status?order_id=${orderId}`)
      const status = await response.json()

      if (status.transaction_status === 'settlement' || status.transaction_status === 'capture') {
        router.push(`/payment/success?order=${orderId}`)
      } else if (status.transaction_status === 'deny' || status.transaction_status === 'cancel' || status.transaction_status === 'expire') {
        router.push(`/payment/error?order=${orderId}`)
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    } finally {
      setCheckingStatus(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
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
          {/* Pending Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pembayaran Menunggu
            </h1>
            <p className="text-muted-foreground text-lg">
              Pembayaran Anda sedang diproses, mohon tunggu sebentar
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
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-amber-600 font-medium">Menunggu</span>
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

          {/* Status Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">
                  Pembayaran Sedang Diproses
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Pembayaran bank transfer biasanya diproses dalam 5-15 menit</li>
                  <li>• E-wallet diproses secara otomatis</li>
                  <li>• Jika menggunakan virtual account, pastikan nominal transfer tepat</li>
                  <li>• Status akan otomatis terupdate setelah pembayaran berhasil</li>
                </ul>
              </div>

              <div className="flex items-center justify-center">
                <Button 
                  onClick={checkPaymentStatus}
                  disabled={checkingStatus}
                  variant="outline"
                >
                  {checkingStatus && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  Cek Status Pembayaran
                </Button>
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
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>

          {/* Auto Refresh Notice */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Halaman ini akan otomatis refresh setiap 30 detik untuk update status pembayaran
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Auto refresh every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (window.location.pathname === '/payment/pending') {
      window.location.reload()
    }
  }, 30000)
}

