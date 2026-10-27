
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ImagePlus,
  ArrowLeft,
  MapPin,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";

const API_URL = "/";

function AddVehicle() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "Car",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "Petrol",
    transmission: "Automatic",
    condition: "Used",
    city: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    const remainingSlots = Math.max(0, 5 - images.length);
    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError("You can upload a maximum of 5 photos.");
    } else {
      setError("");
    }

    selectedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select image files only.");
        return;
      }

      // Keep image sizes limited for the JSON API request.
      if (file.size > 1.5 * 1024 * 1024) {
        setError("Each photo must be 1.5 MB or smaller.");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") return;

        setImages((previous) => {
          if (previous.length >= 5) return previous;

          return [
            ...previous,
            {
              name: file.name,
              preview: reader.result,
            },
          ];
        });
      };

      reader.onerror = () => {
        setError(`Could not read image: ${file.name}`);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    if (!form.brand || !form.model.trim()) {
      setError("Please enter the vehicle brand and model.");
      return;
    }

    if (
      !Number.isFinite(Number(form.year)) ||
      Number(form.year) < 1900 ||
      Number(form.year) > new Date().getFullYear() + 1
    ) {
      setError("Please enter a valid vehicle year.");
      return;
    }

    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("vehicleHubToken");

      let userData = {};

      try {
        userData = JSON.parse(
          localStorage.getItem("vehicleHubLoggedIn") || "{}"
        );
      } catch {
        userData = {};
      }

      if (!token) {
        setError("Please login before adding a vehicle.");
        return;
      }

      const email =
        userData.email ||
        userData.user?.email ||
        "";

      const sellerName =
        userData.name ||
        userData.username ||
        userData.user?.name ||
        "";

      const sellerPhone =
        userData.phone ||
        userData.mobile ||
        userData.user?.phone ||
        "";

      if (!email) {
        setError(
          "Your login email was not found. Please log out and log in again."
        );
        return;
      }

      const title = `${form.brand} ${form.model}`.trim();
      const imageData = images.map((image) => image.preview);

      const vehicleData = {
        title,
        name: title,

        type: form.type,
        category: form.type,
        brand: form.brand,
        make: form.brand,
        model: form.model,

        year: Number(form.year),
        price: Number(form.price),
        mileage: form.mileage.trim(),
        fuel: form.fuel,
        transmission: form.transmission,
        condition: form.condition,

        city: form.city.trim(),
        location: form.city.trim(),
        description: form.description.trim(),

        images: imageData,
        image: imageData[0] || "",
        imageUrl: imageData[0] || "",

        email,
        sellerEmail: email,
        sellerName,
        sellerPhone,
      };

      const response = await fetch(`${API_URL}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        console.error("Vehicle save failed:", response.status, data);

        throw new Error(
          data.message ||
            `Vehicle could not be saved. Server status: ${response.status}`
        );
      }

      // Confirm that the API returned a successful response.
      alert("Vehicle listing published successfully!");

      navigate("/my-listings", { replace: true });
    } catch (err) {
      console.error("Publish vehicle error:", err);

      setError(
        err.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#77736B] hover:text-[#B86F52] text-sm"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mt-8">
          <div className="mb-8">
            <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">
              Sell Your Vehicle
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-2">
              Create a Vehicle Listing
            </h1>

            <p className="text-[#77736B] mt-2">
              Add your vehicle details and connect with potential buyers.
            </p>
          </div>

          <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-[#26352D] mb-5">
                  Vehicle Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Vehicle Type
                    </label>

                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    >
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Brand
                    </label>

                    <select
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    >
                      <option value="">Select Brand</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="Kia">Kia</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Yamaha">Yamaha</option>
                      <option value="United">United</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Model
                    </label>

                    <input
                      name="model"
                      type="text"
                      placeholder="e.g. Corolla Altis"
                      value={form.model}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Year
                    </label>

                    <input
                      name="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      placeholder="2024"
                      value={form.year}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#26352D] mb-5">
                  Price & Specifications
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Price (PKR)
                    </label>

                    <input
                      name="price"
                      type="number"
                      min="1"
                      placeholder="Enter price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Mileage
                    </label>

                    <input
                      name="mileage"
                      type="text"
                      placeholder="e.g. 25,000 km"
                      value={form.mileage}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Fuel Type
                    </label>

                    <select
                      name="fuel"
                      value={form.fuel}
                      onChange={handleChange}
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Transmission
                    </label>

                    <select
                      name="transmission"
                      value={form.transmission}
                      onChange={handleChange}
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    >
                      <option>Automatic</option>
                      <option>Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      Condition
                    </label>

                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    >
                      <option>Used</option>
                      <option>New</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4943] mb-2">
                      City
                    </label>

                    <div className="flex items-center border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4">
                      <MapPin size={18} className="text-[#8A857B]" />

                      <input
                        name="city"
                        type="text"
                        placeholder="e.g. Islamabad"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent outline-none px-3 py-3"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#26352D] mb-2">
                  Vehicle Photos
                </h2>

                <p className="text-sm text-[#77736B] mb-4">
                  Maximum 5 photos, up to 1.5 MB per photo.
                </p>

                <label
                  htmlFor="vehicle-images"
                  className="border-2 border-dashed border-[#D8CEC1] rounded-2xl bg-[#F7F3EC] min-h-[190px] flex flex-col items-center justify-center cursor-pointer hover:border-[#B86F52] transition"
                >
                  <ImagePlus size={38} className="text-[#8A857B]" />

                  <p className="font-medium text-[#4A4943] mt-3">
                    Upload vehicle photos
                  </p>

                  <p className="text-sm text-[#99938A] mt-1">
                    Choose clear photos of your vehicle
                  </p>

                  <input
                    id="vehicle-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    {images.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        className="relative rounded-xl overflow-hidden"
                      >
                        <img
                          src={image.preview}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-36 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-lg font-semibold text-[#26352D] mb-5">
                  Description
                </h2>

                <textarea
                  name="description"
                  rows={6}
                  placeholder="Describe your vehicle..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none resize-none"
                />
              </section>

              {error && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
                >
                  {error}
                </div>
              )}

              <div className="border-t border-[#D8CEC1] pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  to="/"
                  className="px-6 py-3 rounded-xl border border-[#D8CEC1] text-[#4A4943] text-center hover:bg-[#F7F3EC]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#26352D] hover:bg-[#34483D] disabled:opacity-60 text-[#F7F3EC] px-7 py-3 rounded-xl font-medium transition"
                >
                  {loading ? "Publishing..." : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddVehicle;
