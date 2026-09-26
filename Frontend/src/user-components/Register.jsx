import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
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
import { register } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const cpassword = formData.get("cpassword");

    if (password !== cpassword) {
      const error = new Error("Passwords do not match.");
      error.field = "cpassword";
      throw error;
    }
    const creds = {
      firstName,
      lastName,
      email,
      password,
    };
    await register(creds);
    return redirect("/login");
  } catch (error) {
    return {
      message: error.message || "Registration failed",
      field: error.field || "generic",
    };
  }
}

export default function Register() {
  const data = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <h2>Create an account</h2>
            <p>Get permanent links, custom aliases, and detailed analytics</p>
          </div>

          {generalError && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{data.message}</span>
            </div>
          )}

          <Form method="post" className="auth-form">
            <div className="auth-name-grid">
              <div className="auth-field-group">
                <label className="auth-label" htmlFor="firstName">
                  First Name
                </label>
                <div
                  className={`auth-input-wrapper ${
                    data?.field === "firstName" ? "has-error" : ""
                  }`}
                >
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    required
                    autoComplete="given-name"
                    className="auth-input"
                  />
                </div>
                {data?.message && data?.field === "firstName" && (
                  <p className="auth-field-error">{data.message}</p>
                )}
              </div>

              <div className="auth-field-group">
                <label className="auth-label" htmlFor="lastName">
                  Last Name
                </label>
                <div
                  className={`auth-input-wrapper ${
                    data?.field === "lastName" ? "has-error" : ""
                  }`}
                >
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                    className="auth-input"
                  />
                </div>
                {data?.message && data?.field === "lastName" && (
                  <p className="auth-field-error">{data.message}</p>
                )}
              </div>
            </div>

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
                  placeholder="Create a strong password (min 8 chars)"
                  required
                  minLength={8}
                  autoComplete="new-password"
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

            <div className="auth-field-group">
              <label className="auth-label" htmlFor="cpassword">
                Confirm Password
              </label>
              <div
                className={`auth-input-wrapper ${
                  data?.field === "cpassword" ? "has-error" : ""
                }`}
              >
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="cpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="cpassword"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="auth-eye-btn"
                  title={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {data?.message && data?.field === "cpassword" && (
                <p className="auth-field-error">{data.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="auth-primary-btn"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </Form>

          <div className="auth-card-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
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
