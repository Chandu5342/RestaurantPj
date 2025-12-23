import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MapPin, Upload, Image } from "lucide-react";
import { register as apiRegister } from '@/api/authApi';

// Using real backend API for registration. Local demo storage removed.

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    imageUrl: "",
    restaurantName: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");  const [uploadedFile, setUploadedFile] = useState(null);  const [autoLocation, setAutoLocation] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationStr = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
          setAutoLocation(locationStr);
          setForm(prev => ({ ...prev, location: locationStr }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setAutoLocation("Location access denied");
        }
      );
    } else {
      setAutoLocation("Geolocation not supported");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      setUploadedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || form.password.length < 6) {
      setError("Please enter valid details. Password must be at least 6 characters.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email.toLowerCase());
      payload.append('password', form.password);
      payload.append('role', role);
      payload.append('location', form.location || '');
      payload.append('restaurantName', form.restaurantName || '');

      if (uploadedFile) {
        payload.append('avatar', uploadedFile);
      } else if (form.imageUrl) {
        payload.append('avatarUrl', form.imageUrl);
      }

      const data = await apiRegister(payload);

      // save token for frontend sessions (may be absent for pending admin)
      if (data.token) {
        localStorage.setItem('rb_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('rb_user', JSON.stringify(data.user));
      }

      // Show success message and navigate
      if (role === 'admin') {
        alert('Account created. Your restaurant registration is pending approval from a Super Admin.');
      } else {
        alert(`Account created successfully as ${role === 'super-admin' ? 'Super Admin' : role}!`);
      }
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed, please try again');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card p-8 border border-border rounded-xl shadow">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Restaurant Dashboard Signup</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Home
          </Link>
        </div>

        {/* ROLE SELECTION */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-3">Select Account Type:</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-3 rounded-lg border-2 text-center transition-all ${role === "admin"
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
            >
              Admin
              <p className="text-xs mt-1 opacity-80">Single Restaurant</p>
            </button>

            <button
              type="button"
              onClick={() => setRole("super-admin")}
              className={`flex-1 py-3 rounded-lg border-2 text-center transition-all ${role === "super-admin"
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
            >
              Super Admin
              <p className="text-xs mt-1 opacity-80">Multiple Restaurants</p>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 pb-2 border-b">
          {role === "admin" ? "📋 Admin Registration" : "👑 Super Admin Registration"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email Address *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="you@restaurant.com"
                required
              />
            </div>
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="text-sm font-medium mb-2 block">Password *</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="input-field w-full pr-10"
                placeholder="Minimum 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-t pt-6">
            <label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <MapPin size={16} />
              Restaurant Location
            </label>
            <div className="space-y-3">
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Enter restaurant address or location"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 rounded transition-colors text-sm w-full justify-center"
              >
                <MapPin size={16} />
                Detect Current Location Automatically
              </button>
              {autoLocation && (
                <div className="text-xs bg-muted/30 p-3 rounded flex items-start gap-2">
                  <MapPin size={12} className="mt-0.5" />
                  <div>
                    <p className="font-medium">Detected Location:</p>
                    <p className="text-muted-foreground">{autoLocation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border-t pt-6">
            <label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <Image size={16} />
              Restaurant Logo / Profile Image
            </label>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Option 1: Enter URL</p>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Option 2: Upload File</p>
                  <label className="flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded transition-colors cursor-pointer justify-center">
                    <Upload size={16} />
                    Choose Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {(form.imageUrl || uploadedImage) && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={uploadedImage || form.imageUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Invalid Image</div>';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Image will be saved with your profile</p>
                      <p className="text-xs text-muted-foreground">Max size: 5MB, Formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4 py-6 text-lg">
            Create {role === "admin" ? "Admin" : "Super Admin"} Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 pt-6 border-t text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline hover:text-primary/80" to="/admin/login">
            Login here
          </Link>
        </p>

        {/* Demo Info */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>All data is stored locally in your browser for this demo.</p>
          <p>In production, this would connect to a secure backend database.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;