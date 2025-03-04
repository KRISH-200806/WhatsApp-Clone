import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";


// Async Thunks
export const getUsers = createAsyncThunk("chat/getUsers", async () => {
  try {
    const res = await axiosInstance.get("/message/users");
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
});

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (userId) => {
    try {
      const res = await axiosInstance.get(`/message/get/${userId}`);
     
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { getState }) => {
    try {
      const { selectedUser } = getState().chat;
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      return res.data; // केवल नया संदेश ही रिटर्न करें
    } catch (error) {
      toast.error(error.response?.data?.message || "Message sending failed");
      throw error;
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isTyping: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setTypingStatus: (state, action) => {
      state.isTyping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isUsersLoading = false;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isMessagesLoading = false;
      })
       .addCase(sendMessage.fulfilled, (state, action) => {
         state.messages.push(action.payload); // सीधे नया message जोड़ें
       });
  },
});

export const { setSelectedUser, setTypingStatus } = chatSlice.actions;
export default chatSlice.reducer;
