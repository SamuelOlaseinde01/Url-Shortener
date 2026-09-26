import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Link2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { claimStoredGuestUrls, login } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const creds = { email, password };
    await login(creds);
    await claimStoredGuestUrls();
    return redirect("/");
  } catch (err) {
    return {
      message: err.message || "Failed to log in",
      field: err.field || "generic",
    };
  }
}

export default function Login() {
  const navigation = useNavigation();
  const data = useActionData();
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";
  const generalError =
    data?.message && (data?.field === "generic" || !data?.field);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* Brand & Logo */}
        <div className="auth-brand-header">
          <Link to="/" className="auth-brand-logo">
            <div className="brand-icon-box">
              <Link2 size={20} />
            </div>
            <span>ClipLink</span>
          </Link>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>Welcome back</h2>
            <p>Sign in to your account to manage your links and analytics</p>
          </div>

          {generalError && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{data.message}</span>
            </div>
          )}

          <Form method="post" className="auth-form">
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="email">
                Email Address
              </label>
              <div
                className={`auth-input-wrapper ${
                  data?.field === "email" ? "has-error" : ""
                }`}
              >
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>
              {data?.message && data?.field === "email" && (
                <p className="auth-field-error">{data.message}</p>
              )}
            </div>

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <div
                className={`auth-input-wrapper ${
                  data?.field === "password" ? "has-error" : ""
                }`}
              >
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {data?.message && data?.field === "password" && (
                <p className="auth-field-error">{data.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="auth-primary-btn"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </Form>

          <div className="auth-card-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-bottom-nav">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={14} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
