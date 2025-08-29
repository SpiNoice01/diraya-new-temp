"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Loader2, Camera } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/contexts/auth-context-simple"
import { cn } from "@/lib/utils"

interface AvatarUploadFixedProps {
  currentAvatarUrl?: string
  userName: string
  onAvatarUpdate: (newAvatarUrl: string) => void
  className?: string
}

export function AvatarUploadFixed({ 
  currentAvatarUrl, 
  userName, 
  onAvatarUpdate, 
  className 
}: AvatarUploadFixedProps) {
  const { updateAvatar } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.")
      return
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setError("Ukuran file terlalu besar. Maksimal 2MB.")
      return
    }

    setError("")
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("User tidak ditemukan")
      }

      console.log('🚀 Starting avatar upload...')
      console.log('User ID:', user.id)
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      console.log('Generated filename:', fileName)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Allow overwrite
        })

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        
        // Provide specific error messages
        if (uploadError.message.includes('row-level security')) {
          throw new Error("Masalah keamanan storage. Silakan hubungi admin untuk setup policies.")
        } else if (uploadError.message.includes('mime type')) {
          throw new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.")
        } else if (uploadError.message.includes('file size')) {
          throw new Error("Ukuran file terlalu besar. Maksimal 2MB.")
        } else {
          throw uploadError
        }
      }

      console.log('✅ Upload successful:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl
      console.log('Public URL:', publicUrl)

      // Update user profile in database
      const { error: updateError } = await updateAvatar(publicUrl)

      if (updateError) {
        throw new Error(updateError)
      }

      // Call parent callback
      onAvatarUpdate(publicUrl)
      
      // Clear preview
      setPreviewUrl(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      console.log('🎉 Avatar update completed successfully')

    } catch (err: any) {
      console.error('❌ Upload error details:', err)
      setError(err.message || "Gagal mengupload foto. Silakan coba lagi.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={displayUrl} alt={userName} />
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 mr-2" />
              Pilih Foto
            </Button>

            {previewUrl && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP maksimal 2MB
          </p>
        </div>
      </div>
    </div>
  )
}
