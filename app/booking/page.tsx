import { BookingForm } from "@/components/booking/booking-form"
import Link from "next/link"
import { Header } from "@/components/layout/header"

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
      <Header />

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
