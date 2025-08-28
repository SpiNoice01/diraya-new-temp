import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/customer/dashboard-stats"
import { RecentOrders } from "@/components/customer/recent-orders"
import { QuickActions } from "@/components/customer/quick-actions"
import { currentCustomer } from "@/lib/data/customers"

export default function CustomerDashboardPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
              <Link href="/customer/dashboard" className="text-foreground font-medium">
                Dashboard
              </Link>
              <Link href="/customer/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Pesanan
              </Link>
              <Link href="/customer/payments" className="text-muted-foreground hover:text-foreground transition-colors">
                Pembayaran
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/customer/profile">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentCustomer.avatar || "/placeholder.svg"} alt={currentCustomer.name} />
                <AvatarFallback>
                  {currentCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Selamat datang, {currentCustomer.name}!</h2>
              <p className="text-muted-foreground">Bergabung sejak {formatDate(currentCustomer.joinedAt)}</p>
            </div>
            <div className="hidden md:block">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentCustomer.avatar || "/placeholder.svg"} alt={currentCustomer.name} />
                <AvatarFallback className="text-lg">
                  {currentCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 space-y-8">
          {/* Stats */}
          <DashboardStats customerId={currentCustomer.id} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrders customerId={currentCustomer.id} />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Profile Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informasi Profil
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/customer/profile">Edit Profil</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{currentCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                  <p className="text-sm">{currentCustomer.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                  <p className="text-sm">{currentCustomer.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
