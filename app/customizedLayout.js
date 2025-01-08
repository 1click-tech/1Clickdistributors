"use client";
import { checkAuthStatus } from "@/store/auth/authReducer";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CustomizedLayout = ({ children }) => {
  const data = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkAuthStatus({ router, toast }));
  }, []);

  if (data.authenticationLoading) {
    return (
      <div className="w-full flex flex-col items-center mt-3 gap-1">
        <img src="/loader.gif" className="h-12 w-12" />
        <p className="text-xl font-semibold text-gray-500">
          Authenticating user please wait
        </p>
      </div>
    );
  }
  
  return <div>{children}</div>;
};

export default CustomizedLayout;
