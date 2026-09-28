import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Pencil,
  List,
  X,
  Save,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem(
          "vehicleHubLoggedIn"
        );

        // No logged-in user
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || !parsedUser._id) {
          setLoading(false);
          return;
        }

        // Get latest user information from MongoDB
        const response = await fetch(
          `http://localhost:5000/api/auth/profile/${parsedUser._id}`
        );

        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);

          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            city: data.user.city || "Pakistan",
          });

          // Keep localStorage updated
          localStorage.setItem(
            "vehicleHubLoggedIn",
            JSON.stringify(data.user)
          );
        } else {
          // If backend doesn't return user,
          // still use the logged-in user saved by Login
          setUser(parsedUser);

          setFormData({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            city: parsedUser.city || "Pakistan",
          });
        }
      } catch (error) {
        console.error("Profile Error:", error);

        // Fallback to saved login data
        try {
          const storedUser = localStorage.getItem(
            "vehicleHubLoggedIn"
          );

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);

            setFormData({
              name: parsedUser.name || "",
              email: parsedUser.email || "",
              phone: parsedUser.phone || "",
              city: parsedUser.city || "Pakistan",
            });
          }
        } catch (storageError) {
          console.error(
            "Local storage error:",
            storageError
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    if (!user?._id) {
      alert("User information is missing. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/auth/profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile update failed"
        );
      }

      const updatedUser = {
        ...data.user,
        city: formData.city,
      };

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        city: updatedUser.city || "Pakistan",
      });

      // Update logged-in user
      localStorage.setItem(
        "vehicleHubLoggedIn",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Save Profile Error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="flex justify-center items-center py-20">
          <p className="text-[#26352D]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />

        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-semibold text-[#26352D]">
            Please login first
          </h2>

          <Link
            to="/login"
            className="inline-block mt-5 bg-[#B86F52] hover:bg-[#A65F45] text-white px-6 py-3 rounded-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADER */}

        <div className="text-center mb-10">

          <div className="w-24 h-24 mx-auto rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center">

            <UserCircle
              size={58}
              strokeWidth={1.4}
            />

          </div>

          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">
            My Profile
          </h1>

          <p className="text-[#77736B] mt-2">
            Manage your VehicleHub account information.
          </p>

        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-7">

          {/* PERSONAL INFORMATION */}

          <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">

            <div className="flex items-center justify-between mb-7">

              <h2 className="text-xl font-semibold text-[#26352D]">
                Personal Information
              </h2>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-[#B86F52] font-medium hover:opacity-80"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 text-[#77736B] font-medium"
                >
                  <X size={17} />
                  Cancel
                </button>
              )}

            </div>

            {!editing ? (
              <div className="grid sm:grid-cols-2 gap-5">

                <Info
                  icon={<UserCircle size={18} />}
                  label="Name"
                  value={user.name || "Not provided"}
                />

                <Info
                  icon={<Mail size={18} />}
                  label="Email"
                  value={user.email || "Not provided"}
                />

                <Info
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={user.phone || "Not provided"}
                />

                <Info
                  icon={<MapPin size={18} />}
                  label="City"
                  value={user.city || "Pakistan"}
                />

              </div>
            ) : (
              <div className="space-y-5">

                <InputField
                  icon={<UserCircle size={18} />}
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Mail size={18} />}
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  icon={<Phone size={18} />}
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <InputField
                  icon={<MapPin size={18} />}
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 w-full bg-[#B86F52] hover:bg-[#A65F45] text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </div>

          {/* MY LISTINGS */}

          <div className="bg-[#26352D] rounded-2xl p-7 text-[#F7F3EC]">

            <List
              size={30}
              className="text-[#B86F52]"
            />

            <h2 className="text-xl font-semibold mt-5">
              My Listings
            </h2>

            <p className="text-[#C9CEC9] text-sm mt-2 leading-6">
              View and manage vehicles that you have listed for sale.
            </p>

            <Link
              to="/my-listings"
              className="inline-block bg-[#B86F52] hover:bg-[#A65F45] px-5 py-3 rounded-xl mt-6 font-medium transition"
            >
              View My Listings
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}


// ==========================================
// INFO COMPONENT
// ==========================================

function Info({ icon, label, value }) {
  return (
    <div className="bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl p-4">

      <div className="flex items-center gap-2 text-[#8A857B] text-sm">
        {icon}
        {label}
      </div>

      <p className="text-[#26352D] font-medium mt-2">
        {value}
      </p>

    </div>
  );
}


// ==========================================
// INPUT COMPONENT
// ==========================================

function InputField({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div>

      <label className="flex items-center gap-2 text-[#8A857B] text-sm mb-2">
        {icon}
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl px-4 py-3 text-[#26352D] outline-none focus:border-[#B86F52]"
      />

    </div>
  );
}

export default Profile;