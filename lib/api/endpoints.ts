const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"

// ─── Auth Endpoints ──────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  PROFILE: `${BASE_URL}/api/auth/profile`,
  REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh-token`,
  SESSIONS: `${BASE_URL}/api/auth/sessions`,
  UPLOAD_PROFILE_IMAGE: `${BASE_URL}/api/auth/upload-profile-image`,
} as const

// ─── Banner Endpoints ────────────────────────────────────
export const BANNER_ENDPOINTS = {
  LIST: `${BASE_URL}/api/banners`,
  CREATE: `${BASE_URL}/api/banners`,
  UPDATE: (id: string) => `${BASE_URL}/api/banners/${id}`,
  GET: (id: string) => `${BASE_URL}/api/banners/${id}`,
  DELETE: (id: string) => `${BASE_URL}/api/banners/${id}`,
} as const

export { BASE_URL }
