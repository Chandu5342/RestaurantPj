// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { login as apiLogin } from "@/api/authApi";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || form.password.length < 6) {
      setError("Please provide valid credentials (password min 6 chars).");
      return;
    }

    try {
      const data = await apiLogin({ email: form.email.toLowerCase(), password: form.password });

      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.user));

      if (data.user?.role === 'super-admin') {
        navigate('/super-admin', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed, please try again');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail) {
      setError("Please enter your email address.");
      return;
    }

    // Demo: in production, this would call backend to send reset email
    setSuccess(`Password reset instructions have been sent to ${forgotEmail}. 
                Check your email (in this demo, check the console).`);

    console.log(`Password reset link for ${forgotEmail}: http://localhost:3000/admin/reset-password?token=demo&email=${forgotEmail}`);

    setForgotEmail("");
    setTimeout(() => {
      setShowForgotPassword(false);
    }, 3000);
  };

  // resetPassword is demo-only and handled by backend in production

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow relative">

        {/* Back to Login button (only visible in forgot password mode) */}
        {showForgotPassword && (
          <button
            onClick={() => setShowForgotPassword(false)}
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {showForgotPassword ? "Reset Password" : "Login"}
          </h2>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Home
          </Link>
        </div>

        {!showForgotPassword ? (
          // LOGIN FORM
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
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

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Lock size={16} />
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="input-field w-full pr-10"
                    placeholder="Enter your password"
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Forgot your password?
                </button>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-success/10 border border-success/20 rounded text-success text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>

            <div className="mt-6 text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/admin/signup" className="text-primary underline hover:text-primary/80">
                Create one
              </Link>
            </div>
          </>
        ) : (
          // FORGOT PASSWORD FORM
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Mail size={16} />
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field w-full"
                  placeholder="you@restaurant.com"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-success/10 border border-success/20 rounded text-success text-sm">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full">
                Send Reset Instructions
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mt-4">
                  <strong>Demo Note:</strong> In production, this would send a real email.
                  For this demo, check your browser console for the reset link.
                </p>
              </div>
            </form>

            {/* Demo Reset Section */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Demo Reset Feature:</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Since this is a demo without email service, you can manually reset any user's password:
              </p>
              <div className="text-xs space-y-1">
                <p>1. Go to browser console (F12)</p>
                <p>2. Copy the reset link from console</p>
                <p>3. Or create a new account if needed</p>
              </div>
            </div>
          </>
        )}

        {/* Password Tips */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Security Tip:</strong> Use a strong password with at least 8 characters,
            including letters, numbers, and symbols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;