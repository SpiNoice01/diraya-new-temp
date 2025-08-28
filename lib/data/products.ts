export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  servings: number
  features: string[]
  isPopular?: boolean
}

export const products: Product[] = [
  {
    id: "paket-ekonomis-25",
    name: "Paket Ekonomis 25 Porsi",
    description: "Paket hemat untuk acara aqiqah keluarga kecil dengan menu lengkap dan berkualitas",
    price: 750000,
    image: "/indonesian-catering-food-spread-with-rice-and-dish.png",
    category: "ekonomis",
    servings: 25,
    features: ["Nasi putih", "Ayam gulai", "Sayur lodeh", "Kerupuk", "Sambal", "Air mineral"],
  },
  {
    id: "paket-standar-50",
    name: "Paket Standar 50 Porsi",
    description: "Paket populer dengan menu beragam dan porsi yang cukup untuk acara aqiqah menengah",
    price: 1500000,
    image: "/elegant-indonesian-buffet-catering-setup.png",
    category: "standar",
    servings: 50,
    features: [
      "Nasi putih & nasi kuning",
      "Ayam gulai & rendang",
      "Sayur lodeh & tumis kangkung",
      "Kerupuk & emping",
      "Sambal & acar",
      "Air mineral & teh manis",
    ],
    isPopular: true,
  },
  {
    id: "paket-premium-75",
    name: "Paket Premium 75 Porsi",
    description: "Paket premium dengan menu mewah dan pelayanan terbaik untuk acara aqiqah yang berkesan",
    price: 2500000,
    image: "/luxury-indonesian-catering-with-traditional-decora.png",
    category: "premium",
    servings: 75,
    features: [
      "Nasi putih, kuning & uduk",
      "Ayam gulai, rendang & bakar",
      "Sayur lodeh, tumis kangkung & gado-gado",
      "Kerupuk, emping & rempeyek",
      "Sambal, acar & lalap",
      "Air mineral, teh manis & es jeruk",
      "Buah potong",
    ],
  },
  {
    id: "paket-deluxe-100",
    name: "Paket Deluxe 100 Porsi",
    description: "Paket terlengkap dengan menu istimewa dan dekorasi menarik untuk acara aqiqah besar",
    price: 3500000,
    image: "/grand-indonesian-feast-catering-with-decorative-se.png",
    category: "deluxe",
    servings: 100,
    features: [
      "Nasi putih, kuning, uduk & liwet",
      "Ayam gulai, rendang, bakar & opor",
      "Sayur lodeh, tumis kangkung, gado-gado & sop",
      "Kerupuk, emping, rempeyek & kacang",
      "Sambal, acar, lalap & asinan",
      "Air mineral, teh manis, es jeruk & kopi",
      "Buah potong & es buah",
      "Dekorasi meja",
    ],
  },
  {
    id: "paket-kambing-50",
    name: "Paket Kambing 50 Porsi",
    description: "Paket spesial dengan menu kambing untuk tradisi aqiqah yang lebih lengkap",
    price: 2800000,
    image: "/traditional-indonesian-goat-curry-catering-spread.png",
    category: "spesial",
    servings: 50,
    features: [
      "Nasi putih & nasi kuning",
      "Gulai kambing",
      "Sate kambing",
      "Sayur lodeh",
      "Kerupuk & emping",
      "Sambal & acar",
      "Air mineral & teh manis",
    ],
    isPopular: true,
  },
  {
    id: "paket-kambing-100",
    name: "Paket Kambing 100 Porsi",
    description: "Paket kambing premium untuk acara aqiqah besar dengan cita rasa autentik",
    price: 5500000,
    image: "/premium-indonesian-goat-feast-catering-with-tradit.png",
    category: "spesial",
    servings: 100,
    features: [
      "Nasi putih, kuning & uduk",
      "Gulai kambing",
      "Sate kambing",
      "Rendang kambing",
      "Sayur lodeh & tumis kangkung",
      "Kerupuk, emping & rempeyek",
      "Sambal, acar & lalap",
      "Air mineral, teh manis & es jeruk",
      "Buah potong",
      "Dekorasi tradisional",
    ],
  },
]

export const categories = [
  { id: "all", name: "Semua Paket" },
  { id: "ekonomis", name: "Ekonomis" },
  { id: "standar", name: "Standar" },
  { id: "premium", name: "Premium" },
  { id: "deluxe", name: "Deluxe" },
  { id: "spesial", name: "Spesial" },
]
