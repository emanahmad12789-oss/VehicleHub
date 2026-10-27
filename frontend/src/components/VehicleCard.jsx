
import { Link } from "react-router-dom";
import {
  MapPin,
  Gauge,
  Fuel,
  CalendarDays,
  Heart,
  CarFront,
  Bike,
} from "lucide-react";

function formatPrice(price) {
  if (typeof price === "string") return price;
  if (!price && price !== 0) return "Price on request";
  return `PKR ${Number(price).toLocaleString()}`;
}

function VehicleCard({ vehicle }) {
  const vehicleId = vehicle._id || vehicle.id;
  const type = vehicle.type || vehicle.category || "Vehicle";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300 group">

      {/* Vehicle Image */}
      <div className="relative h-56 bg-gradient-to-br from-slate-700 to-slate-950 flex items-center justify-center overflow-hidden">
        {(vehicle.image || vehicle.imageUrl || (Array.isArray(vehicle.images) && vehicle.images.length > 0)) ? (
          <img
            src={vehicle.image || vehicle.imageUrl || vehicle.images[0]}
            alt={vehicle.title || `${vehicle.brand || vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : type === "Bike" ? (
          <Bike
            size={90}
            className="text-slate-500 group-hover:scale-110 transition"
          />
        ) : (
          <CarFront
            size={90}
            className="text-slate-500 group-hover:scale-110 transition"
          />
        )}

        {/* Favorite */}
        <button
          type="button"
          className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow hover:text-orange-500 transition"
          aria-label="Add to favorites"
        >
          <Heart size={19} />
        </button>

        {/* Condition */}
        {vehicle.condition && (
          <span className="absolute bottom-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {vehicle.condition}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">

        <div className="flex justify-between items-start gap-3">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {vehicle.title || `${vehicle.brand || vehicle.make || ""} ${vehicle.model || ""}`.trim()}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {vehicle.brand || vehicle.make} {vehicle.model}
            </p>
          </div>

          <span className="text-xs bg-slate-100 px-2 py-1 rounded">
            {type}
          </span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-orange-500 mt-4">
          {formatPrice(vehicle.price)}
        </p>

        {/* Vehicle Information */}
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-slate-500">

          {vehicle.year && (
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {vehicle.year}
            </span>
          )}

          {vehicle.mileage && (
            <span className="flex items-center gap-2">
              <Gauge size={16} />
              {vehicle.mileage}
            </span>
          )}

          {vehicle.fuel && (
            <span className="flex items-center gap-2">
              <Fuel size={16} />
              {vehicle.fuel}
            </span>
          )}

          {(vehicle.city || vehicle.location) && (
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {vehicle.city || vehicle.location}
            </span>
          )}

        </div>

        {/* View Details */}
        <Link
          to={`/vehicle/${vehicleId}`}
          state={{ vehicle }}
          className="block text-center mt-5 bg-slate-950 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}

export default VehicleCard;
