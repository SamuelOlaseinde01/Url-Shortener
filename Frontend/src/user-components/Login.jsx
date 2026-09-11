import React from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { login } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const creds = { email, password };
    console.log(creds);
    await login(creds);
    throw redirect("/");
  } catch (err) {
    return err;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const data = useActionData();
  const [isOpen, setIsOpen] = React.useState(true);

  function handleEyeOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>SIGN IN</h2>
        <Form method="post">
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
            {navigation.state === "submitting" ? "SIGNING IN" : "SIGN IN"}
          </button>
        </Form>
        <Link to={"/register"}>Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}
