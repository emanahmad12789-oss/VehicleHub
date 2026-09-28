import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cars from "./pages/Cars";
import Bikes from "./pages/Bikes";
import AddVehicle from "./pages/AddVehicle";
import MyListings from "./pages/MyListings";
import VehicleDetails from "./pages/VehicleDetails";
import Favorites from "./pages/Favorites";
import Messages from "./pages/messages";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* VEHICLES */}
        <Route
          path="/cars"
          element={<Cars />}
        />

        <Route
          path="/bikes"
          element={<Bikes />}
        />

        {/* ADD VEHICLE */}
        <Route
          path="/add-vehicle"
          element={<AddVehicle />}
        />

        {/* MY LISTINGS */}
        <Route
          path="/my-listings"
          element={<MyListings />}
        />

        {/* VEHICLE DETAILS */}
        <Route
          path="/vehicle/:id"
          element={<VehicleDetails />}
        />

        {/* FAVORITES */}
        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* MESSAGES */}
        <Route
          path="/messages"
          element={<Messages />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;