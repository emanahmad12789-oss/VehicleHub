
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Tag,
  User,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "/api/vehicles";

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchVehicle() {
      try {
        setLoading(true);
        setError("");
        setVehicle(null);

        const response = await fetch(
          `${API_URL}/${encodeURIComponent(id)}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message || `Could not load vehicle (${response.status})`
          );
        }

        const result = data?.vehicle || data?.data || data;

        if (!result || !result._id) {
          throw new Error("Vehicle details were not found.");
        }

        setVehicle(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Vehicle details error:", err);
          setError(err.message || "Unable to load vehicle details.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    if (id) fetchVehicle();
    else {
      setError("Vehicle ID is missing.");
      setLoading(false);
    }

    return () => controller.abort();
  }, [id]);

  const getImage = () => {
    const images = vehicle?.images;

    if (vehicle?.image) return vehicle.image;
    if (vehicle?.imageUrl) return vehicle.imageUrl;

    if (Array.isArray(images) && images.length) {
      const first = images[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
    }

    return "https://placehold.co/900x600?text=Vehicle";
  };

  const phone =
    vehicle?.sellerPhone ||
    vehicle?.phone ||
    vehicle?.phoneNumber ||
    vehicle?.contact ||
    "";

  const sellerName =
    vehicle?.sellerName ||
    (typeof vehicle?.seller === "string" ? vehicle.seller : "") ||
    vehicle?.seller?.name ||
    vehicle?.ownerName ||
    "Vehicle Seller";

  const title =
    vehicle?.title ||
    vehicle?.name ||
    `${vehicle?.brand || vehicle?.make || ""} ${vehicle?.model || ""}`.trim() ||
    "Vehicle";

  const handleCall = () => {
    if (!phone) {
      window.alert("Seller phone number is not available.");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    if (!phone) {
      window.alert("Seller phone number is not available.");
      return;
    }

    let number = String(phone).replace(/\D/g, "");

    if (number.startsWith("00")) number = number.slice(2);
    if (number.startsWith("0")) number = `92${number.slice(1)}`;
    else if (!number.startsWith("92")) number = `92${number}`;

    const message = encodeURIComponent(
      `Hello, I am interested in your ${title} listed on VehicleHub.`
    );

    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <Loader2 size={42} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-5 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Unable to Load Vehicle
          </h1>
          <p className="mt-3 text-red-600">{error || "Vehicle not found."}</p>
          <Link
            to="/my-listings"
            className="inline-flex items-center gap-2 mt-6 bg-black text-white px-6 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Back to My Listings
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-gray-700 mb-7"
        >
          <ArrowLeft size={18} />
          Back to My Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <img
              src={getImage()}
              alt={title}
              className="w-full h-[350px] lg:h-[500px] object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://placehold.co/900x600?text=Vehicle";
              }}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-7">
            <p className="text-sm text-gray-500 uppercase">
              {vehicle.category || vehicle.type || "Vehicle"}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">{title}</h1>

            <p className="text-3xl font-bold mt-5">
              Rs. {Number(vehicle.price || 0).toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-7">
              {vehicle.year && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <Calendar size={20} className="mb-2" />
                  <p className="text-xs text-gray-500">Year</p>
                  <p className="font-semibold">{vehicle.year}</p>
                </div>
              )}

              {(vehicle.category || vehicle.type) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <Tag size={20} className="mb-2" />
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-semibold">
                    {vehicle.category || vehicle.type}
                  </p>
                </div>
              )}

              {(vehicle.location || vehicle.city) && (
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <MapPin size={20} className="mb-2" />
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-semibold">
                    {vehicle.location || vehicle.city}
                  </p>
                </div>
              )}

              {vehicle.mileage && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="font-semibold">{vehicle.mileage}</p>
                </div>
              )}

              {vehicle.fuel && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Fuel</p>
                  <p className="font-semibold">{vehicle.fuel}</p>
                </div>
              )}

              {vehicle.transmission && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Transmission</p>
                  <p className="font-semibold">{vehicle.transmission}</p>
                </div>
              )}

              {vehicle.condition && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Condition</p>
                  <p className="font-semibold">{vehicle.condition}</p>
                </div>
              )}
            </div>

            {vehicle.description && (
              <section className="mt-7">
                <h2 className="text-xl font-bold">Description</h2>
                <p className="text-gray-600 mt-2 leading-7 whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </section>
            )}

            <section className="border-t border-gray-200 mt-7 pt-6">
              <h2 className="text-xl font-bold mb-4">Seller Information</h2>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-semibold">{sellerName}</p>
                </div>
              </div>

              {phone && (
                <p className="text-gray-600 mb-5">
                  <strong>Phone:</strong> {phone}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl"
                >
                  <Phone size={19} />
                  Call Seller
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl"
                >
                  <MessageCircle size={19} />
                  WhatsApp Seller
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VehicleDetails;
