"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Copy, Check, CreditCard, Building, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { Order } from "@/lib/types/database"

// Bank accounts for manual transfer
const bankAccounts = [
  {
    id: "bca",
    bankName: "Bank BCA",
    accountNumber: "1234567890",
    accountName: "PT Katering Aqiqah",
  },
  {
    id: "mandiri",
    bankName: "Bank Mandiri",
    accountNumber: "9876543210",
    accountName: "PT Katering Aqiqah",
  },
  {
    id: "bni",
    bankName: "Bank BNI",
    accountNumber: "5555666677",
    accountName: "PT Katering Aqiqah",
  }
]

interface PaymentFormProps {
  order: Order & {
    products?: {
      name: string
      description: string
      price: number
    }
    users?: {
      name: string
      email: string
    }
  }
}

export function PaymentForm({ order }: PaymentFormProps) {
  const [selectedBank, setSelectedBank] = useState(bankAccounts[0].id)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copiedAccount, setCopiedAccount] = useState("")

  const selectedBankAccount = bankAccounts.find((bank) => bank.id === selectedBank)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(type)
    setTimeout(() => setCopiedAccount(""), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar (JPG, PNG, dll)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }

      setPaymentProof(file)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!paymentProof) {
      setError("Silakan upload bukti pembayaran")
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual payment proof upload
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      setSuccess("Bukti pembayaran berhasil diunggah! Tim kami akan memverifikasi dalam 1x24 jam.")

      // Reset form
      setPaymentProof(null)
      setPaymentNotes("")

      // Redirect to order detail after 3 seconds
      setTimeout(() => {
        window.location.href = `/order/${order.id}`
      }, 3000)
    } catch (err) {
      setError("Terjadi kesalahan saat mengunggah bukti pembayaran. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Pembayaran Pesanan #{order.id}
          </CardTitle>
          <CardDescription>Silakan lakukan pembayaran sesuai dengan instruksi di bawah ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{order.productName}</h3>
              <p className="text-sm text-muted-foreground">Jumlah: {order.quantity} paket</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatPrice(order.totalAmount)}</p>
              <Badge variant="outline">{paymentStatuses.find((s) => s.id === order.paymentStatus)?.name}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Pilih Rekening Tujuan
          </CardTitle>
          <CardDescription>Transfer ke salah satu rekening di bawah ini dengan nominal yang tepat</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedBank} onValueChange={setSelectedBank} className="space-y-4">
            {bankAccounts.map((bank) => (
              <div key={bank.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value={bank.id} id={bank.id} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={bank.logo || "/placeholder.svg"}
                        alt={bank.bankName}
                        width={60}
                        height={30}
                        className="object-contain"
                      />
                      <div>
                        <p className="font-semibold">{bank.bankName}</p>
                        <p className="text-sm text-muted-foreground">{bank.accountName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-lg">{bank.accountNumber}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bank.accountNumber, bank.id)}>
                          {copiedAccount === bank.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {selectedBankAccount && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Penting:</strong> Transfer tepat sebesar <strong>{formatPrice(order.totalAmount)}</strong> ke
                rekening {selectedBankAccount.bankName} atas nama <strong>{selectedBankAccount.accountName}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Upload Payment Proof */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Bukti Pembayaran
          </CardTitle>
          <CardDescription>Upload foto atau screenshot bukti transfer Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentProof">Bukti Pembayaran *</Label>
              <Input id="paymentProof" type="file" accept="image/*" onChange={handleFileChange} required />
              <p className="text-xs text-muted-foreground">Format: JPG, PNG, GIF. Maksimal 5MB</p>
              {paymentProof && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>File terpilih: {paymentProof.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Catatan (Opsional)</Label>
              <Textarea
                id="paymentNotes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Tambahkan catatan jika diperlukan..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Informasi Penting:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pastikan nominal transfer sesuai dengan total pembayaran</li>
                <li>• Upload bukti transfer yang jelas dan dapat dibaca</li>
                <li>• Verifikasi pembayaran akan dilakukan dalam 1x24 jam</li>
                <li>• Hubungi customer service jika ada kendala</li>
              </ul>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Bukti Pembayaran
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
