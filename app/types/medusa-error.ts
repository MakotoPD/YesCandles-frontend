// types/medusa-error.ts
export interface MedusaError extends Error {
    status?: number
    statusCode?: number
    code?: string
    type?: string
    message: string
    data?: any
  }
  
  export interface MedusaResponse<T = any> {
    data?: T
    error?: MedusaError
    success?: boolean
    message?: string
  }
  
  export interface CustomerResponse {
    customer: {
      id: string
      email: string
      first_name?: string
      last_name?: string
      phone?: string
      date_of_birth?: string | Date
      created_at: string | Date
      updated_at: string | Date
      email_verified?: boolean
      has_account?: boolean
      metadata?: Record<string, any>
    } | null
  }