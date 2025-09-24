import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import UserProfileSidebar from "../components/UserProfileSidebar";

const HomePage = () => {
  const { messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <div>Please log in to access this page.</div>;
  }

  const media = messages
    .filter((msg) => msg.image || msg.pdf)
    .map((msg, index) => {
      if (msg.image) {
        return { type: "image", src: msg.image, key: `image-${index}` };
      } else if (msg.pdf) {
        return { type: "pdf", src: msg.pdf, name: `Document ${index + 1}`, key: `pdf-${index}` };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="h-screen bg-gradient-to-r from-red-800 via-red-700 to-red-600">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-2xl">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer className="h-full" />}

            {selectedUser && <UserProfileSidebar media={media} className="h-full" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
