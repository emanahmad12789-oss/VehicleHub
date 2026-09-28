import { Link, useLocation } from "react-router-dom";
import {
  CarFront,
  Heart,
  MessageCircle,
  UserCircle,
  LogIn,
  UserPlus,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Cars",
      path: "/cars",
    },
    {
      name: "Bikes",
      path: "/bikes",
    },
    {
      name: "Favorites",
      path: "/favorites",
      icon: <Heart size={16} />,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: <MessageCircle size={16} />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserCircle size={16} />,
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCF7] border-b border-[#D8CEC1] shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#26352D] text-[#F7F3EC] flex items-center justify-center">
              <CarFront size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#26352D] leading-none">
                Vehicle<span className="text-[#B86F52]">Hub</span>
              </h1>

              <p className="text-[10px] text-[#8A857B] mt-1">
                Vehicle Marketplace
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? "bg-[#E9E4DA] text-[#26352D]"
                    : "text-[#77736B] hover:bg-[#F7F3EC] hover:text-[#26352D]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-2">

            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#26352D] hover:bg-[#F7F3EC] transition"
            >
              <LogIn size={17} />
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <UserPlus size={17} />
              Register
            </Link>

            <Link
              to="/add-vehicle"
              className="flex items-center gap-2 bg-[#B86F52] hover:bg-[#A65F45] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <PlusCircle size={17} />
              Sell Vehicle
            </Link>

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-[#26352D] hover:bg-[#F7F3EC]"
          >
            {mobileOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#D8CEC1] py-4">

            <nav className="flex flex-col gap-1">

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? "bg-[#E9E4DA] text-[#26352D]"
                      : "text-[#77736B] hover:bg-[#F7F3EC]"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-[#D8CEC1] my-2" />

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#26352D] hover:bg-[#F7F3EC]"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#26352D] hover:bg-[#F7F3EC]"
              >
                <UserPlus size={17} />
                Register
              </Link>

              <Link
                to="/add-vehicle"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#B86F52] text-white px-4 py-3 rounded-lg text-sm font-medium mt-2"
              >
                <PlusCircle size={17} />
                Sell Vehicle
              </Link>

            </nav>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;