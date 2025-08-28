import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building, FileImage, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { paymentStatuses } from "@/lib/data/payments"
import type { Payment } from "@/lib/data/payments"

interface PaymentStatusCardProps {
  payment: Payment
}

export function PaymentStatusCard({ payment }: PaymentStatusCardProps) {
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusInfo = paymentStatuses.find((s) => s.id === payment.status)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Pembayaran #{payment.id}
          </CardTitle>
          {statusInfo && <Badge className={statusInfo.color}>{statusInfo.name}</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Payment Amount */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Pembayaran</span>
          <span className="text-xl font-bold text-primary">{formatPrice(payment.amount)}</span>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Metode Pembayaran</span>
          </div>
          {payment.bankAccount && (
            <div className="ml-6 text-sm">
              <p>{payment.bankAccount.bankName}</p>
              <p className="text-muted-foreground">
                {payment.bankAccount.accountNumber} - {payment.bankAccount.accountName}
              </p>
            </div>
          )}
        </div>

        {/* Payment Proof */}
        {payment.proofImage && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileImage className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Bukti Pembayaran</span>
            </div>
            <div className="ml-6">
              <Image
                src={payment.proofImage || "/placeholder.svg"}
                alt="Bukti Pembayaran"
                width={200}
                height={300}
                className="border rounded-lg object-cover"
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Timeline</span>
          </div>
          <div className="ml-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pembayaran dibuat</span>
              <span className="text-muted-foreground">{formatDateTime(payment.createdAt)}</span>
            </div>
            {payment.uploadedAt && (
              <div className="flex justify-between">
                <span>Bukti diunggah</span>
                <span className="text-muted-foreground">{formatDateTime(payment.uploadedAt)}</span>
              </div>
            )}
            {payment.verifiedAt && (
              <div className="flex justify-between">
                <span>Pembayaran diverifikasi</span>
                <span className="text-muted-foreground">{formatDateTime(payment.verifiedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Description */}
        {statusInfo && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">{statusInfo.description}</p>
          </div>
        )}

        {/* Notes */}
        {payment.notes && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Catatan:</p>
            <p className="text-sm text-muted-foreground">{payment.notes}</p>
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/order/${payment.orderId}`}>Lihat Pesanan</Link>
          </Button>
          {payment.status === "pending" && (
            <Button size="sm" asChild>
              <Link href={`/payment?order=${payment.orderId}`}>Upload Bukti</Link>
            </Button>
          )}
          {payment.status === "failed" && (
            <Button size="sm" asChild>
              <Link href={`/payment?order=${payment.orderId}`}>Upload Ulang</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
