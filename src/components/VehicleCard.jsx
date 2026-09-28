
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

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300 group">

      {/* Vehicle Image */}
      <div className="relative h-56 bg-gradient-to-br from-slate-700 to-slate-950 flex items-center justify-center">

        {vehicle.type === "Car" ? (
          <CarFront
            size={90}
            className="text-slate-500 group-hover:scale-110 transition"
          />
        ) : (
          <Bike
            size={90}
            className="text-slate-500 group-hover:scale-110 transition"
          />
        )}

        {/* Favorite */}
        <button
          type="button"
          className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow hover:text-orange-500 transition"
        >
          <Heart size={19} />
        </button>

        {/* Condition */}
        <span className="absolute bottom-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {vehicle.condition}
        </span>
      </div>

      {/* Details */}
      <div className="p-5">

        <div className="flex justify-between items-start gap-3">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {vehicle.title}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>

          <span className="text-xs bg-slate-100 px-2 py-1 rounded">
            {vehicle.type}
          </span>
        </div>

        {/* Price */}
        <p className="text-xl font-bold text-orange-500 mt-4">
          {vehicle.price}
        </p>

        {/* Vehicle Information */}
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-slate-500">

          <span className="flex items-center gap-2">
            <CalendarDays size={16} />
            {vehicle.year}
          </span>

          <span className="flex items-center gap-2">
            <Gauge size={16} />
            {vehicle.mileage}
          </span>

          <span className="flex items-center gap-2">
            <Fuel size={16} />
            {vehicle.fuel}
          </span>

          <span className="flex items-center gap-2">
            <MapPin size={16} />
            {vehicle.city}
          </span>

        </div>

        {/* View Details */}
        <Link
          to={`/vehicle/${vehicle.id}`}
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