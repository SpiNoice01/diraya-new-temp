"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Plus } from "lucide-react"
import Link from "next/link"
import { OrderCard } from "@/components/order/order-card"
import { orders, orderStatuses } from "@/lib/data/orders"

export default function CustomerOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock: Filter orders for current user
  const userOrders = orders // In real app, filter by current user ID

  const filteredOrders = userOrders.filter((order) => {
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
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
              <Link href="/katalog" className="text-muted-foreground hover:text-foreground transition-colors">
                Katalog
              </Link>
              <Link href="/customer/orders" className="text-foreground font-medium">
                Pesanan Saya
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/booking">
                  <Plus className="w-4 h-4 mr-2" />
                  Pesan Baru
                </Link>
              </Button>
              <Link href="/customer/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                Profil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Pesanan Saya</h2>
          <p className="text-muted-foreground">Kelola dan pantau status pesanan katering aqiqah Anda</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Status:</span>
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                Semua
              </Button>
              {orderStatuses.map((status) => (
                <Button
                  key={status.id}
                  variant={selectedStatus === status.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status.id)}
                >
                  {status.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery || selectedStatus !== "all"
                  ? "Tidak ada pesanan yang sesuai dengan filter Anda."
                  : "Anda belum memiliki pesanan."}
              </p>
              {!searchQuery && selectedStatus === "all" ? (
                <Button asChild>
                  <Link href="/booking">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Pesanan Pertama
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedStatus("all")
                  }}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">Menampilkan {filteredOrders.length} pesanan</p>
                {(searchQuery || selectedStatus !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedStatus("all")
                    }}
                  >
                    Reset Filter
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
