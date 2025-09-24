import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [getUsers, authUser]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
<aside className="h-full w-20 lg:w-72 bg-black/30 backdrop-blur-md rounded-l-2xl border-r border-white/20 flex flex-col transition-all duration-200">
      <div className="border-b border-white/20 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-yellow-400" />
          <span className="font-medium hidden lg:block text-yellow-300">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-red-400">Show online only</span>
          </label>
          <span className="text-xs text-red-400">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-red-900 transition-colors
              ${selectedUser?._id === user._id ? "bg-red-900 ring-1 ring-red-900" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-black"
                />
              )}
              {/* Mobile notification badge */}
              {user.unreadCount > 0 && (
                <div className="lg:hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {user.unreadCount > 9 ? "9+" : user.unreadCount}
                </div>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate text-white">{user.fullName}</div>
              <div className="text-sm text-gray-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {/* Notification badge */}
            {user.unreadCount > 0 && (
              <div className="hidden lg:flex items-center justify-center min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                {user.unreadCount > 99 ? "99+" : user.unreadCount}
              </div>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-red-400 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
