import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductManagementTable } from "@/components/admin/product-management-table"

export default function AdminProductsPage() {
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
              <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Pesanan
              </Link>
              <Link href="/admin/customers" className="text-muted-foreground hover:text-foreground transition-colors">
                Customer
              </Link>
              <Link href="/admin/products" className="text-foreground font-medium">
                Produk
              </Link>
              <Link href="/admin/payments" className="text-muted-foreground hover:text-foreground transition-colors">
                Pembayaran
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Kelola Produk</h2>
              <p className="text-muted-foreground">Kelola paket katering aqiqah yang tersedia</p>
            </div>
            <Button asChild>
              <Link href="/admin/products/create">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Management */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <ProductManagementTable />
        </div>
      </section>
    </div>
  )
}
