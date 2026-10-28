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
import EditVehicle from "./pages/EditVehicle";
import OwnerPanel from "./pages/OwnerPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<OwnerPanel />} />
        <Route path="/owner" element={<OwnerPanel />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
