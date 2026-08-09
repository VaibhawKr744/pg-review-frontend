import axios from 'axios'
import type { Pg, Review, User } from '../types'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://fastapibackend-gksx.onrender.com'

const TOKEN_KEY = 'pg_review_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---- Auth ----

export async function signup(email: string, password: string): Promise<User> {
  const res = await api.post<User>('/auth/signup', { email, password })
  return res.data
}

// OAuth2 password flow: form-encoded, field is `username` even though it's an email
export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams({ username: email, password })
  const res = await api.post<{ access_token: string }>('/auth/login', body)
  return res.data.access_token
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me')
  return res.data
}

// ---- PGs ----

export async function listPgs(city?: string): Promise<Pg[]> {
  const res = await api.get<Pg[]>('/pgs/', {
    params: city ? { city } : undefined,
  })
  return res.data
}

export async function getPg(id: number | string): Promise<Pg> {
  const res = await api.get<Pg>(`/pgs/${id}`)
  return res.data
}

export async function createPg(data: {
  name: string
  city: string
  address: string
}): Promise<Pg> {
  const res = await api.post<Pg>('/pgs/', data)
  return res.data
}

// ---- Reviews ----

export async function listReviews(pgId: number | string): Promise<Review[]> {
  const res = await api.get<Review[]>(`/pgs/${pgId}/reviews/`)
  return res.data
}

export async function createReview(
  pgId: number | string,
  data: { rating: number; deposit_returned: boolean; comment?: string },
): Promise<Review> {
  const res = await api.post<Review>(`/pgs/${pgId}/reviews/`, data)
  return res.data
}

// ---- Error helper ----

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return 'Could not reach the server. Free-tier hosting can take ~30-50s to wake up — try again in a moment.'
    }
    const detail = err.response.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      // FastAPI 422 validation errors
      return detail
        .map((d: { msg?: string }) => d.msg ?? 'Invalid input')
        .join('; ')
    }
    return `Request failed (${err.response.status})`
  }
  return 'Something went wrong'
}
