import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import bannerReducer from "./bannerSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    banner: bannerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
