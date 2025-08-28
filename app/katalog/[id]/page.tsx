import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Users, Clock, Shield, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/data/products"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const pricePerServing = Math.round(product.price / product.servings)

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
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Daftar</Link>
              </Button>
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

      {/* Product Detail */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/katalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Katalog
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.isPopular && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Populer
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-3">{product.name}</h1>
                <p className="text-muted-foreground text-lg">{product.description}</p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span>{product.servings} porsi</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <span>Siap dalam 2-3 jam</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-primary" />
                  <span>Halal & Higienis</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
                <p className="text-muted-foreground">{formatPrice(pricePerServing)} per porsi</p>
              </div>

              <div className="flex gap-3">
                <Button size="lg" asChild className="flex-1">
                  <Link href={`/booking?product=${product.id}`}>Pesan Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Konsultasi
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jaminan Kualitas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">Bahan segar dan berkualitas tinggi</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">Sertifikat halal MUI</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">Pengiriman tepat waktu</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">Garansi kepuasan 100%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Menu Details */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Menu Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
