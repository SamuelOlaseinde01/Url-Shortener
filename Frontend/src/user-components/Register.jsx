import React from "react";
import { Eye, EyeClosed, EyeOff, Lock, Mail, User } from "lucide-react";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { register } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const cpassword = formData.get("cpassword");
    if (password != cpassword) {
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
    const data = await register(creds);
    return data;
  } catch (error) {
    return error;
  }
}

export default function Register() {
  const data = useActionData();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = React.useState(true);
  const [isCpOpen, setIsCpOpen] = React.useState(true);

  function handleEyeOpen() {
    setIsOpen(!isOpen);
  }

  function handleCpEyeOpen() {
    setIsCpOpen(!isCpOpen);
  }

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2>SIGN UP</h2>
        <Form method="post">
          <div className="input-error-container">
            <div className="input-container">
              <User fill="#000000" size={17} />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
              />
            </div>
            {data?.message && data?.field === "firstName" && (
              <p className="error-text">{data?.message}</p>
            )}
          </div>
          <div className="input-error-container">
            <div className="input-container">
              <User size={17} fill="#000000" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
              />
            </div>
            {data?.message && data?.field === "lastName" && (
              <p className="error-text">{data?.message}</p>
            )}
          </div>
          <div className="input-error-container">
            <div className="input-container">
              <Mail size={17} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
            </div>
            {data?.message && data?.field === "email" && (
              <p className="error-text">{data?.message}</p>
            )}
          </div>
          <div className="input-error-container">
            <div className="input-container">
              <div className="lock">
                <Lock size={17} />
              </div>
              <input
                type={isOpen ? "password" : "text"}
                name="password"
                placeholder="Password"
                required
              />
              <div className="eye">
                {isOpen ? (
                  <EyeOff
                    size={17}
                    cursor={"pointer"}
                    onClick={handleEyeOpen}
                  />
                ) : (
                  <Eye size={17} cursor={"pointer"} onClick={handleEyeOpen} />
                )}
              </div>
            </div>
            {data?.message && data?.field === "password" && (
              <p className="error-text">{data?.message}</p>
            )}
          </div>
          <div className="input-error-container">
            <div className="input-container">
              <div className="lock">
                <Lock size={17} />
              </div>
              <input
                type={isCpOpen ? "password" : "text"}
                name="cpassword"
                placeholder="Confirm Password"
                required
              />
              <div className="eye">
                {isCpOpen ? (
                  <EyeOff
                    size={17}
                    cursor={"pointer"}
                    onClick={handleCpEyeOpen}
                  />
                ) : (
                  <Eye size={17} cursor={"pointer"} onClick={handleCpEyeOpen} />
                )}
              </div>
            </div>
            {data?.message && data?.field === "cpassword" && (
              <p className="error-text">{data?.message}</p>
            )}
            {data?.message && !data?.field === "cpassword" && (
              <p
                className={
                  data?.message === "Failed to fetch"
                    ? "error-text"
                    : "success-text"
                }
              >
                {data?.message}
              </p>
            )}
          </div>
          <button
            className={
              navigation.state === "submitting"
                ? "auth-submitting-btn"
                : "auth-submit-btn"
            }
          >
            {navigation.state === "submitting" ? "SIGNING UP" : "SIGN UP"}
          </button>
        </Form>
        <Link to={"/login"}>Already have an account? Login here</Link>
      </div>
    </div>
  );
}
