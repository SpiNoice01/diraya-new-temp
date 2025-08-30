"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "@/components/order/order-status-badge"
import { orderService } from "@/lib/services/database"
import type { Order } from "@/lib/types/database"

// Order status options
const orderStatuses = [
  { id: "pending", name: "Menunggu Konfirmasi" },
  { id: "confirmed", name: "Dikonfirmasi" },
  { id: "preparing", name: "Sedang Dipersiapkan" },
  { id: "delivered", name: "Dikirim" },
  { id: "completed", name: "Selesai" },
  { id: "cancelled", name: "Dibatalkan" },
]

export function OrderManagementTable() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError("")
        const data = await orderService.getAllOrders()
        setOrders(data || [])
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError("Gagal memuat data pesanan")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus as Order['status'])
      // Refresh orders after update
      const data = await orderService.getAllOrders()
      setOrders(data || [])
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Memuat data pesanan...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Kelola Pesanan ({orders.length})</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {orderStatuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {statusFilter === "all" ? "Belum ada pesanan" : "Tidak ada pesanan dengan status ini"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pesanan</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Tanggal Acara</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{(order as any).users?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{(order as any).users?.phone || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{(order as any).products?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{order.quantity} paket</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.event_date)}</TableCell>
                    <TableCell className="font-medium">{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue>
                            <OrderStatusBadge status={order.status} type="order" />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/order/${order.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
