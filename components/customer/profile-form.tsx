"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, User, Lock } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import { AvatarUploadSimple } from "@/components/ui/avatar-upload-simple"
import { ChangePasswordDialog } from "@/components/customer/change-password-dialog"

export function ProfileForm() {
  const { user, updateProfile, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Semua field wajib diisi")
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid")
      setIsLoading(false)
      return
    }

    try {
      // Update profile using auth context
      const { error: updateError } = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      })

      if (updateError) {
        throw new Error(updateError)
      }

      setSuccess("Profil berhasil diperbarui!")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setSuccess("Foto profil berhasil diperbarui!")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuat data profil...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Anda harus login untuk mengakses halaman profil
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Foto Profil
          </CardTitle>
          <CardDescription>Upload foto profil Anda untuk personalisasi akun</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUploadSimple
            currentAvatarUrl={user.avatar_url}
            userName={user.name}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui informasi profil dan kontak Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="08123456789"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Akun</CardTitle>
          <CardDescription>Kelola keamanan dan preferensi akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChangePasswordDialog
            trigger={
              <Button variant="outline" className="w-full bg-transparent">
                <Lock className="w-4 h-4 mr-2" />
                Ubah Password
              </Button>
            }
          />
          <Button variant="outline" className="w-full bg-transparent">
            Pengaturan Notifikasi
          </Button>
          <Button variant="destructive" className="w-full">
            Hapus Akun
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
