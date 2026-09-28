import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  Car,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/vehicles";

function MyListings() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getLoggedInUser = () => {
    try {
      const storedUser = localStorage.getItem(
        "vehicleHubLoggedIn"
      );

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User storage error:", error);
      return null;
    }
  };

  // ==========================================
  // FETCH MY LISTINGS
  // ==========================================

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      if (!user) {
        setVehicles([]);
        setError(
          "Please login first to view your listings."
        );
        return;
      }

      if (!user.email) {
        setVehicles([]);
        setError(
          "Your account email is missing. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/my-listings?email=${encodeURIComponent(
          user.email
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load your listings."
        );
      }

      // Backend may return an array
      if (Array.isArray(data)) {
        setVehicles(data);
      }
      // Or { vehicles: [...] }
      else if (Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);
      }
      // Or { listings: [...] }
      else if (Array.isArray(data.listings)) {
        setVehicles(data.listings);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      console.error("My Listings Error:", error);
      setError(
        error.message ||
          "Something went wrong while loading listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // ==========================================
  // DELETE VEHICLE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed."
        );
      }

      setVehicles((previous) =>
        previous.filter(
          (vehicle) => vehicle._id !== id
        )
      );

      alert("Vehicle deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);

      alert(
        error.message ||
          "Failed to delete vehicle."
      );
    }
  };

  // ==========================================
  // EDIT VEHICLE
  // ==========================================

  const handleEdit = (id) => {
    navigate(`/edit-vehicle/${id}`);
  };

  // ==========================================
  // GET IMAGE
  // ==========================================

  const getImage = (vehicle) => {
    if (vehicle.image) {
      return vehicle.image;
    }

    if (vehicle.imageUrl) {
      return vehicle.imageUrl;
    }

    if (
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      return vehicle.images[0];
    }

    return "https://via.placeholder.com/600x400?text=Vehicle";
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F7F3EC]">

      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Listings
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your vehicles from one place.
            </p>

          </div>

          <Link
            to="/add-vehicle"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus size={20} />
            Add Vehicle
          </Link>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex flex-col justify-center items-center py-20">

            <Loader2
              size={40}
              className="animate-spin text-gray-700"
            />

            <p className="text-gray-600 mt-4">
              Loading your listings...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">

            <p>{error}</p>

            <Link
              to="/login"
              className="inline-block mt-4 bg-black text-white px-5 py-2 rounded-lg"
            >
              Login
            </Link>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          vehicles.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">

              <Car
                size={60}
                className="mx-auto text-gray-400 mb-5"
              />

              <h2 className="text-2xl font-semibold text-gray-900">
                No Listings Yet
              </h2>

              <p className="text-gray-500 mt-2 mb-6">
                You have not added any vehicle yet.
              </p>

              <Link
                to="/add-vehicle"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl"
              >
                <Plus size={20} />
                Add Your First Vehicle
              </Link>

            </div>
          )}

        {/* VEHICLES */}

        {!loading &&
          !error &&
          vehicles.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {vehicles.map((vehicle) => (

                <div
                  key={vehicle._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                >

                  {/* IMAGE */}

                  <img
                    src={getImage(vehicle)}
                    alt={
                      vehicle.title ||
                      vehicle.name ||
                      "Vehicle"
                    }
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400?text=Vehicle";
                    }}
                  />

                  <div className="p-5">

                    {/* TITLE */}

                    <h2 className="text-xl font-bold text-gray-900">
                      {vehicle.title ||
                        vehicle.name ||
                        `${vehicle.make || ""} ${
                          vehicle.model || ""
                        }`}
                    </h2>

                    {/* PRICE */}

                    <p className="text-2xl font-bold mt-2 text-gray-900">
                      Rs.{" "}
                      {Number(
                        vehicle.price || 0
                      ).toLocaleString()}
                    </p>

                    {/* DETAILS */}

                    <div className="text-sm text-gray-500 mt-3 space-y-1">

                      {vehicle.year && (
                        <p>
                          <strong>Year:</strong>{" "}
                          {vehicle.year}
                        </p>
                      )}

                      {vehicle.category && (
                        <p>
                          <strong>Category:</strong>{" "}
                          {vehicle.category}
                        </p>
                      )}

                      {vehicle.location && (
                        <p>
                          <strong>Location:</strong>{" "}
                          {vehicle.location}
                        </p>
                      )}

                    </div>

                    {/* BUTTONS */}

                    <div className="grid grid-cols-3 gap-2 mt-5">

                      {/* VIEW */}

                      <Link
                        to={`/vehicle/${vehicle._id}`}
                        className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          handleEdit(vehicle._id)
                        }
                        className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-lg text-sm"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(
                            vehicle._id
                          )
                        }
                        className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}

export default MyListings;