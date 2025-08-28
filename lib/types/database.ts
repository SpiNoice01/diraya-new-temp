export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          address: string
          role: 'customer' | 'admin'
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          address: string
          role?: 'customer' | 'admin'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          address?: string
          role?: 'customer' | 'admin'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          servings: number
          features: string[]
          is_popular: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          servings: number
          features: string[]
          is_popular?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          servings?: number
          features?: string[]
          is_popular?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          event_date: string
          event_time: string
          total_amount: number
          status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          event_date: string
          event_time: string
          total_amount: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          event_date?: string
          event_time?: string
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          amount: number
          payment_method: string
          status: 'pending' | 'completed' | 'failed'
          transaction_id?: string
          payment_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          amount: number
          payment_method: string
          status?: 'pending' | 'completed' | 'failed'
          transaction_id?: string
          payment_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          amount?: number
          payment_method?: string
          status?: 'pending' | 'completed' | 'failed'
          transaction_id?: string
          payment_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
