import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { BANNER_ENDPOINTS } from "@/lib/api/endpoints"
import { refreshAccessToken } from "./authSlice"

// ─── Types ───────────────────────────────────────────────
export type Banner = {
  _id: string
  displayOrder: number
  title: string
  description: string
  altText: string
  bannerImage: string
  createdAt: string
  updatedAt: string
}

type BannerState = {
  banners: Banner[]
  loading: boolean
  error: string | null
  creating: boolean
  updating: boolean
}

type BannerListResponse = {
  success: boolean
  message: string
  data: {
    banners: Banner[]
  }
}

type BannerSingleResponse = {
  success: boolean
  message: string
  data: {
    banner: Banner
  }
}

// ─── Helper ──────────────────────────────────────────────
const getAccessToken = () => Cookies.get("access_token") || null

// ─── Async Thunks ────────────────────────────────────────

/** GET /api/banners */
export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>("banner/fetchBanners", async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { accessToken: string | null } }
    let accessToken = state.auth.accessToken || getAccessToken()
    let res = await fetch(BANNER_ENDPOINTS.LIST, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

    if (res.status === 401) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshResult = await (dispatch as any)(refreshAccessToken())
      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        accessToken = refreshResult.payload.accessToken
        res = await fetch(BANNER_ENDPOINTS.LIST, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } else {
        return rejectWithValue("Session expired. Please log in again.")
      }
    }

    const json: BannerListResponse = await res.json()
    if (!res.ok || !json.success) {
      return rejectWithValue(json.message ?? "Failed to fetch banners.")
    }
    return json.data.banners
  } catch {
    return rejectWithValue("Network error. Could not fetch banners.")
  }
})

/** POST /api/banners (FormData with image file) */
export const createBanner = createAsyncThunk<
  Banner,
  FormData,
  { rejectValue: string }
>("banner/createBanner", async (formData, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { accessToken: string | null } }
    let accessToken = state.auth.accessToken || getAccessToken()
    let res = await fetch(BANNER_ENDPOINTS.CREATE, {
      method: "POST",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: formData,
    })

    if (res.status === 401) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshResult = await (dispatch as any)(refreshAccessToken())
      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        accessToken = refreshResult.payload.accessToken
        res = await fetch(BANNER_ENDPOINTS.CREATE, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        })
      } else {
        return rejectWithValue("Session expired. Please log in again.")
      }
    }

    const json: BannerSingleResponse = await res.json()
    if (!res.ok || !json.success) {
      return rejectWithValue(json.message ?? "Failed to create banner.")
    }
    return json.data.banner
  } catch {
    return rejectWithValue("Network error. Could not create banner.")
  }
})

/** PUT /api/banners/:id (FormData with optional image file) */
export const updateBanner = createAsyncThunk<
  Banner,
  { id: string; formData: FormData },
  { rejectValue: string }
>("banner/updateBanner", async ({ id, formData }, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { accessToken: string | null } }
    let accessToken = state.auth.accessToken || getAccessToken()
    let res = await fetch(BANNER_ENDPOINTS.UPDATE(id), {
      method: "PUT",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: formData,
    })

    if (res.status === 401) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const refreshResult = await (dispatch as any)(refreshAccessToken())
      if (refreshAccessToken.fulfilled.match(refreshResult)) {
        accessToken = refreshResult.payload.accessToken
        res = await fetch(BANNER_ENDPOINTS.UPDATE(id), {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        })
      } else {
        return rejectWithValue("Session expired. Please log in again.")
      }
    }

    const json: BannerSingleResponse = await res.json()
    if (!res.ok || !json.success) {
      return rejectWithValue(json.message ?? "Failed to update banner.")
    }
    return json.data.banner
  } catch {
    return rejectWithValue("Network error. Could not update banner.")
  }
})

// ─── Initial State ───────────────────────────────────────
const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
}

// ─── Slice ───────────────────────────────────────────────
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    clearBannerError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // fetchBanners
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false
        state.banners = action.payload
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? "Failed to fetch banners."
      })

    // createBanner
    builder
      .addCase(createBanner.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.creating = false
        state.banners.unshift(action.payload)
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload ?? "Failed to create banner."
      })

    // updateBanner
    builder
      .addCase(updateBanner.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.updating = false
        const idx = state.banners.findIndex((b) => b._id === action.payload._id)
        if (idx !== -1) state.banners[idx] = action.payload
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload ?? "Failed to update banner."
      })
  },
})

export const { clearBannerError } = bannerSlice.actions
export default bannerSlice.reducer
