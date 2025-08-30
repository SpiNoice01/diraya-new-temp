"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Users, Calendar, Clock, MapPin, Phone, Mail, Package, CheckCircle, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { productService } from "@/lib/services/database"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import type { Product } from "@/lib/types/database"
import { Loader2, AlertCircle, XCircle } from "lucide-react"

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { user, loading: authLoading } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const productId = unwrappedParams.id

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        setError("")
        
        console.log('Fetching product details for ID:', productId)
        
        // Fetch product
        const productData = await productService.getProductById(productId)
        setProduct(productData)
        
        console.log('Product details fetched successfully')
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError("Gagal memuat detail produk. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Memuat detail produk...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
              <Button variant="outline" asChild>
                <Link href="/katalog">
                  Kembali ke Katalog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-6">Produk dengan ID tersebut tidak ditemukan atau telah dihapus.</p>
            <Button asChild>
              <Link href="/katalog">
                Kembali ke Katalog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Katering Aqiqah</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Beranda
              </Link>
              <Link href="/katalog" className="text-foreground font-medium">
                Katalog
              </Link>
              <Link href="/booking" className="text-muted-foreground hover:text-foreground transition-colors">
                Booking
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/customer/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                  <Link href="/customer/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                    Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                    Masuk
                  </Link>
                  <Link href="/auth/register" className="text-primary hover:underline font-medium">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/katalog" className="hover:text-foreground transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/katalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Katalog
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{product.name}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" asChild>
                <Link href={`/booking?product=${product.id}`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Pesan Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {product.is_popular && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Populer
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center text-sm font-medium">
                      <Users className="w-3 h-3 mr-1" />
                      {product.servings} porsi
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Price and Category */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-sm">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </Badge>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Menu yang Disediakan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Package Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Paket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Kapasitas</p>
                          <p className="text-sm text-muted-foreground">{product.servings} porsi</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Kategori</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1" asChild>
                    <Link href={`/booking?product=${product.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Pesan Sekarang
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Konsultasi
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-12 space-y-6">
              {/* Why Choose This Package */}
              <Card>
                <CardHeader>
                  <CardTitle>Mengapa Memilih Paket Ini?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Kualitas Terjamin</h4>
                      <p className="text-sm text-muted-foreground">
                        Menggunakan bahan berkualitas tinggi dan halal
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Tepat Waktu</h4>
                      <p className="text-sm text-muted-foreground">
                        Pengiriman tepat waktu sesuai jadwal acara
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Layanan Lengkap</h4>
                      <p className="text-sm text-muted-foreground">
                        Termasuk setup dan pengaturan di lokasi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>0812-3456-7890</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>info@kateringaqiqah.com</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Senin - Minggu: 08:00 - 20:00</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Jakarta Selatan, DKI Jakarta</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
