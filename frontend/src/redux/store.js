import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chat/chatSlice";
import authReducer from "./auth/authSlice";
import socketMiddleware from "./socketMiddleware";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware), // ✅ FIXED `.concat()`
});

export default store;
