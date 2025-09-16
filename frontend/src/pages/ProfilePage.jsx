import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 w-full max-w-2xl p-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-300">Your profile information</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 border-yellow-400 shadow-md"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 
                bg-yellow-400 hover:bg-yellow-500 hover:scale-105
                p-2 rounded-full cursor-pointer shadow transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              <Camera className="w-5 h-5 text-red-700" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-300">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-red-900/50 rounded-lg border border-red-500 text-white">
              {authUser?.fullName}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-gray-200 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-red-900/50 rounded-lg border border-red-500 text-white">
              {authUser?.email}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-red-900/50 rounded-xl p-6 border border-red-500">
          <h2 className="text-lg font-medium text-yellow-400 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm text-gray-200">
            <div className="flex items-center justify-between py-2 border-b border-red-500">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
