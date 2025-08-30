"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Check, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { paymentService } from "@/lib/services/database"
import type { Payment } from "@/lib/types/database"

// Payment status options
const paymentStatuses = [
  { id: "pending", name: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
  { id: "completed", name: "Selesai", color: "bg-green-100 text-green-800" },
  { id: "failed", name: "Gagal", color: "bg-red-100 text-red-800" },
]

export function PaymentVerificationTable() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch payments from database
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError("")
        // Get all payments that need verification
        const data = await paymentService.getAllPayments()
        setPayments(data || [])
      } catch (err) {
        console.error('Error fetching payments:', err)
        setError("Gagal memuat data pembayaran")
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleVerifyPayment = async (paymentId: string, status: "completed" | "failed") => {
    try {
      await paymentService.updatePaymentStatus(paymentId, status)
      // Refresh payments after update
      const data = await paymentService.getAllPayments()
      setPayments(data || [])
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const getStatusInfo = (status: string) => {
    return paymentStatuses.find((s) => s.id === status)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Memuat data pembayaran...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi Pembayaran ({payments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada pembayaran yang perlu diverifikasi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pembayaran</TableHead>
                  <TableHead>ID Pesanan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">#{payment.id.slice(0, 8)}</TableCell>
                      <TableCell>#{payment.order_id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{formatPrice(payment.amount)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.payment_method}</p>
                          {payment.transaction_id && (
                            <p className="text-sm text-muted-foreground">TXN: {payment.transaction_id}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{statusInfo && <Badge className={statusInfo.color}>{statusInfo.name}</Badge>}</TableCell>
                      <TableCell>{payment.payment_date ? formatDateTime(payment.payment_date) : formatDateTime(payment.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/order/${payment.order_id}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                          {payment.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerifyPayment(payment.id, "completed")}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleVerifyPayment(payment.id, "failed")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
