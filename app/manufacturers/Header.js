import manufacturerContext from "@/lib/context/manufacturerContext";
import React, { useContext } from "react";
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const { userDetails, setShowSidebar } = useContext(manufacturerContext);

  return (
    <div className="w-full flex justify-between lg:justify-end px-4 py-1 items-center">
      <button onClick={() => setShowSidebar(true)} className="lg:hidden">
        <RxHamburgerMenu className="text-orange-800 text-2xl" />
      </button>

      {/* <img
        src={userDetails?.userImageLink}
        className="h-[40px] w-auto rounded-full shadow-large border border-gray-500"
      /> */}
    </div>
  );
};

export default Header;
