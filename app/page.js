"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sendUsersToPages } from "@/lib/commonFunctions";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(false);

  // get roles of the user
  const getUserDetails = async () => {
    try {
      setLoading(true);
      setLoginError(false);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/getUserDetails`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        sendUsersToPages(data.userType, router);
      } else {
        setLoginError(true);
        router.replace("/login");
        return null;
      }
    } catch (error) {
      setLoginError(true);
      console.log("error in getting roles", error.message);
      router.replace("/login");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getUserDetails();
  // }, []);

  // Fetch user roles using react-quer
  // useEffect(() => {
  //   router.push("/board");
  // }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center">
      {loading && (
        <div className="flex flex-col gap-2 items-center mt-5">
          <img src="/loader.gif" className="h-12 w-auto" />
          <p className="text-xl font-semibold text-gray-500">
            Authenticating user please wait
          </p>
        </div>
      )}

      {loginError && (
        <div className="flex flex-col items-center mt-5">
          <img src="/mark.png" className="h-12 w-auto" />
          <p className="text-xl font-semibold text-gray-500 mt-1">
            Oops... We couldn't authenticate you. Please log in again.
          </p>
          <p className="text-sm font-semibold text-gray-500">
            You will be redirected to login page.
          </p>
          <p className="text-sm">or</p>

          <button
            className="text-blue-500 mt-1 underline"
            onClick={() => router.replace("/login")}
          >
            Go to login
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
