"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/product/product-card"
import { productService } from "@/lib/services/database"
import type { Product } from "@/lib/types/database"

export default function KatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = [
    { id: "all", name: "Semua Paket" },
    { id: "ekonomis", name: "Ekonomis" },
    { id: "standar", name: "Standar" },
    { id: "premium", name: "Premium" },
    { id: "deluxe", name: "Deluxe" },
    { id: "spesial", name: "Spesial" },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Try to fetch from Supabase first
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (err) {
        console.warn("Failed to fetch from Supabase, using mock data:", err)
        // Fallback to mock data if Supabase fails
        const mockProducts = [
          {
            id: "paket-ekonomis-25",
            name: "Paket Ekonomis 25 Porsi",
            description: "Paket hemat untuk acara aqiqah keluarga kecil dengan menu lengkap dan berkualitas",
            price: 750000,
            image_url: "/indonesian-catering-food-spread-with-rice-and-dish.png",
            category: "ekonomis",
            servings: 25,
            features: ["Nasi putih", "Ayam gulai", "Sayur lodeh", "Kerupuk", "Sambal", "Air mineral"],
            is_popular: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "paket-standar-50",
            name: "Paket Standar 50 Porsi",
            description: "Paket populer dengan menu beragam dan porsi yang cukup untuk acara aqiqah menengah",
            price: 1500000,
            image_url: "/elegant-indonesian-buffet-catering-setup.png",
            category: "standar",
            servings: 50,
            features: [
              "Nasi putih & nasi kuning",
              "Ayam gulai & rendang",
              "Sayur lodeh & tumis kangkung",
              "Kerupuk & emping",
              "Sambal & acar",
              "Air mineral & teh manis",
            ],
            is_popular: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "paket-premium-75",
            name: "Paket Premium 75 Porsi",
            description: "Paket premium dengan menu mewah dan pelayanan terbaik untuk acara aqiqah yang berkesan",
            price: 2500000,
            image_url: "/luxury-indonesian-catering-with-traditional-decora.png",
            category: "premium",
            servings: 75,
            features: [
              "Nasi putih, kuning & uduk",
              "Ayam gulai, rendang & bakar",
              "Sayur lodeh, tumis kangkung & gado-gado",
              "Kerupuk, emping & rempeyek",
              "Sambal, acar & lalap",
              "Air mineral, teh manis & es jeruk",
              "Buah potong",
            ],
            is_popular: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "paket-deluxe-100",
            name: "Paket Deluxe 100 Porsi",
            description: "Paket terlengkap dengan menu istimewa dan dekorasi menarik untuk acara aqiqah besar",
            price: 3500000,
            image_url: "/grand-indonesian-feast-catering-with-decorative-se.png",
            category: "deluxe",
            servings: 100,
            features: [
              "Nasi putih, kuning, uduk & liwet",
              "Ayam gulai, rendang, bakar & opor",
              "Sayur lodeh, tumis kangkung, gado-gado & sop",
              "Kerupuk, emping, rempeyek & kacang",
              "Sambal, acar, lalap & asinan",
              "Air mineral, teh manis, es jeruk & kopi",
              "Buah potong & es buah",
              "Dekorasi meja",
            ],
            is_popular: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "paket-kambing-50",
            name: "Paket Kambing 50 Porsi",
            description: "Paket spesial dengan menu kambing untuk tradisi aqiqah yang lebih lengkap",
            price: 2800000,
            image_url: "/traditional-indonesian-goat-curry-catering-spread.png",
            category: "spesial",
            servings: 50,
            features: [
              "Nasi putih & nasi kuning",
              "Gulai kambing",
              "Sate kambing",
              "Sayur lodeh",
              "Kerupuk & emping",
              "Sambal & acar",
              "Air mineral & teh manis",
            ],
            is_popular: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "paket-kambing-100",
            name: "Paket Kambing 100 Porsi",
            description: "Paket kambing premium untuk acara aqiqah besar dengan cita rasa autentik",
            price: 5500000,
            image_url: "/premium-indonesian-goat-feast-catering-with-tradit.png",
            category: "spesial",
            servings: 100,
            features: [
              "Nasi putih, kuning & uduk",
              "Gulai kambing",
              "Sate kambing",
              "Rendang kambing",
              "Sayur lodeh & tumis kangkung",
              "Kerupuk, emping & rempeyek",
              "Sambal, acar & lalap",
              "Air mineral, teh manis & es jeruk",
              "Buah potong",
              "Dekorasi tradisional",
            ],
            is_popular: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        setProducts(mockProducts)
        setError("") // Clear any previous errors
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
              <Link href="#kontak" className="text-muted-foreground hover:text-foreground transition-colors">
                Kontak
              </Link>
            </nav>
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

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Katalog Paket Katering Aqiqah</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Pilih paket katering aqiqah yang sesuai dengan kebutuhan dan budget Anda. Semua paket menggunakan bahan
            berkualitas tinggi dan halal.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari paket katering..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Kategori:</span>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Memuat produk...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Coba Lagi
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Tidak ada paket yang sesuai dengan pencarian Anda.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="mt-4"
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Menampilkan {filteredProducts.length} paket katering</p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Reset Filter
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Butuh Paket Khusus?</h3>
          <p className="text-lg mb-6 opacity-90">
            Hubungi kami untuk konsultasi dan paket kustomisasi sesuai kebutuhan Anda
          </p>
          <Button size="lg" variant="secondary">
            Konsultasi Gratis
          </Button>
        </div>
      </section>
    </div>
  )
}
