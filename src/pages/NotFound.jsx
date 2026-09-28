import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CarFront,
  Search,
} from "lucide-react";

import Navbar from "../components/Navbar";

function NotFound() {

  return (
    <div className="min-h-screen bg-[#F7F3EC]">

      <Navbar />

      <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">

        <div className="text-center max-w-lg">

          <div className="w-24 h-24 mx-auto bg-[#E9E4DA] text-[#26352D] rounded-full flex items-center justify-center">

            <CarFront
              size={48}
              strokeWidth={1.4}
            />

          </div>

          <p className="text-[#B86F52] font-semibold tracking-[0.15em] uppercase text-sm mt-7">
            404 Error
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold text-[#26352D] mt-3">
            Page Not Found
          </h1>

          <p className="text-[#77736B] mt-4 leading-7">
            Sorry, the page you are looking for doesn't exist
            or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-6 py-3 rounded-xl font-medium"
            >
              <ArrowLeft size={17} />
              Back Home
            </Link>

            <Link
              to="/cars"
              className="inline-flex items-center justify-center gap-2 border border-[#D8CEC1] bg-[#FFFCF7] text-[#4A4943] px-6 py-3 rounded-xl font-medium hover:bg-white"
            >
              <Search size={17} />
              Browse Cars
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default NotFound;