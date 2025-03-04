import { setTypingStatus } from "./chat/chatSlice";

const socketMiddleware = (store) => (next) => (action) => {
  const socket = store.getState().auth.socket;
  const state = store.getState().chat;

  if (socket) {
    // Send typing event when user is typing
    if (action.type === "chat/setTypingStatus") {
      socket.emit("usertyping", {
        senderId: store.getState().auth.authUser._id,
        receiverId: store.getState().chat.selectedUser._id,
        isTyping: action.payload,
      });
    }

    // Listen for new messages and avoid duplicates
    socket.on("newMessage", (newMessage) => {
      const isDuplicate = state.messages.some(
        (msg) => msg._id === newMessage._id
      );

      if (!isDuplicate) {
        store.dispatch({
          type: "chat/getMessages/fulfilled",
          payload: [...state.messages, newMessage],
        });
      }
    });

    // Handle typing status updates
    socket.on("ShowTyping", ({ senderId, isTyping }) => {
      if (store.getState().chat.selectedUser?._id === senderId) {
        store.dispatch(setTypingStatus(isTyping));
      }
    });
  }

  return next(action);
};

export default socketMiddleware;
