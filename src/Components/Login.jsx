import { Form, Formik, ErrorMessage, Field } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Slices/userSlice";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import "../static/login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookie] = useCookies(["accessToken"]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(8, "Password should be 8 chars minimum.")
      .required("Password is required"),
  });

  const validate = (values) => {
    let errors = {};
    if (!values.email) {
      errors.email = "Email is Required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
    ) {
      errors.email = "Please enter a valid email";
    }
    return errors;
  };

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("login", values);
      console.log(response.data);

      const data = response.data;
      if (response?.data?.code === 200) {
        setCookie("accessToken", data?.accessToken, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        toast.success(response?.data?.message);
        dispatch(setUser(response.data));
        navigate("/dashboard");
      } else {
        throw { message: response?.data?.message };
      }
    } catch (error) {
      console.log("Api Error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="index-div">
      <div className="main-box">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validate={validate}
          enableReinitialize
        >
          {() => (
            <>
              <div>
                <img
                  className="login-img"
                  src="https://mniladmin.hashtechy.space/static/media/logo.dca4fb32be8888f2e0fe20c4d69b193f.svg"
                  alt=""
                />
              </div>
              <h1 className="login">Login</h1>
              <Form>
                <div>
                  <div className="form-floating mb-3 m_input">
                    <Field
                      type="email"
                      name="email"
                      className="form-control input-login"
                      id="floatingEmail"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="floatingEmail"
                      style={{ top: "1.5px", left: "6px", fontSize: "16px" }}
                    >
                      Email address<span> *</span>
                    </label>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-div"
                    />
                  </div>

                  <div
                    className="form-floating mb-3 m_input"
                    style={{ position: "relative" }}
                  >
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control input-login"
                      id="floatingPassword"
                      placeholder="Password"
                    />

                    <label
                      htmlFor="floatingPassword"
                      style={{ top: "1.5px", left: "6px", fontSize: "16px" }}
                    >
                      Password<span> *</span>
                    </label>
                    <img
                      src="/eye.svg"
                      className="set-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    />

                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-div"
                    />
                  </div>
                </div>

                <div className="forgot-pass">
                  <a href="#">Forgot Password?</a>
                </div>

                <button className="custom-btn" type="submit">
                  Login
                </button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
