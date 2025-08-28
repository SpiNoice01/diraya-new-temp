"use client"

import { useState } from "react"
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
import { Eye, Check, X } from "lucide-react"
import Image from "next/image"
import { payments, paymentStatuses } from "@/lib/data/payments"

export function PaymentVerificationTable() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

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

  const handleVerifyPayment = async (paymentId: string, status: "verified" | "failed") => {
    // TODO: Implement actual payment verification logic
    console.log(`Verifying payment ${paymentId} with status ${status}`)
  }

  const getStatusInfo = (status: string) => {
    return paymentStatuses.find((s) => s.id === status)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pembayaran</TableHead>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Upload</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status)
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">#{payment.id}</TableCell>
                    <TableCell>#{payment.orderId}</TableCell>
                    <TableCell className="font-medium">{formatPrice(payment.amount)}</TableCell>
                    <TableCell>
                      {payment.bankAccount ? (
                        <div>
                          <p className="font-medium">{payment.bankAccount.bankName}</p>
                          <p className="text-sm text-muted-foreground">{payment.bankAccount.accountNumber}</p>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{statusInfo && <Badge className={statusInfo.color}>{statusInfo.name}</Badge>}</TableCell>
                    <TableCell>{payment.uploadedAt ? formatDateTime(payment.uploadedAt) : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {payment.proofImage && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Bukti Pembayaran #{payment.id}</DialogTitle>
                                <DialogDescription>Verifikasi bukti pembayaran dari customer</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="text-center">
                                  <Image
                                    src={payment.proofImage || "/placeholder.svg"}
                                    alt="Bukti Pembayaran"
                                    width={400}
                                    height={600}
                                    className="mx-auto border rounded-lg object-contain max-h-96"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Jumlah Transfer</p>
                                    <p>{formatPrice(payment.amount)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Bank Tujuan</p>
                                    <p>{payment.bankAccount?.bankName}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Rekening Tujuan</p>
                                    <p>{payment.bankAccount?.accountNumber}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Tanggal Upload</p>
                                    <p>{payment.uploadedAt ? formatDateTime(payment.uploadedAt) : "-"}</p>
                                  </div>
                                </div>
                                {payment.status === "uploaded" && (
                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      className="flex-1"
                                      onClick={() => handleVerifyPayment(payment.id, "verified")}
                                    >
                                      <Check className="w-4 h-4 mr-2" />
                                      Verifikasi
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="flex-1"
                                      onClick={() => handleVerifyPayment(payment.id, "failed")}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Tolak
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {payment.status === "uploaded" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerifyPayment(payment.id, "verified")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleVerifyPayment(payment.id, "failed")}>
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
      </CardContent>
    </Card>
  )
}
