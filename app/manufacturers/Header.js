import manufacturerContext from "@/lib/context/manufacturerContext";
import Image from "next/image";
import React, { useContext } from "react";
import { FaPhone, FaRegUser } from "react-icons/fa6";
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";
import Tooltip from "@mui/material/Tooltip";

const Header = () => {
  const { userDetails, setShowSidebar } = useContext(manufacturerContext);

  return (
    <div className="w-full flex justify-between  px-4 py-1 items-center">
      <div className="flex items-center gap-2">
        <button onClick={() => setShowSidebar(true)} className="lg:hidden">
          <RxHamburgerMenu className="text-orange-800 text-2xl" />
        </button>
        <Image
          src={"/flatLogo.png"}
          height={40}
          width={150}
          objectFit="cover"
          className="rounded-full shdadow"
        />
      </div>

      <div className="flex items-center gap-5">
        <Tooltip title="Your POC details. tap to call">
          <a
            href={`tel:${userDetails?.serviceExecutivePhone}`}
            className="cursor-pointer flex gap-2 px-3 py-[2px] items-center bg-gray-500/20 rounded-full "
          >
            <Image
              src={userDetails?.serviceExecutiveImage}
              height={40}
              width={40}
              objectFit="cover"
              className="rounded-full shdadow hidden md:block"
            />
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-1">
                <FaRegUser className="text-gray-700 text-xs" />
                <h1 className="text-xs font-semibold text-gray-600">
                  {userDetails?.serviceExecutiveName}
                </h1>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <FaPhone className="text-gray-700 text-" />
                <h1 className=" text-gray-600">
                  {userDetails?.serviceExecutivePhone}
                </h1>
              </div>
            </div>
          </a>
        </Tooltip>

        <div className="hidden md:flex flex-col text-xs items-start font-semibold text-slate-600">
          <span>Hi, Welcome</span>
          <span className="-mt-[2px]">{userDetails?.full_name}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
