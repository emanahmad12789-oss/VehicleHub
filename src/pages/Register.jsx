
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus } from "lucide-react";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      // Go to Login
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);

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

      <main className="max-w-md mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex bg-[#26352D] text-[#F7F3EC] p-4 rounded-xl">
            <UserPlus size={26} />
          </div>

          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">
            Create Account
          </h1>

          <p className="text-[#77736B] mt-2">
            Join VehicleHub and start buying or selling vehicles.
          </p>

        </div>

        {/* Card */}
        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Full Name
              </label>

              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">

                <User
                  size={18}
                  className="text-[#8A857B]"
                />

                <input
                  required
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none px-3 py-3"
                />

              </div>

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Email
              </label>

              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">

                <Mail
                  size={18}
                  className="text-[#8A857B]"
                />

                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none px-3 py-3"
                />

              </div>

            </div>

            {/* Phone */}
            <div>

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Mobile Number
              </label>

              <div className="flex items-center border border-[#D8CEC1] rounded-xl px-4 bg-[#F7F3EC]">

                <Phone
                  size={18}
                  className="text-[#8A857B]"
                />

                <input
                  required
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none px-3 py-3"
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
                  required
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none px-3 py-3"
                />

              </div>

            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#26352D] hover:bg-[#34483D] disabled:opacity-60 text-[#F7F3EC] py-3 rounded-xl font-medium transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-[#77736B]">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-[#B86F52] font-semibold"
              >
                Login
              </Link>

            </p>

          </form>

        </div>
      </main>
    </div>
  );
}

export default Register;

