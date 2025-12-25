import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { login, forgotPassword } from "@/api/authApi";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.email || form.password.length < 6) {
      setError("Please provide valid credentials (password min 6 chars).");
      setLoading(false);
      return;
    }

    try {
      const data = await login({
        email: form.email.toLowerCase(),
        password: form.password
      });

      console.log('Login response:', data);

      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.data.user));

      // FIX: Proper role-based routing
      if (data.data.user?.role === 'super-admin') {
        console.log('Redirecting to Super Admin...');
        navigate('/super-admin', { replace: true });
      } else if (data.data.user?.role === 'admin') {
        console.log('Redirecting to Admin...');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!forgotEmail) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword(forgotEmail);
      setSuccess(`Password reset instructions have been sent to ${forgotEmail}.`);

      setForgotEmail("");
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow relative">
        {/* Back to Login button */}
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:text-primary/80 underline"
                  disabled={loading}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/admin/signup" className="text-primary underline hover:text-primary/80">
                Create one
              </Link>
            </div>

            {/* Debug info */}
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Test Credentials:</p>
              <p>Super Admin: superadmin@restaurant.com / Admin@123</p>
              <p>Admin: owner@test.com / password123 (after approval)</p>
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
                  disabled={loading}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;