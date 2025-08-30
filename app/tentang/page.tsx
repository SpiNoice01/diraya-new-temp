import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Award, 
  Heart, 
  Shield, 
  Star, 
  Clock, 
  ChefHat, 
  Sparkles,
  CheckCircle,
  Target,
  Eye,
  Handshake
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import Image from "next/image"

export default function TentangKamiPage() {
  const values = [
    {
      icon: Heart,
      title: "Kualitas Terjamin",
      description: "Menggunakan bahan-bahan segar dan berkualitas tinggi dengan standar halal yang ketat"
    },
    {
      icon: Shield,
      title: "Terpercaya",
      description: "Telah melayani ribuan keluarga dengan tingkat kepuasan pelanggan yang tinggi"
    },
    {
      icon: Clock,
      title: "Tepat Waktu",
      description: "Pengiriman dan penyajian tepat waktu sesuai jadwal acara aqiqah Anda"
    },
    {
      icon: Users,
      title: "Tim Profesional",
      description: "Didukung oleh tim chef berpengalaman dan pelayanan yang ramah dan profesional"
    }
  ]

  const achievements = [
    { number: "1000+", label: "Pesanan Berhasil" },
    { number: "98%", label: "Kepuasan Pelanggan" },
    { number: "5+", label: "Tahun Pengalaman" },
    { number: "50+", label: "Tim Profesional" }
  ]

  const team = [
    {
      name: "Ahmad Rahman",
      role: "Founder & CEO",
      image: "/placeholder-user.jpg",
      description: "Memiliki pengalaman 10+ tahun di industri katering dan hospitality"
    },
    {
      name: "Siti Nurhaliza",
      role: "Head Chef",
      image: "/placeholder-user.jpg",
      description: "Chef berpengalaman dengan sertifikasi halal dan food safety"
    },
    {
      name: "Budi Santoso",
      role: "Operations Manager",
      image: "/placeholder-user.jpg",
      description: "Ahli dalam mengelola operasional dan pelayanan customer"
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2" />
            Tentang Kami
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Katering Aqiqah
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground font-normal">
              Melayani dengan Hati
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Kami adalah penyedia layanan katering aqiqah terpercaya yang berkomitmen memberikan 
            <span className="text-primary font-semibold"> pengalaman terbaik</span> untuk momen spesial keluarga Indonesia.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gradient-to-br from-card via-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                <Eye className="w-4 h-4 mr-2" />
                Cerita Kami
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Memulai Perjalanan
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Katering Aqiqah didirikan pada tahun 2019 dengan visi untuk menjadi penyedia layanan 
                  katering aqiqah terdepan di Indonesia. Berawal dari kecintaan terhadap kuliner tradisional 
                  dan keinginan untuk melayani keluarga Indonesia dalam momen-momen spesial mereka.
                </p>
                <p>
                  Dengan pengalaman tim yang telah melayani ribuan acara aqiqah, kami memahami betul 
                  pentingnya kualitas, ketepatan waktu, dan pelayanan yang memuaskan. Setiap hidangan 
                  yang kami sajikan adalah hasil dari dedikasi dan passion tim kami.
                </p>
                <p>
                  Kami berkomitmen untuk terus berinovasi dan memberikan layanan terbaik dengan 
                  tetap mempertahankan cita rasa autentik dan standar kualitas yang tinggi.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image 
                  src="/traditional-indonesian-goat-curry-catering-spread.png" 
                  alt="Tim Katering Aqiqah" 
                  width={600} 
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Target className="w-4 h-4 mr-2" />
              Nilai-Nilai Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Komitmen Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Kami berkomitmen memberikan layanan terbaik dengan mengedepankan nilai-nilai yang 
              menjadi fondasi keberhasilan kami.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Award className="w-4 h-4 mr-2" />
              Pencapaian Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Yang Telah Kami Capai
            </h2>
            <p className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
              Berbagai pencapaian yang membuktikan komitmen kami dalam memberikan layanan terbaik
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {achievement.number}
                </div>
                <div className="text-lg opacity-90">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-card via-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-4 h-4 mr-2" />
              Tim Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Kenali Tim Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tim profesional yang siap melayani dan memberikan pengalaman terbaik untuk acara spesial Anda
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
                <CardHeader className="pb-4">
                  <div className="w-24 h-24 mx-auto mb-4">
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <Handshake className="w-4 h-4 mr-2" />
              Mari Bekerjasama
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Siap Melayani Acara Anda?
            </h2>
            <p className="text-xl mb-10 text-muted-foreground leading-relaxed">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik 
              untuk momen spesial keluarga Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/katalog" className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Lihat Paket Katering
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/kontak" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
