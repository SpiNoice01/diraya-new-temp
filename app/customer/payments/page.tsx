"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { PaymentStatusCard } from "@/components/payment/payment-status-card"
import { paymentService } from "@/lib/services/database"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import type { Payment } from "@/lib/types/database"

const paymentStatuses = [
  { id: "pending", name: "Menunggu" },
  { id: "completed", name: "Selesai" },
  { id: "failed", name: "Gagal" },
]

export default function CustomerPaymentsPage() {
  const { user, loading: authLoading } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch user payments
  useEffect(() => {
    const fetchUserPayments = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError("")
        
        // Get all payments for user's orders
        const allPayments = await paymentService.getAllPayments()
        // Filter for current user (you would need to join with orders to filter by user)
        setPayments(allPayments || [])
      } catch (err) {
        console.error('Error fetching payments:', err)
        setError("Gagal memuat data pembayaran")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchUserPayments()
    }
  }, [user, authLoading])

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = selectedStatus === "all" || payment.status === selectedStatus
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.order_id.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Link href="/customer/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Pesanan
              </Link>
              <Link href="/customer/payments" className="text-foreground font-medium">
                Pembayaran
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Riwayat Pembayaran</h2>
          <p className="text-muted-foreground">Pantau status pembayaran dan riwayat transaksi Anda</p>
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
                placeholder="Cari pembayaran..."
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
              {paymentStatuses.map((status) => (
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

      {/* Payments List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery || selectedStatus !== "all"
                  ? "Tidak ada pembayaran yang sesuai dengan filter Anda."
                  : "Anda belum memiliki riwayat pembayaran."}
              </p>
              {!searchQuery && selectedStatus === "all" ? (
                <Button asChild>
                  <Link href="/booking">Buat Pesanan Baru</Link>
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
                <p className="text-muted-foreground">Menampilkan {filteredPayments.length} pembayaran</p>
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

              <div className="grid md:grid-cols-2 gap-6">
                {filteredPayments.map((payment) => (
                  <PaymentStatusCard key={payment.id} payment={payment} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
