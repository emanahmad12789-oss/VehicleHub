function Footer() {
  return (
    <footer className="bg-[#202A24] text-[#F7F3EC] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* VEHICLEHUB */}
          <div>
            <h2 className="text-2xl font-semibold">
              VehicleHub
            </h2>

            <p className="text-[#AAAFA9] mt-4 leading-7">
              Your trusted vehicle marketplace for buying,
              selling and exploring vehicles.
            </p>
          </div>

          {/* MY INFORMATION */}
          <div>
            <h3 className="text-lg font-semibold">
              My Information
            </h3>

            <div className="mt-4 space-y-3 text-[#AAAFA9]">

              <p>
                <span className="text-[#F7F3EC] font-medium">
                  Name:
                </span>{" "}
                Eman Ahmad
              </p>

              <p>
                <span className="text-[#F7F3EC] font-medium">
                  Email:
                </span>{" "}
                emanahmad@gmail.com
              </p>

              <p>
                <span className="text-[#F7F3EC] font-medium">
                  Program:
                </span>{" "}
                BS Computer Science
              </p>

              <p>
                <span className="text-[#F7F3EC] font-medium">
                  Project:
                </span>{" "}
                VehicleHub
              </p>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 mt-4">

              <a
                href="/"
                className="text-[#AAAFA9] hover:text-white transition"
              >
                Home
              </a>

              <a
                href="/cars"
                className="text-[#AAAFA9] hover:text-white transition"
              >
                Cars
              </a>

              <a
                href="/bikes"
                className="text-[#AAAFA9] hover:text-white transition"
              >
                Bikes
              </a>

              <a
                href="/favorites"
                className="text-[#AAAFA9] hover:text-white transition"
              >
                Favorites
              </a>

              <a
                href="/messages"
                className="text-[#AAAFA9] hover:text-white transition"
              >
                Messages
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-[#3A443E] mt-10 pt-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-3">

            <p className="text-sm text-[#AAAFA9]">
              © {new Date().getFullYear()} VehicleHub.
              All rights reserved.
            </p>

            <p className="text-sm text-[#AAAFA9]">
              Designed & Developed by{" "}
              <span className="text-[#F7F3EC] font-semibold">
                Eman Ahmad
              </span>
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;