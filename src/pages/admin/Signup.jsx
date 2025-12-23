// src/pages/admin/Signup.jsx - UPDATED WITH PLANS DROPDOWN
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MapPin, Upload, Image, Building, User, Check, IndianRupee } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    location: "",
    imageUrl: "",
    plan: "Starter" // Default plan
  });
  const [superAdminForm, setSuperAdminForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [autoLocation, setAutoLocation] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch plans from backend
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);

        // Set default plan if available
        if (data.length > 0 && !adminForm.plan) {
          const defaultPlan = data.find(p => p.name === "Starter") || data[0];
          setAdminForm(prev => ({ ...prev, plan: defaultPlan.name }));
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      // Fallback plans
      setPlans([
        { name: "Starter", price: "₹999/month", features: ["Basic Menu", "10 Tables", "Email Support"] },
        { name: "Pro", price: "₹2,499/month", features: ["Unlimited Menu", "50 Tables", "Priority Support", "Analytics"] },
        { name: "Business", price: "₹4,999/month", features: ["Everything in Pro", "Multi-location", "API Access"] },
        { name: "Enterprise", price: "₹12,999/month", features: ["Custom Solutions", "Dedicated Support", "White Label"] }
      ]);
    }
  };

  const handleAdminChange = (e) =>
    setAdminForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSuperAdminChange = (e) =>
    setSuperAdminForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationStr = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
          setAutoLocation(locationStr);
          setAdminForm(prev => ({ ...prev, location: locationStr }));
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
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAdminForm = () => {
    if (!adminForm.name || !adminForm.email || adminForm.password.length < 6 || !adminForm.restaurantName) {
      setError("Please fill all required fields. Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const validateSuperAdminForm = () => {
    if (!superAdminForm.name || !superAdminForm.email || superAdminForm.password.length < 6) {
      setError("Please fill all required fields. Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateAdminForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: adminForm.name,
          email: adminForm.email,
          password: adminForm.password,
          restaurantName: adminForm.restaurantName,
          location: adminForm.location,
          profileImage: uploadedImage || adminForm.imageUrl,
          plan: adminForm.plan
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(`Registration successful! Your account is pending approval from super admin. You will receive an email when approved.`);

      // Clear form
      setAdminForm({
        name: "",
        email: "",
        password: "",
        restaurantName: "",
        location: "",
        imageUrl: "",
        plan: "Starter"
      });
      setUploadedImage("");

      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/admin/login");
      }, 3000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateSuperAdminForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: superAdminForm.name,
          email: superAdminForm.email,
          password: superAdminForm.password,
          role: 'super-admin'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert(`Super Admin account created successfully!`);
      navigate("/admin/login", { replace: true });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = role === "admin" ? handleAdminSubmit : handleSuperAdminSubmit;

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
              <div className="flex flex-col items-center">
                <Building size={20} className="mb-1" />
                <span>Admin</span>
                <p className="text-xs mt-1 opacity-80">Single Restaurant</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("super-admin")}
              className={`flex-1 py-3 rounded-lg border-2 text-center transition-all ${role === "super-admin"
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
            >
              <div className="flex flex-col items-center">
                <User size={20} className="mb-1" />
                <span>Super Admin</span>
                <p className="text-xs mt-1 opacity-80">Multiple Restaurants</p>
              </div>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 pb-2 border-b">
          {role === "admin" ? (
            <span className="flex items-center gap-2">
              <Building size={20} />
              Admin Registration
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <User size={20} />
              Super Admin Registration
            </span>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields for Both Roles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <input
                name="name"
                value={role === "admin" ? adminForm.name : superAdminForm.name}
                onChange={role === "admin" ? handleAdminChange : handleSuperAdminChange}
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
                value={role === "admin" ? adminForm.email : superAdminForm.email}
                onChange={role === "admin" ? handleAdminChange : handleSuperAdminChange}
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
                value={role === "admin" ? adminForm.password : superAdminForm.password}
                onChange={role === "admin" ? handleAdminChange : handleSuperAdminChange}
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

          {/* ADMIN ONLY FIELDS */}
          {role === "admin" && (
            <>
              {/* Restaurant Name */}
              <div className="border-t pt-6">
                <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Building size={16} />
                  Restaurant Information
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Restaurant Name *</label>
                    <input
                      name="restaurantName"
                      value={adminForm.restaurantName}
                      onChange={handleAdminChange}
                      className="input-field w-full"
                      placeholder="Enter your restaurant name"
                      required
                    />
                  </div>

                  {/* Subscription Plan Dropdown */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <IndianRupee size={16} />
                      Subscription Plan *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {plans.map((plan) => (
                        <button
                          key={plan.name}
                          type="button"
                          onClick={() => setAdminForm(prev => ({ ...prev, plan: plan.name }))}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${adminForm.plan === plan.name
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-background border-border hover:border-primary/30"
                            }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-sm mt-1">{plan.price}</span>
                            {adminForm.plan === plan.name && (
                              <Check size={16} className="mt-2 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Plan Features Preview */}
                    {plans.find(p => p.name === adminForm.plan) && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm font-medium mb-2">Features included:</p>
                        <ul className="text-xs space-y-1">
                          {plans.find(p => p.name === adminForm.plan).features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check size={12} className="text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
                    value={adminForm.location}
                    onChange={handleAdminChange}
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
                        value={adminForm.imageUrl}
                        onChange={handleAdminChange}
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
                  {(adminForm.imageUrl || uploadedImage) && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted/30">
                          <img
                            src={uploadedImage || adminForm.imageUrl}
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
            </>
          )}

          {/* SUPER ADMIN ONLY INFO */}
          {role === "super-admin" && (
            <div className="border-t pt-6">
              <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                <User size={16} />
                Super Admin Information
              </label>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Super Admin Account Features:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Manage multiple restaurants and their admins</li>
                    <li>• Oversee all restaurant operations</li>
                    <li>• Access to analytics across all locations</li>
                    <li>• Create and assign admin accounts</li>
                    <li>• Approve pending restaurant registrations</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Additional restaurant details can be added later when you create individual restaurant admin accounts.
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              <p className="font-medium">Success!</p>
              <p>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-4 py-6 text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : role === "admin" ? (
              <span>Register Restaurant Account</span>
            ) : (
              <span>Create Super Admin Account</span>
            )}
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
          <p>Admin accounts require super admin approval before login.</p>
          <p>Super admin accounts are created immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;