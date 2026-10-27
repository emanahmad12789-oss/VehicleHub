import { Link } from "react-router-dom";
import {
  Heart,
  CarFront,
  Bike,
  MapPin,
  Gauge,
  CalendarDays,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Favorites() {
  const savedFavorites = JSON.parse(
    localStorage.getItem("vehicleFavorites") || "[]"
  );

  const removeFavorite = (id) => {
    const updatedFavorites = savedFavorites.filter(
      (vehicle) => vehicle.id !== id
    );

    localStorage.setItem(
      "vehicleFavorites",
      JSON.stringify(updatedFavorites)
    );

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#292724]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* HEADER */}
        <div className="text-center mb-12">

          <div className="inline-flex items-center justify-center bg-[#E9E4DA] text-[#B86F52] p-4 rounded-full">
            <Heart size={28} />
          </div>

          <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase mt-5">
            Your Collection
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-2">
            Favorite Vehicles
          </h1>

          <p className="text-[#77736B] mt-3">
            Vehicles you've saved for later.
          </p>

        </div>

        {/* EMPTY */}
        {savedFavorites.length === 0 ? (

          <div className="max-w-xl mx-auto bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-12 text-center">

            <div className="w-20 h-20 mx-auto bg-[#E9E4DA] rounded-full flex items-center justify-center">
              <Heart
                size={38}
                className="text-[#9A9287]"
                strokeWidth={1.5}
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#26352D] mt-6">
              No Favorites Yet
            </h2>

            <p className="text-[#77736B] mt-3 leading-6">
              When you find a vehicle you like, save it to your favorites
              and you'll find it here.
            </p>

            <Link
              to="/cars"
              className="inline-block bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-7 py-3 rounded-xl font-medium mt-7 transition"
            >
              Browse Cars
            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

            {savedFavorites.map((vehicle) => (

              <div
                key={vehicle.id}
                className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
              >

                {/* IMAGE / ICON */}
                <div className="h-52 bg-[#E9E4DA] flex items-center justify-center">

                  {vehicle.type === "Car" ? (
                    <CarFront
                      size={75}
                      strokeWidth={1.2}
                      className="text-[#9A9287]"
                    />
                  ) : (
                    <Bike
                      size={75}
                      strokeWidth={1.2}
                      className="text-[#9A9287]"
                    />
                  )}

                </div>

                {/* DETAILS */}
                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#8A857B]">
                        {vehicle.type || "Vehicle"}
                      </p>

                      <h3 className="text-xl font-semibold text-[#26352D] mt-1">
                        {vehicle.title || vehicle.name || "Vehicle"}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFavorite(vehicle.id)}
                      className="text-[#B86F52] hover:text-[#8E4E38] transition"
                      title="Remove from favorites"
                    >
                      <Heart
                        size={22}
                        fill="currentColor"
                      />
                    </button>

                  </div>

                  <p className="text-xl font-semibold text-[#B86F52] mt-4">
                    {vehicle.price || "Price not available"}
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

                    {vehicle.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} />
                        {vehicle.location}
                      </span>
                    )}

                  </div>

                  <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="block text-center bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] py-3 rounded-xl font-medium mt-6 transition"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      <footer className="bg-[#202A24] text-[#AAAFA9] py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} VehicleHub. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Favorites;