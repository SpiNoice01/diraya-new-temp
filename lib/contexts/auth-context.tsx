'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { User as AppUser } from '@/lib/types/database'

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AppUser>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000) // 10 second timeout
      })
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw sessionError
      }
      
      console.log('Current session user ID:', session?.user?.id)
      console.log('Requested user ID:', userId)
      console.log('IDs match:', session?.user?.id === userId)
      
      // Race between query and timeout
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      if (error) {
        console.error('Database query error:', error)
        console.log('Error code:', error.code)
        console.log('Error message:', error.message)
        console.log('Error details:', error.details)
        
        // If it's a timeout or RLS issue, try without RLS check
        if (error.message?.includes('timeout') || error.code === 'PGRST116') {
          console.log('Trying fallback query...')
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session?.user?.email)
            .single()
            
          if (!fallbackError && fallbackData) {
            console.log('Fallback query successful:', fallbackData)
            setUser(fallbackData)
            return
          }
        }
        
        throw error
      }
      
      console.log('User profile fetched successfully:', data)
      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Don't set user to null immediately, let login continue
      console.log('Login can continue without profile, will retry later')
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase auth signIn error:', error)
        throw error
      }

      if (data.user) {
        console.log('Sign in successful, user ID:', data.user.id)
        // User profile will be fetched automatically by useEffect
      }

      return { error: null }
    } catch (error: any) {
      console.error('SignIn error details:', error)
      let errorMessage = 'Terjadi kesalahan saat login'
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Periksa inbox email Anda.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
        } else {
          errorMessage = error.message
        }
      }
      
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Starting signUp process for email:', email)
      
      // Create user in Supabase Auth
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Supabase auth signUp error:', error)
        throw error
      }

      if (user) {
        console.log('User created in auth, ID:', user.id)
        
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
          console.error('Profile creation error:', profileError)
          throw profileError
        }
        
        console.log('User profile created successfully')
      }

      return { error: null }
    } catch (error: any) {
      console.error('SignUp error details:', error)
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
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return { error: 'No user logged in' }

    try {
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

      return { error: null }
    } catch (error: any) {
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
  }

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
