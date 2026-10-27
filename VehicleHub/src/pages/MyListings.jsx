
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Eye,
  Plus,
  Car,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "/";

function getStoredUser() {
  const keys = [
    "vehicleHubLoggedIn",
    "vehicleHubUser",
    "user",
  ];

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Try the next possible storage key.
    }
  }

  return {};
}

function getEmail(user) {
  const candidates = [
    user.email,
    user.user?.email,
    user.userData?.email,
    user.profile?.email,
    localStorage.getItem("userEmail"),
    localStorage.getItem("email"),
  ];

  const value = candidates.find(
    (item) => typeof item === "string" && item.trim()
  );

  return value ? value.trim().toLowerCase() : "";
}

function getImage(vehicle) {
  if (vehicle.image) return vehicle.image;
  if (vehicle.imageUrl) return vehicle.imageUrl;

  if (Array.isArray(vehicle.images) && vehicle.images.length) {
    const first = vehicle.images[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
  }

  return "https://placehold.co/600x400?text=Vehicle";
}

function MyListings() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const user = getStoredUser();
      const email = getEmail(user);

      if (!email) {
        throw new Error(
          "Login email was not found. Log out and log in again."
        );
      }

      const token = localStorage.getItem("vehicleHubToken");

      const response = await fetch(
        `${API_URL}/api/vehicles/my-listings?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || `Server error: ${response.status}`
        );
      }

      const list = Array.isArray(data)
        ? data
        : data?.vehicles || data?.listings || data?.data;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from the vehicles API.");
      }

      setVehicles(list);
    } catch (err) {
      console.error("My Listings error:", err);
      setVehicles([]);
      setError(err.message || "Could not load your listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem("vehicleHubToken");
      if (!token) throw new Error("Please log in again.");

      const response = await fetch(`${API_URL}/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Delete failed: ${response.status}`);
      }

      setVehicles((current) =>
        current.filter((vehicle) => vehicle._id !== id)
      );
    } catch (err) {
      window.alert(err.message || "Could not delete vehicle.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#26352D]">
              My Listings
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your published vehicles.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchMyListings}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 disabled:opacity-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link
              to="/add-vehicle"
              className="inline-flex items-center gap-2 rounded-xl bg-[#26352D] px-5 py-3 text-white"
            >
              <Plus size={20} />
              Add Vehicle
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <Loader2 size={40} className="animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchMyListings}
              className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <Car size={55} className="mx-auto text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold">No Listings Yet</h2>
            <p className="mt-2 text-gray-500">
              No vehicles were found for your account.
            </p>
            <Link
              to="/add-vehicle"
              className="inline-flex items-center gap-2 mt-6 rounded-xl bg-black px-6 py-3 text-white"
            >
              <Plus size={20} />
              Add Vehicle
            </Link>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
              const title =
                vehicle.title ||
                vehicle.name ||
                `${vehicle.brand || vehicle.make || ""} ${vehicle.model || ""}`.trim() ||
                "Vehicle";

              return (
                <article
                  key={vehicle._id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <img
                    src={getImage(vehicle)}
                    alt={title}
                    className="h-52 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "https://placehold.co/600x400?text=Vehicle";
                    }}
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="mt-2 text-2xl font-bold">
                      Rs. {Number(vehicle.price || 0).toLocaleString()}
                    </p>

                    <div className="mt-2 text-sm text-gray-500">
                      {vehicle.year && <p>Year: {vehicle.year}</p>}
                      {(vehicle.city || vehicle.location) && (
                        <p>Location: {vehicle.city || vehicle.location}</p>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <Link
                        to={`/vehicle/${vehicle._id}`}
                        className="flex items-center justify-center gap-1 rounded-lg bg-gray-100 py-2 text-sm"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-blue-50 py-2 text-sm text-blue-700"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === vehicle._id}
                        onClick={() => handleDelete(vehicle._id)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-sm text-red-700 disabled:opacity-50"
                      >
                        {deletingId === vehicle._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyListings;
