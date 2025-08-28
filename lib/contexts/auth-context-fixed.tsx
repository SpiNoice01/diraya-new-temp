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
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUser(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<AppUser, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Starting signUp process for email:', email)
      
      // Test Supabase connection first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('Session check error:', sessionError)
        throw new Error(`Connection error: ${sessionError.message}`)
      }
      
      console.log('Supabase connection OK, proceeding with signUp')
      
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
            ...userData,
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
      
      // Provide more specific error messages
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
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
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
