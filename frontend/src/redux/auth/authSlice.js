import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
 
const BASE_URL = "http://localhost:5050";


export const checkAuth = createAsyncThunk("auth/checkAuth",
  async (_, { dispatch }) => {
    try {
      const res = await axiosInstance.get("/user/check");
      dispatch(checkAuth(res.data._id));
      
      return res.data._id;
    } catch (error) {
      console.error("Error in checkAuth:", error);
      return null;
    }
  }
);

export const signup = createAsyncThunk("auth/signup",
  async (data, { dispatch }) => {
    try {
      const res = await axiosInstance.post("/user/signup", data);
      toast.success("Account created successfully");
      dispatch(connectSocket(res.data._id));
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { dispatch }) => {
    try {
      const res = await axiosInstance.post("/user/login", data);
      toast.success("Logged in successfully");
      dispatch(connectSocket(res.data._id));
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await axiosInstance.post("/user/logout");
      toast.success("Logged out successfully");
      dispatch(disconnectSocket());
      return null;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data) => {
    try {
      const res = await axiosInstance.put("/user/updateprofile", data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
  },
  reducers: {
    connectSocket: (state, action) => {
      if (!action.payload || state.socket?.connected) return;

      const socket = io(BASE_URL, { query: { userId: action.payload } });
      state.socket = socket;
      socket.on("getOlineUsers", (userIds) => {
        console.log("dsd",userIds);
        state.onlineUsers = userIds;
      });

    
    },
    disconnectSocket: (state) => {
      state.socket?.disconnect();
      state.socket = null;
    },
  },
  extraReducers: (builder) => {
      builder
        .addCase(checkAuth.fulfilled, (state, action) => {
          state.authUser = action.payload;
          state.isCheckingAuth = false;
        })
        .addCase(checkAuth.rejected, (state) => {
          (state.authUser = null), (state.isCheckingAuth = false);
        })
        .addCase(signup.fulfilled, (state, action) => {
          state.authUser = action.payload;
          state.isSigningUp = false;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.authUser = action.payload;
          state.isLoggingIn = false;
        })
        .addCase(logout.fulfilled, (state) => {
          state.authUser = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
          state.authUser = action.payload;
          state.isUpdatingProfile = false;
        });
  },
});

export default authSlice.reducer;
export const { connectSocket, disconnectSocket } = authSlice.actions;
