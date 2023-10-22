import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../Firebase";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
function Login() {
  const auth = getAuth();
  const nav = useNavigate();
  const [user, setUser] = useState({
    Phone: "",
    OTP: "",
  });
  let recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: (response) => {},
    "expired-callback": () => {},
  });

  const handlePhoneVerification = (e) => {
    e.preventDefault();

    const phoneNumber = `+91${user.Phone}`;
    const appVerifier = recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log(error, "Error");
      });
  };

  const handleSubmit = () => {
    const code = user.OTP;
    const confirmationResult = window.confirmationResult;

    confirmationResult
      .confirm(code)
      .then((result) => {
        console.log(result, "Result");
        nav("/Dashboard");
      })
      .catch((error) => {
        console.log(error, "Error");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen bg-black w-[1600px]">
        <div className="bg-[#4ed6db] w-[500px] rounded-lg h-auto gap-2">
          <div className="text-black uppercase underline font-bold text-lg text-center">
            User Login
          </div>
          <form
            className="flex flex-col gap-4 p-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col gap-2">
              <label className="font-bold">Phone Number:</label>
              <input
                type="number"
                placeholder="Enter Your Phone Number"
                className="w-full p-2 rounded-lg border-2 border-black"
                onChange={(e) => setUser({ ...user, Phone: e.target.value })}
                required
              />
            </div>
            <button
              className="p-2 bg-black text-white rounded-lg font-bold"
              onClick={handlePhoneVerification()}
            >
              Verify
            </button>
            <div className="flex flex-col gap-2">
              <label className="font-bold">OTP:</label>
              <input
                type="number"
                placeholder="Enter The OTP"
                className="p-2 rounded-lg border-2 border-black"
                onChange={(e) => setUser({ ...user, OTP: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <button className="p-2 bg-black text-white rounded-lg font-bold">
                Login
              </button>
            </div>
            <div className="flex justify-center items-center gap-2">
              Don't have an account?{" "}
              <Link to={"/Register"}>
                <span className="font-bold text-white cursor-pointer hover:scale-105 hover:underline">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
