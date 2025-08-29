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
import { Calendar, User, Package, Loader2, LogIn } from "lucide-react"
import type { Product } from "@/lib/types/database"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import { orderService, productService } from "@/lib/services/database"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BookingFormProps {
  productId?: string
}

export function BookingForm({ productId }: BookingFormProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    quantity: 1,
    eventDate: "",
    eventTime: "",
    notes: "",
  })

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const data = await productService.getAllProducts()
        setProducts(data)
        
        // If productId is provided, find and select that product
        if (productId) {
          const product = data.find((p) => p.id === productId)
          if (product) {
            setSelectedProduct(product)
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError("Gagal memuat data produk. Silakan refresh halaman.")
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
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

    // Check if user is authenticated
    if (!user) {
      setError("Anda harus login terlebih dahulu untuk membuat pesanan")
      setIsLoading(false)
      return
    }

    // Validation
    if (!selectedProduct) {
      setError("Silakan pilih paket katering terlebih dahulu")
      setIsLoading(false)
      return
    }

    if (!formData.eventDate || !formData.eventTime) {
      setError("Tanggal dan waktu acara wajib diisi")
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
      // Create order data
      const orderData = {
        user_id: user.id,
        product_id: selectedProduct.id,
        quantity: formData.quantity,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        total_amount: calculateTotal(),
        status: 'pending' as const,
        payment_status: 'pending' as const,
        notes: formData.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log('📝 Creating order with data:', orderData)

      // Save order to database
      const savedOrder = await orderService.createOrder(orderData)
      
      console.log('✅ Order created successfully:', savedOrder)

      setSuccess(`Pesanan berhasil dibuat dengan ID: ${savedOrder.id}. Silakan lakukan pembayaran untuk konfirmasi pesanan.`)

      // Reset form
      setFormData({
        quantity: 1,
        eventDate: "",
        eventTime: "",
        notes: "",
      })
      setSelectedProduct(null)

      // Redirect to payment page after 3 seconds
      setTimeout(() => {
        router.push(`/payment?order=${savedOrder.id}`)
      }, 3000)
    } catch (err: any) {
      console.error('❌ Error creating order:', err)
      console.error('❌ Error details:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      })
      setError(err.message || "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <LogIn className="w-6 h-6 mr-2" />
              Login Diperlukan
            </CardTitle>
            <CardDescription>
              Anda harus login terlebih dahulu untuk membuat pesanan katering aqiqah
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Silakan login atau daftar untuk melanjutkan proses booking
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Daftar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Memeriksa status login...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Pemesan
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/profile">
                  Edit Profil
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Data ini akan digunakan untuk pengiriman dan konfirmasi pesanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nama Lengkap</Label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nomor Telepon</Label>
                  <p className="text-sm font-medium">
                    {user.phone ? (
                      <span className="text-green-600">{user.phone}</span>
                    ) : (
                      <span className="text-red-500">Belum diisi</span>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Alamat Lengkap</Label>
                  <p className="text-sm font-medium">
                    {user.address ? (
                      <span className="text-green-600">{user.address}</span>
                    ) : (
                      <span className="text-red-500">Belum diisi</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Warning if data is incomplete */}
            {(!user.phone || !user.address) && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-amber-800">
                      Data Profil Belum Lengkap
                    </h4>
                    <div className="mt-1 text-sm text-amber-700">
                      <p>
                        Untuk memastikan pengiriman yang tepat, silakan lengkapi data profil Anda:
                      </p>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        {!user.phone && <li>Nomor telepon untuk konfirmasi</li>}
                        {!user.address && <li>Alamat lengkap untuk pengiriman</li>}
                      </ul>
                    </div>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" asChild className="bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100">
                        <Link href="/customer/profile">
                          Lengkapi Profil Sekarang
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success message if data is complete */}
            {user.phone && user.address && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">
                      Data Profil Lengkap
                    </h4>
                    <p className="text-sm text-green-700">
                      Semua informasi yang diperlukan sudah tersedia untuk proses booking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Memuat produk...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada produk tersedia saat ini.</p>
              </div>
            ) : (
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
                        {product.is_popular && (
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
            )}
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
