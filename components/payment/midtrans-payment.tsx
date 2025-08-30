"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react'
import Script from 'next/script'

interface MidtransPaymentProps {
  orderId: string
  amount: number
  customerName: string
  productName: string
  onSuccess?: (result: any) => void
  onPending?: (result: any) => void
  onError?: (result: any) => void
  onClose?: () => void
}

// Declare global Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void
        onPending: (result: any) => void
        onError: (result: any) => void
        onClose: () => void
      }) => void
    }
  }
}

export function MidtransPayment({
  orderId,
  amount,
  customerName,
  productName,
  onSuccess,
  onPending,
  onError,
  onClose
}: MidtransPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [snapLoaded, setSnapLoaded] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handlePayment = async () => {
    if (!snapLoaded) {
      setError('Payment system is not ready. Please try again.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('🔄 Creating payment token for order:', orderId)

      // Create payment token
      const response = await fetch('/api/payment/create-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment')
      }

      const { token } = await response.json()

      console.log('✅ Payment token created:', token)

      // Open Snap payment popup
      window.snap.pay(token, {
        onSuccess: (result) => {
          console.log('✅ Payment success:', result)
          onSuccess?.(result)
        },
        onPending: (result) => {
          console.log('⏳ Payment pending:', result)
          onPending?.(result)
        },
        onError: (result) => {
          console.error('❌ Payment error:', result)
          onError?.(result)
        },
        onClose: () => {
          console.log('🚪 Payment popup closed')
          onClose?.()
        }
      })

    } catch (err: any) {
      console.error('❌ Error creating payment:', err)
      setError(err.message || 'Failed to process payment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Load Midtrans Snap Script */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT === 'production' 
          ? 'https://app.midtrans.com/snap/snap.js' 
          : 'https://app.sandbox.midtrans.com/snap/snap.js'
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => {
          console.log('✅ Midtrans Snap script loaded')
          setSnapLoaded(true)
        }}
        onError={() => {
          console.error('❌ Failed to load Midtrans Snap script')
          setError('Failed to load payment system')
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pembayaran Pesanan
          </CardTitle>
          <CardDescription>
            Gunakan berbagai metode pembayaran yang aman dan terpercaya
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID Pesanan:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produk:</span>
              <span>{productName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pemesan:</span>
              <span>{customerName}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Pembayaran:</span>
              <span className="text-primary text-lg">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Payment Methods Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Kartu Kredit/Debit</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, JCB</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Building className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-sm">Transfer Bank</p>
                <p className="text-xs text-muted-foreground">BCA, BNI, BRI, Mandiri</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Smartphone className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-sm">E-Wallet</p>
                <p className="text-xs text-muted-foreground">GoPay, OVO, DANA</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Button */}
          <Button 
            size="lg" 
            className="w-full"
            onClick={handlePayment}
            disabled={isLoading || !snapLoaded}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!snapLoaded ? 'Memuat sistem pembayaran...' : 'Bayar Sekarang'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Dengan melanjutkan pembayaran, Anda menyetujui syarat dan ketentuan yang berlaku.
            Pembayaran diproses dengan aman oleh Midtrans.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

