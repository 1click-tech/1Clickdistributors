"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/board");
  }, []);

  return (
    <div>
      <h1 className="text-5xl mt-10 text-center text-slate-500">
        1click distributors panel
      </h1>
    </div>
  );
};

export default page;
