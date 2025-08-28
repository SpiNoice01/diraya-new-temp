"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Package, Loader2 } from "lucide-react"
import { products } from "@/lib/data/products"
import type { Product } from "@/lib/data/products"

interface BookingFormProps {
  productId?: string
}

export function BookingForm({ productId }: BookingFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
    eventDate: "",
    eventTime: "",
    notes: "",
  })

  useEffect(() => {
    if (productId) {
      const product = products.find((p) => p.id === productId)
      if (product) {
        setSelectedProduct(product)
      }
    }
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * formData.quantity
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 1 : value,
    }))
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!selectedProduct) {
      setError("Silakan pilih paket katering terlebih dahulu")
      setIsLoading(false)
      return
    }

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.customerAddress ||
      !formData.eventDate ||
      !formData.eventTime
    ) {
      setError("Semua field wajib diisi")
      setIsLoading(false)
      return
    }

    // Check if event date is in the future
    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}`)
    const now = new Date()
    if (eventDateTime <= now) {
      setError("Tanggal dan waktu acara harus di masa depan")
      setIsLoading(false)
      return
    }

    try {
      // TODO: Implement actual order creation logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      const orderId = `ORD-${Date.now()}`
      setSuccess(`Pesanan berhasil dibuat dengan ID: ${orderId}. Silakan lakukan pembayaran untuk konfirmasi pesanan.`)

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        quantity: 1,
        eventDate: "",
        eventTime: "",
        notes: "",
      })
      setSelectedProduct(null)

      // Redirect to payment page after 3 seconds
      setTimeout(() => {
        window.location.href = `/payment?order=${orderId}`
      }, 3000)
    } catch (err) {
      setError("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Product Selection */}
      {!selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Pilih Paket Katering
            </CardTitle>
            <CardDescription>Pilih paket katering yang sesuai dengan kebutuhan acara aqiqah Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProductSelect(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{product.name}</h4>
                      {product.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          Populer
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.servings} porsi</p>
                    <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Product Summary */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Paket Terpilih
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)}>
                Ganti Paket
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedProduct.servings} porsi</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-primary">{formatPrice(selectedProduct.price)}</p>
                <p className="text-sm text-muted-foreground">per paket</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Form */}
      {selectedProduct && (
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Pemesan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nama Lengkap *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Nomor Telepon *</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="08123456789"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="nama@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Alamat Lengkap *</Label>
                <Textarea
                  id="customerAddress"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap untuk pengiriman"
                  rows={3}
                  required
                />
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
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah Paket *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Tanggal Acara *</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Waktu Acara *</Label>
                  <Input
                    id="eventTime"
                    name="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Permintaan khusus atau catatan untuk acara (opsional)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>
                  {selectedProduct.name} x {formData.quantity}
                </span>
                <span>{formatPrice(selectedProduct.price * formData.quantity)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(calculateTotal())}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                * Harga sudah termasuk pajak dan biaya pengiriman dalam kota
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat Pesanan
          </Button>
        </form>
      )}
    </div>
  )
}
