import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileForm } from "@/components/customer/profile-form"

export default function CustomerProfilePage() {
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
              <Link
                href="/customer/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/customer/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                Pesanan
              </Link>
              <Link href="/customer/profile" className="text-foreground font-medium">
                Profil
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link
                href="/customer/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/customer/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground">Profil</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/customer/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
          <h2 className="text-3xl font-bold text-foreground mb-4">Profil Saya</h2>
          <p className="text-muted-foreground">Kelola informasi profil dan pengaturan akun Anda</p>
        </div>
      </section>

      {/* Profile Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProfileForm />
        </div>
      </section>
    </div>
  )
}
