import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CarFront,
  Bike,
  ShieldCheck,
  Users,
  BadgeCheck,
  ArrowRight,
  MapPin,
  Gauge,
  CalendarDays,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Vehicles");

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // GET VEHICLES
  // ============================
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/vehicles"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setVehicles(data);
        } else if (Array.isArray(data.vehicles)) {
          setVehicles(data.vehicles);
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error("Vehicle loading error:", err);

        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // ============================
  // VEHICLE TITLE
  // ============================
  const getVehicleTitle = (vehicle) => {
    return (
      vehicle.title ||
      vehicle.name ||
      `${vehicle.make || vehicle.brand || ""} ${
        vehicle.model || ""
      }`.trim() ||
      "Vehicle"
    );
  };

  // ============================
  // VEHICLE TYPE
  // ============================
  const getVehicleType = (vehicle) => {
    return vehicle.type || vehicle.category || "Vehicle";
  };

  // ============================
  // LOCATION
  // ============================
  const getVehicleLocation = (vehicle) => {
    return vehicle.location || vehicle.city || "Pakistan";
  };

  // ============================
  // VEHICLE IMAGE
  // ============================
  const getVehicleImage = (vehicle) => {
    let image = null;

    if (vehicle.image) {
      image = vehicle.image;
    } else if (
      vehicle.imageUrl
    ) {
      image = vehicle.imageUrl;
    } else if (
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      image = vehicle.images[0];
    }

    if (!image) {
      return null;
    }

    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    return image;
  };

  // ============================
  // SEARCH + CATEGORY
  // ============================
  const filteredVehicles = vehicles.filter((vehicle) => {
    const title = getVehicleTitle(vehicle).toLowerCase();
    const type = getVehicleType(vehicle).toLowerCase();
    const location = getVehicleLocation(vehicle).toLowerCase();

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(search) ||
      type.includes(search) ||
      location.includes(search);

    const matchesCategory =
      category === "All Vehicles" ||
      type === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ============================
  // SEARCH BUTTON
  // ============================
  const handleSearch = (e) => {
    e.preventDefault();

    const resultsSection =
      document.getElementById("featured-vehicles");

    if (resultsSection) {
      resultsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#292724]">

      <Navbar />

      {/* ============================
          HERO SECTION
      ============================ */}
      <section className="bg-[#F7F3EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-[#E9E4DA] text-[#7C8C7A] px-4 py-2 rounded-full text-xs font-semibold tracking-wide">
              <BadgeCheck size={16} />
              A BETTER WAY TO BUY & SELL
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#26352D] mt-7 leading-tight">
              Find a vehicle
              <br />
              <span className="text-[#B86F52]">
                worth driving.
              </span>
            </h1>

            <p className="text-[#6D6A62] text-base md:text-lg max-w-2xl mx-auto mt-6 leading-7">
              Discover carefully listed cars and bikes from sellers
              across Pakistan.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-2 mt-10 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-2">

                <div className="flex-1 flex items-center px-4">

                  <Search
                    size={20}
                    className="text-[#7C8C7A] mr-3"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search by make, model or keyword"
                    className="w-full py-3 bg-transparent outline-none text-[#292724] placeholder:text-[#AAA298]"
                  />

                </div>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl px-4 py-3 text-[#4A4943] outline-none"
                >
                  <option>All Vehicles</option>
                  <option>Car</option>
                  <option>Bike</option>
                </select>

                <button
                  type="submit"
                  className="bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-8 py-3 rounded-xl font-medium transition"
                >
                  Search
                </button>

              </div>
            </form>

          </div>
        </div>
      </section>

      {/* ============================
          CATEGORIES
      ============================ */}
      <section className="bg-[#FFFCF7] py-20 border-y border-[#D8CEC1]">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">
              Explore
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-3">
              What are you looking for?
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-7">

            {/* CARS */}
            <Link
              to="/cars"
              className="group bg-[#F7F3EC] border border-[#D8CEC1] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >

              <div className="flex justify-between items-start">

                <div className="bg-[#26352D] text-[#F7F3EC] p-4 rounded-xl">
                  <CarFront
                    size={32}
                    strokeWidth={1.7}
                  />
                </div>

                <ArrowRight
                  size={21}
                  className="text-[#9A9287] group-hover:text-[#B86F52] group-hover:translate-x-1 transition"
                />

              </div>

              <h3 className="text-2xl font-semibold text-[#26352D] mt-8">
                Cars
              </h3>

              <p className="text-[#77736B] mt-2 leading-6">
                Explore new and used cars from trusted sellers.
              </p>

              <p className="text-[#B86F52] text-sm font-semibold mt-5">
                Explore Cars →
              </p>

            </Link>

            {/* BIKES */}
            <Link
              to="/bikes"
              className="group bg-[#F7F3EC] border border-[#D8CEC1] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >

              <div className="flex justify-between items-start">

                <div className="bg-[#26352D] text-[#F7F3EC] p-4 rounded-xl">
                  <Bike
                    size={32}
                    strokeWidth={1.7}
                  />
                </div>

                <ArrowRight
                  size={21}
                  className="text-[#9A9287] group-hover:text-[#B86F52] group-hover:translate-x-1 transition"
                />

              </div>

              <h3 className="text-2xl font-semibold text-[#26352D] mt-8">
                Bikes
              </h3>

              <p className="text-[#77736B] mt-2 leading-6">
                Find motorcycles from sellers across Pakistan.
              </p>

              <p className="text-[#B86F52] text-sm font-semibold mt-5">
                Explore Bikes →
              </p>

            </Link>

          </div>
        </div>
      </section>

      {/* ============================
          FEATURED VEHICLES
      ============================ */}
      <section
        id="featured-vehicles"
        className="bg-[#F7F3EC] py-20"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-end mb-10">

            <div>

              <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">
                {searchTerm ||
                category !== "All Vehicles"
                  ? "Search Results"
                  : "Featured"}
              </p>

              <h2 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-2">
                {searchTerm ||
                category !== "All Vehicles"
                  ? `${filteredVehicles.length} Vehicles Found`
                  : "Recently Added"}
              </h2>

            </div>

            <Link
              to="/cars"
              className="hidden sm:flex items-center gap-2 text-[#B86F52] font-semibold text-sm"
            >
              View All
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-12 text-center">

              <div className="w-10 h-10 border-4 border-[#D8CEC1] border-t-[#26352D] rounded-full animate-spin mx-auto"></div>

              <h3 className="text-xl font-semibold text-[#26352D] mt-5">
                Loading vehicles...
              </h3>

              <p className="text-[#77736B] mt-2">
                Getting the latest listings.
              </p>

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="bg-[#FFFCF7] border border-red-200 rounded-2xl p-12 text-center">

              <h3 className="text-xl font-semibold text-red-600">
                Unable to load vehicles
              </h3>

              <p className="text-[#77736B] mt-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-[#26352D] text-white px-6 py-3 rounded-xl"
              >
                Try Again
              </button>

            </div>
          )}

          {/* NO VEHICLES */}
          {!loading &&
            !error &&
            filteredVehicles.length === 0 && (
              <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-12 text-center">

                <Search
                  size={45}
                  className="mx-auto text-[#AAA298]"
                />

                <h3 className="text-xl font-semibold text-[#26352D] mt-5">
                  No vehicles found
                </h3>

                <p className="text-[#77736B] mt-2">
                  {vehicles.length === 0
                    ? "No vehicles have been published yet."
                    : "Try another make, model, city or category."}
                </p>

                {(searchTerm ||
                  category !== "All Vehicles") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategory("All Vehicles");
                    }}
                    className="mt-5 text-[#B86F52] font-semibold"
                  >
                    Clear Search
                  </button>
                )}

              </div>
            )}

          {/* VEHICLE CARDS */}
          {!loading &&
            !error &&
            filteredVehicles.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

                {filteredVehicles.map((vehicle) => {

                  const title = getVehicleTitle(vehicle);
                  const type = getVehicleType(vehicle);
                  const location = getVehicleLocation(vehicle);
                  const image = getVehicleImage(vehicle);
                  const vehicleId =
                    vehicle._id || vehicle.id;

                  return (
                    <div
                      key={vehicleId}
                      className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition duration-300"
                    >

                      {/* IMAGE */}
                      <div className="h-56 bg-[#E9E4DA] flex items-center justify-center overflow-hidden">

                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : type.toLowerCase() ===
                          "bike" ? (
                          <Bike
                            size={78}
                            strokeWidth={1.2}
                            className="text-[#9A9287]"
                          />
                        ) : (
                          <CarFront
                            size={78}
                            strokeWidth={1.2}
                            className="text-[#9A9287]"
                          />
                        )}

                      </div>

                      {/* DETAILS */}
                      <div className="p-6">

                        <p className="text-xs uppercase tracking-wider text-[#8A857B]">
                          {type}
                        </p>

                        <h3 className="text-xl font-semibold text-[#26352D] mt-2">
                          {title}
                        </h3>

                        <p className="text-xl font-semibold text-[#B86F52] mt-4">
                          {vehicle.price
                            ? `PKR ${Number(
                                vehicle.price
                              ).toLocaleString()}`
                            : "Price not available"}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-[#77736B] mt-5">

                          {vehicle.year && (
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={15} />
                              {vehicle.year}
                            </span>
                          )}

                          {vehicle.mileage && (
                            <span className="flex items-center gap-1.5">
                              <Gauge size={15} />
                              {vehicle.mileage}
                            </span>
                          )}

                          <span className="flex items-center gap-1.5">
                            <MapPin size={15} />
                            {location}
                          </span>

                        </div>

                        <Link
                          to={`/vehicle/${vehicleId}`}
                          className="block text-center bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] py-3 rounded-xl font-medium mt-6 transition"
                        >
                          View Details
                        </Link>

                      </div>
                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </section>

      {/* ============================
          HOW IT WORKS
      ============================ */}
      <section className="bg-[#FFFCF7] border-y border-[#D8CEC1] py-20">

        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-14">

            <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">
              Simple Process
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-3">
              How VehicleHub Works
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-12">

            <div className="text-center">

              <div className="w-16 h-16 mx-auto bg-[#E9E4DA] text-[#26352D] rounded-full flex items-center justify-center">
                <Search size={25} />
              </div>

              <h3 className="font-semibold text-lg text-[#26352D] mt-5">
                Search
              </h3>

              <p className="text-[#77736B] mt-2 leading-6">
                Find vehicles using simple search and filters.
              </p>

            </div>

            <div className="text-center">

              <div className="w-16 h-16 mx-auto bg-[#E9E4DA] text-[#26352D] rounded-full flex items-center justify-center">
                <Users size={25} />
              </div>

              <h3 className="font-semibold text-lg text-[#26352D] mt-5">
                Contact
              </h3>

              <p className="text-[#77736B] mt-2 leading-6">
                Connect directly with the vehicle seller.
              </p>

            </div>

            <div className="text-center">

              <div className="w-16 h-16 mx-auto bg-[#E9E4DA] text-[#26352D] rounded-full flex items-center justify-center">
                <ShieldCheck size={25} />
              </div>

              <h3 className="font-semibold text-lg text-[#26352D] mt-5">
                Buy or Sell
              </h3>

              <p className="text-[#77736B] mt-2 leading-6">
                Complete your vehicle deal with confidence.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ============================
          SELL CTA
      ============================ */}
      <section className="bg-[#26352D] py-16">

        <div className="max-w-4xl mx-auto px-4 text-center">

          <p className="text-[#B8C2B8] text-sm tracking-[0.15em] uppercase">
            Sell With VehicleHub
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-[#F7F3EC] mt-3">
            Ready to sell your vehicle?
          </h2>

          <p className="text-[#C9CEC9] mt-4">
            Create a listing and connect with potential buyers.
          </p>

          <Link
            to="/add-vehicle"
            className="inline-block bg-[#B86F52] hover:bg-[#A65F45] text-white px-8 py-3.5 rounded-xl font-medium mt-7 transition"
          >
            Sell Your Vehicle
          </Link>

        </div>
      </section>

      {/* ============================
          FOOTER
      ============================ */}
      <footer className="bg-[#202A24] text-[#AAAFA9] py-12">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-3 gap-10">

            {/* VEHICLEHUB */}
            <div>

              <h2 className="text-2xl font-semibold text-[#F7F3EC]">
                Vehicle
                <span className="text-[#B86F52]">
                  Hub
                </span>
              </h2>

              <p className="text-sm mt-3 leading-6">
                Your trusted vehicle marketplace for buying,
                selling and exploring cars, bikes and other
                vehicles.
              </p>

            </div>

            {/* MY INFORMATION */}
            <div>

              <h3 className="text-lg font-semibold text-[#F7F3EC] mb-4">
                My Information
              </h3>

              <div className="space-y-2 text-sm">

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

              <h3 className="text-lg font-semibold text-[#F7F3EC] mb-4">
                Quick Links
              </h3>

              <div className="flex flex-col gap-3 text-sm">

                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>

                <Link
                  to="/cars"
                  className="hover:text-white transition"
                >
                  Cars
                </Link>

                <Link
                  to="/bikes"
                  className="hover:text-white transition"
                >
                  Bikes
                </Link>

                <Link
                  to="/favorites"
                  className="hover:text-white transition"
                >
                  Favorites
                </Link>

                <Link
                  to="/messages"
                  className="hover:text-white transition"
                >
                  Messages
                </Link>

              </div>

            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="border-t border-[#3A443D] mt-10 pt-6 text-center text-sm">

            © {new Date().getFullYear()} VehicleHub.
            All rights reserved.

          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;