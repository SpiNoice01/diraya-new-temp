import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Settings, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentActivities } from "@/components/admin/recent-activities"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel - Katering Aqiqah</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-foreground font-medium">
                Dashboard
              </Link>
              <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Pesanan
              </Link>
              <Link href="/admin/customers" className="text-muted-foreground hover:text-foreground transition-colors">
                Customer
              </Link>
              <Link href="/admin/products" className="text-muted-foreground hover:text-foreground transition-colors">
                Produk
              </Link>
              <Link href="/admin/payments" className="text-muted-foreground hover:text-foreground transition-colors">
                Pembayaran
              </Link>
              <Link href="/admin/reports" className="text-muted-foreground hover:text-foreground transition-colors">
                Laporan
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  <LogOut className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h2>
              <p className="text-muted-foreground">Kelola bisnis katering aqiqah Anda</p>
            </div>
            <div className="hidden md:block">
              <Button asChild>
                <Link href="/admin/reports">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Lihat Laporan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Stats */}
          <AdminStats />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <RecentActivities />
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/admin/orders">Kelola Pesanan</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/payments">Verifikasi Pembayaran</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/products">Kelola Produk</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/admin/customers">Lihat Customer</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
