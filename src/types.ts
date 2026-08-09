export interface User {
  id: number
  email: string
}

export interface Pg {
  id: number
  name: string
  city: string
  address: string
  created_at: string
}

export interface Review {
  id: number
  user_id: number
  pg_id: number
  rating: number
  deposit_returned: boolean
  comment: string | null
  created_at: string
}
