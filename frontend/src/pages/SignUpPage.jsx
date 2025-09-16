import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white">
      {/* Left Side - Hero Section */}
      <div className="flex flex-col justify-center items-center px-12 bg-red-900/40">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Join the <span className="text-yellow-400">Community</span>
          </h1>
          <p className="text-gray-200 text-lg">
            Create your account and start chatting with friends instantly.
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 w-full max-w-md p-10 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-300">Sign up to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-red-900/50 border border-red-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-red-900/50 border border-red-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
