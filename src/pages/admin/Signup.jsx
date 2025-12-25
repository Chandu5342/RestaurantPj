import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MapPin, Upload, Image, ChevronDown, Check, Building, Crown } from "lucide-react";
import { register as apiRegister } from '@/api/authApi';

// Subscription plans data
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹999",
    period: "/month",
    features: [
      "Up to 50 menu items",
      "Basic order management",
      "Table management",
      "Basic reports",
      "Email support"
    ],
    selected: false
  },
  {
    id: "pro",
    name: "Professional",
    price: "₹1,999",
    period: "/month",
    features: [
      "Unlimited menu items",
      "Advanced order management",
      "QR code table management",
      "Advanced analytics & reports",
      "Staff management",
      "Priority email & chat support"
    ],
    selected: true,
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹3,999",
    period: "/month",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "API access",
      "Dedicated account manager",
      "Custom reporting",
      "24/7 phone support",
      "Onboarding assistance"
    ],
    selected: false
  }
];

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    imageUrl: "",
    restaurantName: "",
    subscriptionPlan: "pro"
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [autoLocation, setAutoLocation] = useState("");
  const [subscriptionDropdownOpen, setSubscriptionDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans.find(plan => plan.selected) || subscriptionPlans[1]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Function to handle role change and reset form
  const handleRoleChange = (newRole) => {
    setRole(newRole);

    // Reset all form fields
    setForm({
      name: "",
      email: "",
      password: "",
      location: "",
      imageUrl: "",
      restaurantName: "",
      subscriptionPlan: "pro"
    });

    // Reset other states
    setUploadedImage("");
    setAutoLocation("");
    setSelectedPlan(subscriptionPlans.find(plan => plan.selected) || subscriptionPlans[1]);
    setError("");
    setShowPassword(false);
    setSubscriptionDropdownOpen(false);
  };

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

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setForm(prev => ({ ...prev, subscriptionPlan: plan.id }));
    setSubscriptionDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.email || form.password.length < 6) {
      setError("Please enter valid details. Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
        role: role
      };

      // Only add these fields for admin role
      if (role === 'admin') {
        payload.location = form.location || '';
        payload.restaurantName = form.restaurantName || '';
        payload.subscriptionPlan = form.subscriptionPlan;
      }

      console.log('Registration payload:', payload);

      const data = await apiRegister(payload);

      console.log('Registration response:', data);

      // Clear form after successful submission
      setForm({
        name: "",
        email: "",
        password: "",
        location: "",
        imageUrl: "",
        restaurantName: "",
        subscriptionPlan: "pro"
      });
      setUploadedImage("");
      setAutoLocation("");

      // Show success message and navigate
      if (role === 'admin') {
        alert(`✅ Account created successfully!\n\nYour restaurant "${form.restaurantName}" is now pending approval from Super Admin.\n\nYou will be able to login once your restaurant is approved.`);
      } else {
        alert(`✅ Super Admin account created successfully!\n\nYou can now login with your credentials.`);
      }

      // Navigate to login page
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 border border-gray-200 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
          </div>
          <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            Back to Home
          </Link>
        </div>

        {/* ROLE SELECTION */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-3 text-gray-700">Select Account Type:</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex-1 py-4 rounded-xl border-2 text-center transition-all flex flex-col items-center ${role === "admin"
                ? "bg-primary text-white border-primary shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-gray-50"
                }`}
            >
              <Building className="w-5 h-5 mb-2" />
              Admin
              <p className="text-xs mt-1 opacity-90">Single Restaurant</p>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("super-admin")}
              className={`flex-1 py-4 rounded-xl border-2 text-center transition-all flex flex-col items-center ${role === "super-admin"
                ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:border-purple-500 hover:bg-gray-50"
                }`}
            >
              <Crown className="w-5 h-5 mb-2" />
              Super Admin
              <p className="text-xs mt-1 opacity-90">Multiple Restaurants</p>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 text-gray-900">
          {role === "admin" ? "📋 Admin Registration" : "👑 Super Admin Registration"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info - Show for both roles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Full Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Email Address *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="you@restaurant.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password with Eye Icon - Show for both roles */}
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Password *</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all pr-12"
                placeholder="Minimum 6 characters"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Restaurant Name (for admin only) */}
          {role === "admin" && (
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Restaurant Name</label>
              <input
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="Your Restaurant Name"
                disabled={loading}
              />
            </div>
          )}

          {/* Subscription Plan Selection (for admin only) */}
          {role === "admin" && (
            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-medium mb-3 block text-gray-700">Subscription Plan</label>
              <div className="relative">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-300"
                  onClick={() => !loading && setSubscriptionDropdownOpen(!subscriptionDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">₹</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{selectedPlan.name}</span>
                        {selectedPlan.popular && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedPlan.price}
                        <span className="text-xs ml-1">{selectedPlan.period}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${subscriptionDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {/* Subscription Dropdown */}
                {subscriptionDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold mb-1 text-gray-900">Choose a Plan</h3>
                      <p className="text-xs text-gray-600">Select the plan that fits your restaurant needs</p>
                    </div>

                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${plan.id === selectedPlan.id ? "bg-primary/5" : ""
                          }`}
                        onClick={() => !loading && handlePlanSelect(plan)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                              {plan.popular && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {plan.price}
                              <span className="text-sm text-gray-600 font-normal ml-1">
                                {plan.period}
                              </span>
                            </p>
                          </div>
                          {plan.id === selectedPlan.id && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <ul className="space-y-1.5 mt-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-3.5 h-3.5 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${plan.id === selectedPlan.id
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              !loading && handlePlanSelect(plan);
                            }}
                          >
                            {plan.id === selectedPlan.id ? "Selected" : "Select Plan"}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-gray-50">
                      <div className="text-xs text-gray-600">
                        <p>• All plans include a 14-day free trial</p>
                        <p>• Cancel or upgrade anytime</p>
                        <p>• No setup fees</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Section (for admin only) */}
          {role === "admin" && (
            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-medium mb-3 block flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                Restaurant Location
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  placeholder="Enter restaurant address or location"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm w-full justify-center text-gray-700"
                  disabled={loading}
                >
                  <MapPin size={16} />
                  Detect Current Location Automatically
                </button>
                {autoLocation && (
                  <div className="text-xs bg-blue-50 p-3 rounded-lg flex items-start gap-2 border border-blue-100">
                    <MapPin size={12} className="mt-0.5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Detected Location:</p>
                      <p className="text-blue-700">{autoLocation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="mt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                I agree to the <a href="/terms" className="text-primary hover:underline font-medium">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</a>.
                {role === "admin" && " I understand that my subscription will start with a 14-day free trial."}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full mt-4 py-6 text-lg ${role === "super-admin" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : `Create ${role === "admin" ? `${selectedPlan.name} Plan` : "Super Admin"} Account`}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 pt-6 border-t border-gray-200 text-gray-600">
          Already have an account?{" "}
          <Link className="text-primary underline hover:text-primary/80 font-medium" to="/admin/login">
            Login here
          </Link>
        </p>

        {/* Demo Info */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Backend connected: http://localhost:5000</p>
          <p>Database: MongoDB restaurant_management</p>
        </div>
      </div>

      {/* Subscription dropdown overlay */}
      {subscriptionDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => !loading && setSubscriptionDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Signup;