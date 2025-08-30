"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Sparkles, ChefHat, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product/product-card"
import { productService } from "@/lib/services/database"
import type { Product } from "@/lib/types/database"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"

export default function KatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = [
    { id: "all", name: "Semua Paket", icon: "🍽️" },
    { id: "ekonomis", name: "Ekonomis", icon: "💰" },
    { id: "standar", name: "Standar", icon: "⭐" },
    { id: "premium", name: "Premium", icon: "👑" },
    { id: "deluxe", name: "Deluxe", icon: "💎" },
    { id: "spesial", name: "Spesial", icon: "🎉" },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getAllProducts()
        setProducts(data)
        setError("")
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("Gagal memuat data produk. Silakan refresh halaman.")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <Header />

      {/* Enhanced Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2" />
            Katalog Lengkap
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Paket Katering Aqiqah
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Pilih paket katering aqiqah yang sesuai dengan kebutuhan dan budget Anda. 
            <span className="text-primary font-semibold"> Semua paket menggunakan bahan berkualitas tinggi dan halal.</span>
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{products.length}+</div>
              <div className="text-sm text-muted-foreground">Paket Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Halal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Konsultasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters and Search */}
      <section className="py-8 bg-gradient-to-br from-card via-background to-card border-b sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Cari paket katering..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Enhanced Category Filter */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="w-4 h-4" />
                <span>Kategori:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-primary to-primary/90 shadow-lg' 
                        : 'hover:bg-primary/10 hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Grid */}
      <section className="py-12 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-card rounded-full shadow-lg">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">Memuat produk...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto p-8 bg-card rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada paket yang ditemukan</h3>
                <p className="text-muted-foreground mb-6">
                  Tidak ada paket yang sesuai dengan pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <ChefHat className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {filteredProducts.length} paket ditemukan
                    </span>
                  </div>
                  {(searchQuery || selectedCategory !== "all") && (
                    <Badge variant="secondary" className="text-xs">
                      Filter Aktif
                    </Badge>
                  )}
                </div>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>

              {/* Products Grid with Enhanced Layout */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="group transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Paket Khusus
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Butuh Paket Khusus?
            </h2>
            <p className="text-xl mb-10 opacity-95 leading-relaxed">
              Hubungi kami untuk konsultasi dan paket kustomisasi sesuai kebutuhan Anda. 
              Tim kami siap membantu merancang menu yang sempurna untuk acara spesial Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/booking" className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Konsultasi Gratis
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/auth/register" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Daftar Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
