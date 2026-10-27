import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Navbar from "../components/Navbar";
import VehicleCard from "../components/VehicleCard";

function Bikes() {
  const [search, setSearch] = useState("");
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/vehicles?type=Bike");
        const data = await response.json();
        if (Array.isArray(data)) {
          setBikes(data);
        } else {
          setBikes([]);
        }
      } catch (err) {
        console.error("Bikes fetch error:", err);
        setError("Cannot connect to the server. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const filteredBikes = bikes.filter((bike) =>
    `${bike.title || ""} ${bike.brand || ""} ${bike.model || ""} ${bike.city || ""}`
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
            {loading ? "Loading..." : `${filteredBikes.length} Bikes Found`}
          </h2>

          <span className="text-sm text-slate-500">
            Pakistan
          </span>

        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 mt-4">Loading bikes...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
            <h3 className="text-xl font-bold text-red-600">Unable to load bikes</h3>
            <p className="text-slate-500 mt-2">{error}</p>
          </div>
        ) : filteredBikes.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredBikes.map((bike) => (
              <VehicleCard
                key={bike._id || bike.id}
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
