"use client";

import React from "react";
import { useSelector } from "react-redux";
import Home from "./home";

const page = () => {
  const { authenticated } = useSelector((state) => state.auth);

  if (!authenticated) {
    return (
      <div className="text-xl font-semibold text-gray-400 mt-3 text-center w-full">
        You are not authenticated to use this page
      </div>
    );
  }
  return <Home />;
};

export default page;
