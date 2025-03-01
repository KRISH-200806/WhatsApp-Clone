import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NochatSelect";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser); // Get selectedUser from Redux

  return (
    <div className="h-screen bg-base-200 w-full">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-10xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
