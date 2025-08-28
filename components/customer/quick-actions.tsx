import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, CreditCard, MessageCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Pesan Katering",
      description: "Buat pesanan baru",
      icon: Plus,
      href: "/booking",
      variant: "default" as const,
    },
    {
      title: "Lihat Katalog",
      description: "Jelajahi paket tersedia",
      icon: Search,
      href: "/katalog",
      variant: "outline" as const,
    },
    {
      title: "Cek Pembayaran",
      description: "Status pembayaran",
      icon: CreditCard,
      href: "/customer/payments",
      variant: "outline" as const,
    },
    {
      title: "Hubungi Kami",
      description: "Customer service",
      icon: MessageCircle,
      href: "#kontak",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="lg"
              asChild
              className="h-auto p-4 flex flex-col items-center text-center"
            >
              <Link href={action.href}>
                <action.icon className="w-6 h-6 mb-2" />
                <div>
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
