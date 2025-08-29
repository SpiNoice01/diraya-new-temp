"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/contexts/auth-context-simple"

interface ChangePasswordDialogProps {
  trigger: React.ReactNode
}

export function ChangePasswordDialog({ trigger }: ChangePasswordDialogProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Semua field wajib diisi")
      setIsLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok")
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password baru minimal 6 karakter")
      setIsLoading(false)
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("Password baru tidak boleh sama dengan password lama")
      setIsLoading(false)
      return
    }

    try {
      // Step 1: Verify current password by attempting to sign in
      console.log('🔐 Verifying current password...')
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: formData.currentPassword
      })

      if (verifyError) {
        console.log('❌ Password verification failed:', verifyError.message)
        setError("Password saat ini salah. Silakan cek kembali password Anda.")
        setIsLoading(false)
        return
      }

      console.log('✅ Current password verified successfully')

      // Step 2: Update password using Supabase Auth
      console.log('🔑 Updating password...')
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      console.log('✅ Password updated successfully')
      setSuccess("Password berhasil diubah! Silakan login kembali dengan password baru.")
      
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsOpen(false)
        setSuccess("")
      }, 2000)

    } catch (err: any) {
      console.error('Password update error:', err)
      setError(err.message || "Terjadi kesalahan saat mengubah password. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset form when dialog closes
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setError("")
      setSuccess("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Ubah Password
          </DialogTitle>
          <DialogDescription>
            Masukkan password lama dan password baru untuk mengubah password akun Anda
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="pt-6">
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
                <Label htmlFor="currentPassword">Password Saat Ini *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Masukkan password saat ini"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password ini akan diverifikasi sebelum mengubah password
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Masukkan password baru (min. 6 karakter)"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password minimal 6 karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Masukkan ulang password baru"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ubah Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
