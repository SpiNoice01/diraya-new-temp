import MidtransClient from 'midtrans-client'

// Validate environment variables
const serverKey = process.env.MIDTRANS_SERVER_KEY
const clientKey = process.env.MIDTRANS_CLIENT_KEY || process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
const environment = process.env.MIDTRANS_ENVIRONMENT || 'sandbox'

if (!serverKey) {
  throw new Error('MIDTRANS_SERVER_KEY is required')
}

if (!clientKey) {
  throw new Error('MIDTRANS_CLIENT_KEY is required')
}

// Initialize Midtrans Core API
export const coreApi = new MidtransClient.CoreApi({
  isProduction: environment === 'production',
  serverKey: serverKey,
  clientKey: clientKey,
})

// Initialize Midtrans Snap API
export const snap = new MidtransClient.Snap({
  isProduction: environment === 'production',
  serverKey: serverKey,
  clientKey: clientKey,
})

// Midtrans configuration
export const midtransConfig = {
  serverKey,
  clientKey,
  environment,
  isProduction: environment === 'production',
  snapUrl: environment === 'production' 
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
}

// Export types for TypeScript
export interface MidtransTransaction {
  order_id: string
  gross_amount: number
}

export interface MidtransCustomer {
  first_name: string
  last_name?: string
  email: string
  phone: string
}

export interface MidtransItem {
  id: string
  price: number
  quantity: number
  name: string
  category?: string
}

export interface MidtransParameter {
  transaction_details: MidtransTransaction
  customer_details: MidtransCustomer
  item_details: MidtransItem[]
  credit_card?: {
    secure: boolean
  }
  callbacks?: {
    finish: string
    unfinish: string
    error: string
  }
}

export interface MidtransNotification {
  transaction_time: string
  transaction_status: string
  transaction_id: string
  status_message: string
  status_code: string
  signature_key: string
  settlement_time?: string
  payment_type: string
  order_id: string
  merchant_id: string
  gross_amount: string
  fraud_status: string
  currency: string
}

