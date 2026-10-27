import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import Navbar from "../components/Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16">

        <div className="text-center mb-8">

          <div className="inline-flex bg-[#26352D] text-[#F7F3EC] p-4 rounded-xl">
            <Mail size={25} />
          </div>

          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">
            Forgot Password?
          </h1>

          <p className="text-[#77736B] mt-2">
            Enter your email and we'll help you reset your password.
          </p>

        </div>

        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">

          {submitted ? (

            <div className="text-center py-5">

              <div className="w-16 h-16 mx-auto bg-[#E9E4DA] text-[#26352D] rounded-full flex items-center justify-center">
                <CheckCircle size={32} />
              </div>

              <h2 className="text-xl font-semibold text-[#26352D] mt-5">
                Check Your Email
              </h2>

              <p className="text-[#77736B] mt-3 leading-6">
                If an account exists with this email, a password
                reset link will be sent to you.
              </p>

              <Link
                to="/login"
                className="inline-block bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-7 py-3 rounded-xl font-medium mt-6"
              >
                Back to Login
              </Link>

            </div>

          ) : (

            <form onSubmit={handleSubmit}>

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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent outline-none px-3 py-3 text-[#292724]"
                />

              </div>

              <button
                type="submit"
                className="w-full bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] py-3 rounded-xl font-medium mt-6 transition"
              >
                Send Reset Link
              </button>

            </form>

          )}

        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-[#77736B] mt-6 hover:text-[#B86F52]"
        >
          <ArrowLeft size={15} />
          Back to Login
        </Link>

      </main>
    </div>
  );
}

export default ForgotPassword;