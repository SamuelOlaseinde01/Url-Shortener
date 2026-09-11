import React from "react";
import { Eye, EyeClosed, EyeOff, Lock, Mail, User } from "lucide-react";
import { Form, Link } from "react-router";

export default function Register() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCpOpen, setIsCpOpen] = React.useState(false);

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
          <div className="input-container">
            <User fill="#000000" size={17} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
            />
          </div>
          <div className="input-container">
            <User size={17} fill="#000000" />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
            />
          </div>
          <div className="input-container">
            <Mail size={17} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
          </div>
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
                <EyeOff size={17} cursor={"pointer"} onClick={handleEyeOpen} />
              ) : (
                <Eye size={17} cursor={"pointer"} onClick={handleEyeOpen} />
              )}
            </div>
          </div>
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
          <button>SIGN UP</button>
        </Form>
        <Link to={"/login"}>Already have an account? Login here</Link>
      </div>
    </div>
  );
}
