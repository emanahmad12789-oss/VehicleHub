import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ImagePlus,
  ArrowLeft,
  MapPin,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";

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
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages((previous) => [
          ...previous,
          {
            file,
            preview: reader.result,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem(
        "vehicleHubToken"
      );

      if (!token) {
        setError("Please login before adding a vehicle.");
        setLoading(false);
        return;
      }

      const imageData = images.map(
        (image) => image.preview
      );

      const vehicleData = {
        title: `${form.brand} ${form.model}`,

        type: form.type,
        brand: form.brand,
        model: form.model,

        year: Number(form.year),
        price: Number(form.price),

        mileage: form.mileage,
        fuel: form.fuel,
        transmission: form.transmission,
        condition: form.condition,
        city: form.city,

        description: form.description,

        images: imageData,
      };

      const response = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to publish vehicle"
        );

        setLoading(false);
        return;
      }

      alert(
        "Vehicle listing published successfully!"
      );

      navigate("/");

    } catch (error) {
      console.error(
        "Publish vehicle error:",
        error
      );

      setError(
        "Cannot connect to the server. Make sure the backend is running."
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

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* VEHICLE INFORMATION */}

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
                      <option>Car</option>
                      <option>Bike</option>
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
                      <option value="">
                        Select Brand
                      </option>
                      <option>Toyota</option>
                      <option>Honda</option>
                      <option>Suzuki</option>
                      <option>Kia</option>
                      <option>Hyundai</option>
                      <option>Yamaha</option>
                      <option>United</option>
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
                      placeholder="2024"
                      value={form.year}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none"
                    />
                  </div>

                </div>

              </section>

              {/* PRICE */}

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

                      <MapPin
                        size={18}
                        className="text-[#8A857B]"
                      />

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

              {/* PHOTOS */}

              <section>

                <h2 className="text-lg font-semibold text-[#26352D] mb-5">
                  Vehicle Photos
                </h2>

                <label
                  htmlFor="vehicle-images"
                  className="border-2 border-dashed border-[#D8CEC1] rounded-2xl bg-[#F7F3EC] min-h-[190px] flex flex-col items-center justify-center cursor-pointer hover:border-[#B86F52] transition"
                >

                  <ImagePlus
                    size={38}
                    className="text-[#8A857B]"
                  />

                  <p className="font-medium text-[#4A4943] mt-3">
                    Upload vehicle photos
                  </p>

                  <p className="text-sm text-[#99938A] mt-1">
                    Add multiple clear photos of your vehicle
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
                        key={index}
                        className="relative rounded-xl overflow-hidden"
                      >

                        <img
                          src={image.preview}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-36 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>

                      </div>

                    ))}

                  </div>

                )}

              </section>

              {/* DESCRIPTION */}

              <section>

                <h2 className="text-lg font-semibold text-[#26352D] mb-5">
                  Description
                </h2>

                <textarea
                  name="description"
                  rows="6"
                  placeholder="Describe your vehicle..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-[#D8CEC1] bg-[#F7F3EC] rounded-xl px-4 py-3 outline-none resize-none"
                />

              </section>

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              {/* BUTTONS */}

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
                  {loading
                    ? "Publishing..."
                    : "Publish Listing"}
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