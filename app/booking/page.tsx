import { BookingForm } from "@/components/booking/booking-form"
import Link from "next/link"

interface BookingPageProps {
  searchParams: Promise<{
    product?: string
  }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams
  
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
              <Link href="/booking" className="text-foreground font-medium">
                Booking
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Masuk
              </Link>
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Daftar
              </Link>
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
          <span className="text-foreground">Booking</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Booking Katering Aqiqah</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Isi form di bawah ini untuk memesan paket katering aqiqah. Tim kami akan menghubungi Anda untuk konfirmasi
            pesanan.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <BookingForm productId={params.product} />
        </div>
      </section>
    </div>
  )
}
