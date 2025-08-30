"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  Sparkles,
  ChefHat,
  Users,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon",
      value: "(021) 1234-5678",
      description: "Senin - Jumat, 08:00 - 17:00 WIB"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@kateringaqiqah.com",
      description: "Respon dalam 24 jam"
    },
    {
      icon: MapPin,
      title: "Alamat",
      value: "Jl. Sudirman No. 123, Jakarta Pusat",
      description: "DKI Jakarta, Indonesia"
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      value: "Senin - Minggu",
      description: "08:00 - 20:00 WIB"
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })
    }, 3000)
  }

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
            <MessageSquare className="w-4 h-4 mr-2" />
            Hubungi Kami
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Kontak Kami
            </span>
            <span className="block text-3xl md:text-4xl mt-2 text-muted-foreground font-normal">
              Siap Melayani Anda
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Hubungi kami untuk konsultasi, pertanyaan, atau pemesanan layanan katering aqiqah. 
            <span className="text-primary font-semibold"> Tim kami siap membantu Anda 24/7.</span>
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-card via-background to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Users className="w-4 h-4 mr-2" />
              Informasi Kontak
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Cara Menghubungi Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Pilih cara yang paling nyaman untuk menghubungi kami. Tim kami siap melayani 
              pertanyaan dan kebutuhan Anda.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center group hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-background to-card">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-primary">{info.value}</p>
                    <CardDescription className="text-base leading-relaxed">
                      {info.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Badge className="mb-4" variant="secondary">
                <Send className="w-4 h-4 mr-2" />
                Kirim Pesan
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Kirim Pesan
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Isi form di bawah ini untuk mengirim pesan kepada kami. Kami akan merespon 
                dalam waktu 24 jam.
              </p>

              {isSubmitted ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <div>
                        <h3 className="font-semibold">Pesan Terkirim!</h3>
                        <p className="text-sm">Terima kasih telah menghubungi kami. Kami akan segera merespon pesan Anda.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Nama Lengkap *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-2 focus:border-primary transition-all duration-300"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-2 focus:border-primary transition-all duration-300"
                        placeholder="contoh@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Nomor Telepon
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 focus:border-primary transition-all duration-300"
                        placeholder="0812-3456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subjek *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="border-2 focus:border-primary transition-all duration-300"
                        placeholder="Konsultasi / Pemesanan / Pertanyaan"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Pesan *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="border-2 focus:border-primary transition-all duration-300 resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengirim Pesan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Kirim Pesan</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="border-0 bg-gradient-to-br from-background to-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Lokasi Kami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Peta Lokasi</p>
                      <p className="text-sm text-muted-foreground">Jl. Sudirman No. 123, Jakarta Pusat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                    Konsultasi Cepat
                  </CardTitle>
                  <CardDescription>
                    Butuh konsultasi cepat? Hubungi kami langsung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Telepon Langsung</p>
                      <p className="text-sm text-muted-foreground">(021) 1234-5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Email Cepat</p>
                      <p className="text-sm text-muted-foreground">info@kateringaqiqah.com</p>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/booking">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Booking Sekarang
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pertanyaan Umum
            </h2>
            <p className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
              Pertanyaan yang sering diajukan oleh pelanggan kami
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Berapa lama waktu pemesanan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/90">
                  Kami menerima pemesanan minimal 3 hari sebelum acara untuk memastikan kualitas dan persiapan yang optimal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Apakah ada jaminan halal?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/90">
                  Ya, semua bahan dan proses memasak kami telah bersertifikat halal dari MUI dan mengikuti standar kehalalan yang ketat.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Bagaimana dengan pembayaran?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/90">
                  Kami menerima pembayaran melalui transfer bank, e-wallet, dan pembayaran tunai. DP 50% saat pemesanan, sisanya sebelum acara.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Apakah ada area layanan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-foreground/90">
                  Kami melayani area Jakarta dan sekitarnya. Untuk area yang lebih jauh, dapat dikonsultasikan terlebih dahulu.
                </p>
              </CardContent>
            </Card>
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
              <ChefHat className="w-4 h-4 mr-2" />
              Siap Melayani
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mulai Perencanaan Acara Anda
            </h2>
            <p className="text-xl mb-10 text-muted-foreground leading-relaxed">
              Jangan ragu untuk menghubungi kami. Tim kami siap membantu merencanakan 
              acara aqiqah yang sempurna untuk keluarga Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/katalog" className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  Lihat Paket Katering
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-all duration-300" asChild>
                <Link href="/booking" className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Booking Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
