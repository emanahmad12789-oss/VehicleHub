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

const API_URL = "http://localhost:5000/api/vehicles";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH VEHICLE
  // ======================================================
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Vehicle not found");
        }

        setVehicle(data);
      } catch (error) {
        console.error(error);
        setError(error.message || "Failed to load vehicle.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // ======================================================
  // IMAGE
  // ======================================================
  const getImage = () => {
    if (vehicle?.image) return vehicle.image;

    if (vehicle?.imageUrl) return vehicle.imageUrl;

    if (vehicle?.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }

    return "https://via.placeholder.com/900x600?text=Vehicle";
  };

  // ======================================================
  // PHONE
  // ======================================================
  const getPhone = () => {
    return (
      vehicle?.sellerPhone ||
      vehicle?.phone ||
      vehicle?.phoneNumber ||
      vehicle?.contact ||
      ""
    );
  };

  // ======================================================
  // SELLER NAME
  // ======================================================
  const getSellerName = () => {
    return (
      vehicle?.sellerName ||
      vehicle?.seller ||
      vehicle?.ownerName ||
      "Vehicle Seller"
    );
  };

  // ======================================================
  // WHATSAPP
  // ======================================================
  const handleWhatsApp = () => {
    const phone = getPhone();

    if (!phone) {
      alert("Seller phone number is not available.");
      return;
    }

    let cleanPhone = phone.replace(/\D/g, "");

    // Pakistan number conversion
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "92" + cleanPhone.substring(1);
    }

    if (!cleanPhone.startsWith("92")) {
      cleanPhone = "92" + cleanPhone;
    }

    const message = encodeURIComponent(
      `Hello, I am interested in your ${vehicle?.title || vehicle?.name || "vehicle"} listed on VehicleHub.`
    );

    window.open(
      `https://wa.me/${cleanPhone}?text=${message}`,
      "_blank"
    );
  };

  // ======================================================
  // CALL SELLER
  // ======================================================
  const handleCall = () => {
    const phone = getPhone();

    if (!phone) {
      alert("Seller phone number is not available.");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="flex justify-center items-center py-32">
          <Loader2
            size={45}
            className="animate-spin text-gray-700"
          />
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="max-w-4xl mx-auto px-5 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Vehicle Not Found
          </h1>

          <p className="text-gray-600 mt-3">
            {error || "This vehicle does not exist."}
          </p>

          <Link
            to="/my-listings"
            className="inline-flex items-center gap-2 mt-6 bg-black text-white px-6 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Back to My Listings
          </Link>
        </div>
      </div>
    );
  }

  const title =
    vehicle.title ||
    vehicle.name ||
    `${vehicle.make || ""} ${vehicle.model || ""}`.trim() ||
    "Vehicle";

  const price = Number(vehicle.price || 0);

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">

        {/* BACK */}
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black mb-7"
        >
          <ArrowLeft size={18} />
          Back to My Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* IMAGE */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <img
              src={getImage()}
              alt={title}
              className="w-full h-[400px] lg:h-[500px] object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/900x600?text=Vehicle";
              }}
            />
          </div>

          {/* DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">

            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {vehicle.category || "Vehicle"}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {title}
            </h1>

            <p className="text-3xl font-bold text-gray-900 mt-5">
              Rs. {price.toLocaleString()}
            </p>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 mt-7">

              {vehicle.year && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <Calendar
                    size={20}
                    className="text-gray-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Year
                  </p>

                  <p className="font-semibold">
                    {vehicle.year}
                  </p>
                </div>
              )}

              {vehicle.category && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <Tag
                    size={20}
                    className="text-gray-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="font-semibold">
                    {vehicle.category}
                  </p>
                </div>
              )}

              {vehicle.location && (
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <MapPin
                    size={20}
                    className="text-gray-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="font-semibold">
                    {vehicle.location}
                  </p>
                </div>
              )}

            </div>

            {/* DESCRIPTION */}
            {vehicle.description && (
              <div className="mt-7">
                <h2 className="text-xl font-bold">
                  Description
                </h2>

                <p className="text-gray-600 mt-2 leading-7">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* SELLER */}
            <div className="border-t border-gray-200 mt-7 pt-6">

              <h2 className="text-xl font-bold mb-4">
                Seller Information
              </h2>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={22} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Seller
                  </p>

                  <p className="font-semibold">
                    {getSellerName()}
                  </p>
                </div>
              </div>

              {getPhone() && (
                <p className="text-gray-600 mb-5">
                  <strong>Phone:</strong>{" "}
                  {getPhone()}
                </p>
              )}

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl hover:bg-gray-800 transition"
                >
                  <Phone size={19} />
                  Call Seller
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 transition"
                >
                  <MessageCircle size={19} />
                  WhatsApp Seller
                </button>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VehicleDetails;