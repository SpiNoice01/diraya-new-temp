import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/data/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isPopular && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              <Star className="w-3 h-3 mr-1" />
              Populer
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="flex items-center text-sm font-medium">
              <Users className="w-3 h-3 mr-1" />
              {product.servings} porsi
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="text-2xl font-bold text-primary mb-3">{formatPrice(product.price)}</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Menu termasuk:</p>
          <ul className="text-xs text-muted-foreground">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
            {product.features.length > 3 && (
              <li className="text-primary font-medium">+{product.features.length - 3} menu lainnya</li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
            <Link href={`/katalog/${product.id}`}>Detail</Link>
          </Button>
          <Button size="sm" asChild className="flex-1">
            <Link href={`/booking?product=${product.id}`}>Pesan Sekarang</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
