import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarFront, Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

// Keep login on the same origin as the rest of VehicleHub.
// The root Vercel deployment serves both frontend and /api routes.
const API_URL = "/api";

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok || data.success === false) {
        setError(data.message || `Login failed (HTTP ${response.status}). Please try again.`);
        return;
      }

      if (!data.token || !data.user) {
        setError("The server response is incomplete. Please check the backend deployment.");
        return;
      }

      localStorage.setItem("vehicleHubLoggedIn", JSON.stringify(data.user));
      localStorage.setItem("vehicleHubUser", JSON.stringify(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.email) {
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("email", data.user.email);
      }
      localStorage.setItem("vehicleHubToken", data.token);

      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not reach VehicleHub API. Check that this deployment includes the /api backend and that its deployment is Ready.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex bg-[#26352D] text-[#F7F3EC] p-3 rounded-xl">
            <CarFront size={25} />
          </div>
          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">Welcome Back</h1>
          <p className="text-[#77736B] mt-2">Login to your VehicleHub account</p>
        </div>

        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4A4943] mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">
                <Mail size={18} className="text-[#8A857B]" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full bg-transparent outline-none px-3 py-3 text-[#292724]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4A4943] mb-2">
                Password
              </label>
              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">
                <Lock size={18} className="text-[#8A857B]" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full bg-transparent outline-none px-3 py-3 text-[#292724]"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-sm text-center break-words">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-[#B86F52] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#26352D] hover:bg-[#34483D] disabled:opacity-60 text-[#F7F3EC] py-3 rounded-xl font-medium transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-[#77736B]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#B86F52] font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </div>

        <Link to="/" className="flex items-center justify-center gap-2 text-sm text-[#77736B] mt-6 hover:text-[#B86F52]">
          Back to VehicleHub
          <ArrowRight size={15} />
        </Link>
      </main>
    </div>
  );
}

export default Login;
