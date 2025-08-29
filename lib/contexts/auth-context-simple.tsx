'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User as AppUser } from '@/lib/types/database'

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AppUser>) => Promise<{ error: string | null }>
  updateAvatar: (avatarUrl: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing...')
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log('✅ Session found, user ID:', session.user.id)
          await fetchUserProfile(session.user.id)
        } else {
          console.log('ℹ️ No session found')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      console.log('🔐 AuthProvider: Cleaning up subscription')
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('📥 Fetching user profile for ID:', userId)
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('⚠️ Database query error:', error)
        
        // If user not found, create a basic profile
        if (error.code === 'PGRST116') {
          console.log('📝 User not found, creating basic profile...')
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            const basicUser: AppUser = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.email?.split('@')[0] || 'User',
              phone: '',
              address: '',
              role: 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            const { error: insertError } = await supabase
              .from('users')
              .insert(basicUser)
            
            if (!insertError) {
              console.log('✅ Basic profile created successfully')
              setUser(basicUser)
              return
            } else {
              console.warn('⚠️ Failed to create basic profile:', insertError)
            }
          }
        }
        
        // Fallback: create temporary user object
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const tempUser: AppUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.email?.split('@')[0] || 'User',
            phone: '',
            address: '',
            role: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          console.log('🔄 Using temporary user object')
          setUser(tempUser)
        }
        return
      }
      
      console.log('✅ User profile fetched successfully:', data)
      setUser(data)
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      
      // Fallback: create temporary user object
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const tempUser: AppUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.email?.split('@')[0] || 'User',
          phone: '',
          address: '',
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        console.log('🔄 Using fallback user object')
        setUser(tempUser)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email)
      
      // Validate input
      if (!email || !password) {
        return { error: 'Email dan password harus diisi' }
      }

      // Check if email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { error: 'Format email tidak valid' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        console.error('❌ Supabase auth signIn error:', error)
        
        // Handle specific error cases
        if (error.message === 'Invalid login credentials') {
          return { error: 'Email atau password salah. Silakan cek kembali.' }
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'Email belum dikonfirmasi. Periksa inbox email Anda.' }
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          return { error: 'Gagal terhubung ke server. Periksa koneksi internet Anda.' }
        } else {
          return { error: error.message || 'Terjadi kesalahan saat login' }
        }
      }

      if (data.user) {
        console.log('✅ Sign in successful, user ID:', data.user.id)
        // User profile will be fetched automatically by useEffect
      }

      return { error: null }
    } catch (error: any) {
      console.error('❌ SignIn error details:', error)
      return { error: 'Terjadi kesalahan tidak terduga. Silakan coba lagi.' }
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('📝 Starting signUp process for email:', email)
      
      // Create user in Supabase Auth
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('❌ Supabase auth signUp error:', error)
        throw error
      }

      if (user) {
        console.log('✅ User created in auth, ID:', user.id)
        
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
            role: userData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          console.warn('⚠️ Profile creation failed, but user can still login')
        } else {
          console.log('✅ User profile created successfully')
        }
      }

      return { error: null }
    } catch (error: any) {
      console.error('❌ SignUp error details:', error)
      let errorMessage = 'Terjadi kesalahan saat mendaftar'
      
      if (error.message) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
        } else if (error.message.includes('already registered')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Format email tidak valid.'
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password terlalu lemah. Minimal 6 karakter.'
        } else {
          errorMessage = error.message
        }
      }
      
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('❌ SignOut error:', error)
    }
  }

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return { error: 'No user logged in' }

    try {
      console.log('📝 Updating profile...')
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null)
      console.log('✅ Profile updated successfully')

      return { error: null }
    } catch (error: any) {
      console.error('❌ Update profile error:', error)
      return { error: error.message }
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return { error: 'No user logged in' }

    try {
      console.log('🖼️ Updating avatar...')
      const { error } = await supabase
        .from('users')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, avatar_url: avatarUrl } : null)
      console.log('✅ Avatar updated successfully')

      return { error: null }
    } catch (error: any) {
      console.error('❌ Update avatar error:', error)
      return { error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateAvatar,
  }

  console.log('🔐 AuthProvider: Current state - loading:', loading, 'user:', user?.email)

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
