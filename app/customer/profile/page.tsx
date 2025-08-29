import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileForm } from "@/components/customer/profile-form"
import { Header } from "@/components/layout/header"

export default function CustomerProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

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
