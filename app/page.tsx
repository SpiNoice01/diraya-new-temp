import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock, Shield, Sparkles, ChefHat, Heart, Award } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section with Enhanced Design */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full mb-6 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Layanan Katering Terpercaya</span>
          </div>
          
          {/* Main Heading with Enhanced Typography */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Katering Aqiqah
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground font-normal">
              Berkualitas Tinggi
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Wujudkan momen aqiqah yang berkesan dengan layanan katering profesional. 
            <span className="text-primary font-semibold"> Berbagai paket pilihan</span> dengan cita
            rasa terbaik dan pelayanan memuaskan.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/katalog" className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Lihat Paket Katering
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="#tentang" className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
          
          {/* Floating Stats */}
          <div className="flex justify-center gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Pesanan Berhasil</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Kepuasan Pelanggan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-card via-background to-card/50" id="tentang">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Award className="w-4 h-4 mr-2" />
              Keunggulan Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kami berkomitmen memberikan layanan katering aqiqah terbaik dengan standar kualitas tinggi
              dan pelayanan yang memuaskan setiap pelanggan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Kualitas Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Menggunakan bahan-bahan segar dan berkualitas tinggi dengan standar halal yang ketat
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Tim Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Didukung oleh tim chef berpengalaman dan pelayanan yang ramah dan profesional
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Tepat Waktu</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Pengiriman dan penyajian tepat waktu sesuai jadwal acara aqiqah Anda
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Terpercaya</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Telah melayani ribuan keluarga dengan tingkat kepuasan pelanggan yang tinggi
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/90 to-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Siap Merencanakan Aqiqah Anda?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
            untuk momen spesial keluarga Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/auth/register" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Mulai Booking Sekarang
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/katalog" className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Lihat Katalog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-card via-background to-card border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Link href="/">
                  <Image src="/logo.png" alt="Katering Aqiqah" width={150} height={40} priority />
                </Link>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Layanan katering aqiqah terpercaya dengan kualitas terbaik dan pelayanan profesional.
                Kami berkomitmen memberikan pengalaman terbaik untuk momen spesial Anda.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4 text-lg">Layanan</h5>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/katalog" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Paket Katering
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Booking Online
                  </Link>
                </li>
                <li>
                  <Link href="/konsultasi" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Konsultasi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4 text-lg">Perusahaan</h5>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/tentang" className="hover:text-foreground transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/kontak" className="hover:text-foreground transition-colors">
                    Kontak
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
              <h5 className="font-semibold text-foreground mb-4 text-lg">Kontak</h5>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Email: info@kateringaqiqah.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Telepon: (021) 1234-5678
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  WhatsApp: +62 812-3456-7890
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Katering Aqiqah. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
