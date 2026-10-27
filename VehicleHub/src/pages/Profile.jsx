
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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/";

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

  // LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem(
          "vehicleHubLoggedIn"
        );

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || !(parsedUser._id || parsedUser.id)) {
          setUser(parsedUser);
          setFormData({
            name: parsedUser?.name || "",
            email: parsedUser?.email || "",
            phone: parsedUser?.phone || "",
            city: parsedUser?.city || "Pakistan",
          });
          setLoading(false);
          return;
        }

        const userId = parsedUser._id || parsedUser.id;

        const response = await fetch(
          `${API_URL}/api/auth/profile/${userId}`
        );

        const data = await response.json();

        const profileUser =
          response.ok && data.user ? data.user : parsedUser;

        setUser(profileUser);

        setFormData({
          name: profileUser.name || "",
          email: profileUser.email || "",
          phone: profileUser.phone || "",
          city: profileUser.city || "Pakistan",
        });

        localStorage.setItem(
          "vehicleHubLoggedIn",
          JSON.stringify(profileUser)
        );
      } catch (error) {
        console.error("Profile loading error:", error);

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
          console.error("Local storage error:", storageError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // INPUT CHANGE
  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    const userId = user?._id || user?.id;

    if (!userId) {
      alert("User information is missing. Please login again.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("vehicleHubToken");

      const response = await fetch(
        `${API_URL}/api/auth/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      const updatedUser = {
        ...user,
        ...(data.user || {}),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
      };

      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        city: updatedUser.city || "Pakistan",
      });

      localStorage.setItem(
        "vehicleHubLoggedIn",
        JSON.stringify(updatedUser)
      );

      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Save profile error:", error);
      alert(error.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <p className="text-[#26352D]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // NOT LOGGED IN
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

  // PROFILE PAGE
  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center">
            <UserCircle size={58} strokeWidth={1.4} />
          </div>

          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">
            My Profile
          </h1>

          <p className="text-[#77736B] mt-2">
            Manage your VehicleHub account information.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-7">
          <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-semibold text-[#26352D]">
                Personal Information
              </h2>

              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-[#B86F52] font-medium hover:opacity-80"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              ) : (
                <button
                  type="button"
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
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 w-full bg-[#B86F52] hover:bg-[#A65F45] text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#26352D] rounded-2xl p-7 text-[#F7F3EC]">
            <List size={30} className="text-[#B86F52]" />

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

function Info({ icon, label, value }) {
  return (
    <div className="bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#8A857B] text-sm">
        {icon}
        {label}
      </div>

      <p className="text-[#26352D] font-medium mt-2 break-words">
        {value}
      </p>
    </div>
  );
}

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
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-[#8A857B] text-sm mb-2"
      >
        {icon}
        {label}
      </label>

      <input
        id={name}
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
