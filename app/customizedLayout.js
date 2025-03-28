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
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default CustomizedLayout;
