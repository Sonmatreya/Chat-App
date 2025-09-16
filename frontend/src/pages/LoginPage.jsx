import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white">
      {/* Left Side - Hero Section */}
      <div className="flex flex-col justify-center items-center px-12 bg-red-900/40">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Connect with <span className="text-yellow-400">Friends</span>
          </h1>
          <p className="text-gray-200 text-lg">
            Stay updated and chat seamlessly anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 w-full max-w-md p-10 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-gray-300">Access your account securely</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-red-900/50 border border-red-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-red-900/50 border border-red-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-yellow-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-300">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
