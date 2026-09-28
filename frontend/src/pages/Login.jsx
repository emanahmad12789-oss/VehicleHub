import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarFront, Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save logged-in user
      if (data.user) {
        localStorage.setItem(
          "vehicleHubLoggedIn",
          JSON.stringify(data.user)
        );
      }

      // Save token only if backend provides one
      if (data.token) {
        localStorage.setItem(
          "vehicleHubToken",
          data.token
        );
      }

      // Login successful
      navigate("/profile", {
        replace: true,
      });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Cannot connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex bg-[#26352D] text-[#F7F3EC] p-3 rounded-xl">
            <CarFront size={25} />
          </div>

          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">
            Welcome Back
          </h1>

          <p className="text-[#77736B] mt-2">
            Login to your VehicleHub account
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Email Address
              </label>

              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">

                <Mail
                  size={18}
                  className="text-[#8A857B]"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="w-full bg-transparent outline-none px-3 py-3 text-[#292724]"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Password
              </label>

              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">

                <Lock
                  size={18}
                  className="text-[#8A857B]"
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full bg-transparent outline-none px-3 py-3 text-[#292724]"
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">
                {error}
              </p>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="text-sm text-[#B86F52] hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#26352D] hover:bg-[#34483D] disabled:opacity-60 text-[#F7F3EC] py-3 rounded-xl font-medium transition"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6 text-sm text-[#77736B]">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-[#B86F52] font-semibold hover:underline"
            >
              Create Account
            </Link>

          </div>

        </div>

        {/* Back */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm text-[#77736B] mt-6 hover:text-[#B86F52]"
        >
          Back to VehicleHub
          <ArrowRight size={15} />
        </Link>

      </main>
    </div>
  );
}

export default Login;