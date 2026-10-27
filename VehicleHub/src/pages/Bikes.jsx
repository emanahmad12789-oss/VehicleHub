import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";

function Bikes() {
  const [search, setSearch] = useState("");

  const bikes = [
    {
      id: 101,
      type: "Bike",
      title: "Yamaha YBR 125",
      brand: "Yamaha",
      model: "YBR 125",
      year: 2023,
      price: "PKR 435,000",
      mileage: "8,500 km",
      fuel: "Petrol",
      city: "Rawalpindi",
      condition: "Used",
    },
    {
      id: 102,
      type: "Bike",
      title: "Honda CG 125",
      brand: "Honda",
      model: "CG 125",
      year: 2024,
      price: "PKR 285,000",
      mileage: "4,000 km",
      fuel: "Petrol",
      city: "Islamabad",
      condition: "Used",
    },
    {
      id: 103,
      type: "Bike",
      title: "Suzuki GS 150",
      brand: "Suzuki",
      model: "GS 150",
      year: 2022,
      price: "PKR 390,000",
      mileage: "14,000 km",
      fuel: "Petrol",
      city: "Lahore",
      condition: "Used",
    },
    {
      id: 104,
      type: "Bike",
      title: "Honda CB 150F",
      brand: "Honda",
      model: "CB 150F",
      year: 2023,
      price: "PKR 480,000",
      mileage: "7,000 km",
      fuel: "Petrol",
      city: "Peshawar",
      condition: "Used",
    },
    {
      id: 105,
      type: "Bike",
      title: "Yamaha YZF-R15",
      brand: "Yamaha",
      model: "R15",
      year: 2023,
      price: "PKR 1,050,000",
      mileage: "5,500 km",
      fuel: "Petrol",
      city: "Islamabad",
      condition: "Used",
    },
    {
      id: 106,
      type: "Bike",
      title: "United US 70",
      brand: "United",
      model: "US 70",
      year: 2024,
      price: "PKR 118,000",
      mileage: "3,000 km",
      fuel: "Petrol",
      city: "Abbottabad",
      condition: "Used",
    },
  ];

  const filteredBikes = bikes.filter((bike) =>
    `${bike.title} ${bike.brand} ${bike.model} ${bike.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      {/* Header */}
      <section className="bg-slate-950 text-white py-14">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <p className="text-orange-500 font-semibold uppercase tracking-wider">
            VehicleHub
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Bikes for Sale
          </h1>

          <p className="text-slate-400 mt-3">
            Explore motorcycles and bikes from sellers across Pakistan.
          </p>

        </div>

      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8">

          <div className="flex flex-col md:flex-row gap-4">

            <div className="flex-1 relative">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, model or city..."
                className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-orange-500"
              />

            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-slate-200 px-6 py-3 rounded-xl hover:border-orange-500 hover:text-orange-500 transition"
            >
              <SlidersHorizontal size={19} />
              Filters
            </button>

            <select className="border border-slate-200 px-5 py-3 rounded-xl outline-none">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Viewed</option>
            </select>

          </div>

        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold">
            {filteredBikes.length} Bikes Found
          </h2>

          <span className="text-sm text-slate-500">
            Pakistan
          </span>

        </div>

        {filteredBikes.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredBikes.map((bike) => (
              <VehicleCard
                key={bike.id}
                vehicle={bike}
              />
            ))}

          </div>

        ) : (

          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">

            <h3 className="text-xl font-bold">
              No bikes found
            </h3>

            <p className="text-slate-500 mt-2">
              Try another search.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Bikes;