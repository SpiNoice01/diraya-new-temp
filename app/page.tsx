import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <h1 className="text-xl font-bold text-foreground">Katering Aqiqah</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/katalog" className="text-muted-foreground hover:text-foreground transition-colors">
                Katalog
              </Link>
              <Link href="#tentang" className="text-muted-foreground hover:text-foreground transition-colors">
                Tentang Kami
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
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            Layanan Katering Terpercaya
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Katering Aqiqah
            <span className="text-primary block">Berkualitas Tinggi</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wujudkan momen aqiqah yang berkesan dengan layanan katering profesional. Berbagai paket pilihan dengan cita
            rasa terbaik dan pelayanan memuaskan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/katalog">Lihat Paket Katering</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#tentang">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Mengapa Memilih Kami?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan layanan katering aqiqah terbaik dengan standar kualitas tinggi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Kualitas Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Menggunakan bahan-bahan segar dan berkualitas tinggi dengan standar halal yang ketat
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tim Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Didukung oleh tim chef berpengalaman dan pelayanan yang ramah dan profesional
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Tepat Waktu</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Pengiriman dan penyajian tepat waktu sesuai jadwal acara aqiqah Anda</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Terpercaya</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Telah melayani ribuan keluarga dengan tingkat kepuasan pelanggan yang tinggi
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Siap Merencanakan Aqiqah Anda?</h3>
          <p className="text-xl mb-8 opacity-90">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">Mulai Booking Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <h4 className="font-bold text-foreground">Katering Aqiqah</h4>
              </div>
              <p className="text-muted-foreground">
                Layanan katering aqiqah terpercaya dengan kualitas terbaik dan pelayanan profesional.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Layanan</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/katalog" className="hover:text-foreground transition-colors">
                    Paket Katering
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="hover:text-foreground transition-colors">
                    Booking Online
                  </Link>
                </li>
                <li>
                  <Link href="/konsultasi" className="hover:text-foreground transition-colors">
                    Konsultasi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Perusahaan</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/tentang" className="hover:text-foreground transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/testimoni" className="hover:text-foreground transition-colors">
                    Testimoni
                  </Link>
                </li>
                <li>
                  <Link href="/karir" className="hover:text-foreground transition-colors">
                    Karir
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Kontak</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>Email: info@kateringaqiqah.com</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>WhatsApp: +62 812-3456-7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Katering Aqiqah. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
