import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CarFront,
  Image as ImageIcon,
} from "lucide-react";

import Navbar from "../components/Navbar";

function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "Car",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    condition: "Used",
    city: "",
    description: "",
    sellerPhone: "",
    images: [],
  });

  // ===============================
  // LOAD VEHICLE
  // ===============================
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/vehicles/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Vehicle could not be found"
          );
        }

        setFormData({
          title: data.title || "",
          type: data.type || "Car",
          brand: data.brand || "",
          model: data.model || "",
          year: data.year || "",
          price: data.price || "",
          mileage: data.mileage || "",
          fuel: data.fuel || "",
          transmission: data.transmission || "",
          condition: data.condition || "Used",
          city: data.city || "",
          description: data.description || "",
          sellerPhone: data.sellerPhone || "",
          images: Array.isArray(data.images)
            ? data.images
            : [],
        });
      } catch (err) {
        console.error("Vehicle loading error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================
  // SAVE CHANGES
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            year: Number(formData.year),
            price: Number(formData.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update vehicle"
        );
      }

      alert("Vehicle updated successfully!");

      navigate("/my-listings");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 py-20 text-center">

          <div className="w-10 h-10 border-4 border-[#D8CEC1] border-t-[#26352D] rounded-full animate-spin mx-auto"></div>

          <h2 className="text-xl font-semibold text-[#26352D] mt-5">
            Loading vehicle...
          </h2>

        </div>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="max-w-xl mx-auto px-4 py-20">

          <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-10 text-center">

            <CarFront
              size={55}
              className="mx-auto text-[#9A9287]"
            />

            <h2 className="text-2xl font-semibold text-[#26352D] mt-5">
              Vehicle Not Found
            </h2>

            <p className="text-[#77736B] mt-2">
              {error}
            </p>

            <Link
              to="/my-listings"
              className="inline-flex items-center gap-2 mt-6 bg-[#26352D] text-white px-6 py-3 rounded-xl"
            >
              <ArrowLeft size={17} />
              Back to Listings
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // ===============================
  // FORM
  // ===============================
  return (
    <div className="min-h-screen bg-[#F7F3EC]">

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADER */}
        <div className="mb-8">

          <Link
            to="/my-listings"
            className="inline-flex items-center gap-2 text-[#B86F52] font-medium text-sm"
          >
            <ArrowLeft size={17} />
            Back to My Listings
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-5">
            Edit Vehicle
          </h1>

          <p className="text-[#77736B] mt-2">
            Update your vehicle listing information.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-6 md:p-8"
        >

          {/* BASIC INFORMATION */}
          <h2 className="text-xl font-semibold text-[#26352D] mb-6">
            Vehicle Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {/* TITLE */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Listing Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none focus:border-[#26352D]"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Vehicle Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
            </div>

            {/* BRAND */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Brand
              </label>

              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* MODEL */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Model
              </label>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* YEAR */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Price (PKR)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* MILEAGE */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Mileage
              </label>

              <input
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                placeholder="e.g. 35,000 km"
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* FUEL */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Fuel
              </label>

              <input
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
                placeholder="e.g. Petrol"
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* TRANSMISSION */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Transmission
              </label>

              <input
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
                placeholder="e.g. Automatic"
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* CONDITION */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Condition
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              >
                <option value="Used">Used</option>
                <option value="New">New</option>
              </select>
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                City
              </label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="e.g. Islamabad"
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Seller Phone
              </label>

              <input
                name="sellerPhone"
                value={formData.sellerPhone}
                onChange={handleChange}
                required
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-[#4A4943] mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none resize-none"
              />

            </div>

          </div>

          {/* IMAGES */}
          <div className="mt-8">

            <h3 className="font-semibold text-[#26352D] mb-4">
              Vehicle Photos
            </h3>

            {formData.images.length > 0 ? (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="h-32 rounded-xl overflow-hidden border border-[#D8CEC1]"
                  >
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

              </div>

            ) : (

              <div className="border border-dashed border-[#D8CEC1] rounded-xl p-8 text-center">

                <ImageIcon
                  size={35}
                  className="mx-auto text-[#9A9287]"
                />

                <p className="text-[#77736B] mt-2">
                  No vehicle photos available.
                </p>

              </div>

            )}

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-10">

            <Link
              to="/my-listings"
              className="flex-1 text-center border border-[#D8CEC1] text-[#4A4943] py-3 rounded-xl hover:bg-[#F7F3EC]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-[#26352D] hover:bg-[#34483D] disabled:opacity-60 text-white py-3 rounded-xl font-medium"
            >

              <Save size={18} />

              {saving ? "Saving..." : "Save Changes"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditVehicle;