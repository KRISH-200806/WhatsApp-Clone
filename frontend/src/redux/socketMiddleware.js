import { setTypingStatus } from "./chat/chatSlice";

 const socketMiddleware = (store) => (next) => (action) => {
  const socket = store.getState().auth.socket;

  if (socket) {
    if (action.type === "chat/setTypingStatus") {
      socket.emit("usertyping", {
        senderId: store.getState().auth.authUser._id,
        receiverId: store.getState().chat.selectedUser._id,
        isTyping: action.payload,
      });
    }

    socket.on("newMessage", (newMessage) => {
      store.dispatch({
        type: "chat/getMessages/fulfilled",
        payload: [...store.getState().chat.messages, newMessage],
      });
    });

    socket.on("ShowTyping", ({ senderId, isTyping }) => {
      if (store.getState().chat.selectedUser?._id === senderId) {
        store.dispatch(setTypingStatus(isTyping));
      }
    });
  }

  return next(action);
};

export default socketMiddleware