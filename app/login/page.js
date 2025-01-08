"use client";

import React, { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import {
  MdOutlineMailOutline,
  MdOutlinePassword,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/auth/authReducer";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sendUsersToPages } from "@/lib/commonFunctions";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if credentials are saved in localStorage
    const savedCredentials = JSON.parse(
      localStorage.getItem("rememberMeCredentials")
    );
    if (savedCredentials) {
      setEmail(savedCredentials.email);
      setPassword(savedCredentials.password);
      setRememberMe(true);
    }
  }, []);

  const getLoginPageImage = async () => {
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getLoginPageImageLink`;
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        return data.link;
      } else {
        return null;
      }
    } catch (error) {
      toast.error("Error in getting image link");
    }
  };

  const {
    data: loginPageImage,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["loginPageImage"],
    queryFn: getLoginPageImage,
  });

  const loginUser = async () => {
    try {
      if (!email || email == "" || !password || password == "") {
        return toast.error("Please enter your email and password");
      }

      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/login`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      // console.log("data on login is", data);
      if (data.success && data.token) {
        queryClient.invalidateQueries();
        dispatch(
          login({ email, token: data.token, hierarchy: data.hierarchy })
        );
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("email", email);
        if (rememberMe) {
          // Save credentials to localStorage
          localStorage.setItem(
            "rememberMeCredentials",
            JSON.stringify({ email, password })
          );
        } else {
          // Remove credentials from localStorage if not remembered
          localStorage.removeItem("rememberMeCredentials");
        }
        sendUsersToPages(data.userType, router);
      } else {
        return toast.error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[98vw] h-[100vh] flex items-center justify-center">
      <div className="imgComponent hidden sm:flex items-center justify-center sm:w-[72%] h-full">
        {!isLoading && (
          <div className="w-full h-full aspect-[16/9]">
            <img
              src={loginPageImage || "/loginbg.jpg"}
              alt="Login Background"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex relative justify-center sm:justify-start h-full items-center w-full sm:w-[28%] px-2 md:px-4">
        {/* <div className="w-full"> */}
        {/* </div>\  */}
        <div className="flex relative flex-col items-center justify-start w-full bg-white">
          <img
            src="/expendico.png"
            className="w-80 h-auto object-contain filter mb-4 lg:mb-10"
          />
          <h2 className="text-lg lg:text-[1.2rem] xl:text-[1.5rem] text-black">
            Welcome to 1Clickdistributors
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-2 font-semibold">
            &ldquo;Today is your best Day&rdquo;
          </p>

          <form action={"#"} className="w-full mt-4 md:mt-12">
            <input
              type="email"
              placeholder="Enter Email"
              name="current-password"
              autocomplete="current-password"
              required={true}
              className="w-full p-2 bg-transparent border-2 rounded-md border-gray-200 focus:outline-none focus:border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex flex-col w-full mt-6">
              <div className="flex justify-between items-center bg-transparent border-2 rounded-md border-gray-200 focus:border-gray-300">
                <input
                  type={showPassword ? "text" : "password"}
                  required={true}
                  name="password"
                  placeholder="Enter Password"
                  autocomplete="password"
                  className="w-full p-2 bg-transparent focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(false)}
                    className="text-slate-600 cursor-pointer mr-2"
                  />
                ) : (
                  <MdOutlineRemoveRedEye
                    onClick={() => setShowPassword(true)}
                    className="text-slate-600 cursor-pointer mr-2"
                  />
                )}
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between w-full mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 accent-blue-600"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-500">
                  Remember Me
                </label>
              </div>
              <Link
                href={`/reset-password`}
                className="text-xs font-semibold text-blue-600"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              onClick={loginUser}
              disabled={loading}
              className={`w-full bg-[#4a90e2] disabled:bg-blue-600/25 text-white p-2 rounded-md mt-8 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* image component */}
        {/* <div className="hidden md:flex flex-col justify-center p-8">
          <h1 className="text-slate-700 font-bold text-2xl">
            1Clickdistributors Panel Login
          </h1>
          <p className="text-slate-500 text-base">
            Enter your login credentials to access your account
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default page;
