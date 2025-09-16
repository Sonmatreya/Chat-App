import { useAuthStore } from "../store/useAuthStore";
import { FileText } from "lucide-react";

const UserProfileSidebar = ({ media }) => {
  const { authUser, logout } = useAuthStore();

  return (
    <aside className="w-72 bg-black/30 backdrop-blur-md rounded-r-2xl border border-red-600 flex flex-col p-6 text-white">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-red-600">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="object-cover w-full h-full"
          />
          <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full ring-2 ring-black" />
        </div>
        <h2 className="text-xl font-semibold">{authUser?.fullName}</h2>
        <p className="text-sm text-red-300 text-center">
          {authUser?.status || "Available"}
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-lg font-medium mb-2">Media</h3>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {media && media.length > 0 ? (
            media.map((item, index) =>
              item.type === "image" ? (
                <img
                  key={index}
                  src={item.src}
                  alt={`Media ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ) : item.type === "pdf" ? (
                <a
                  key={index}
                  href={item.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-red-700 rounded-lg hover:bg-red-800 transition-colors"
                >
                  <FileText className="text-red-300" />
                  <span className="text-red-300 truncate">{item.name || `Document ${index + 1}`}</span>
                </a>
              ) : null
            )
          ) : (
            <p className="text-red-400">No media shared</p>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold z-10 relative"
        style={{ position: "sticky", bottom: "1rem" }}
      >
        Logout
      </button>
    </aside>
  );
};

export default UserProfileSidebar;
