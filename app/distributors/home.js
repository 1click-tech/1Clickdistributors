import React, { useEffect, useState } from "react";
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { GoDatabase } from "react-icons/go";
import { IoPeople } from "react-icons/io5";
import { LuBadgeDollarSign } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { logout } from "@/store/auth/authReducer";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleLogout } from "@/lib/commonFunctions";

const Home = () => {
  const [containerHeight, setContainerHeight] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const panels = [
    {
      name: "Profile",
      value: "profile",
    },
    {
      name: "Dashboard",
      value: "dashboard",
    },
    {
      name: "New leads",
      value: "new_Leads",
    },
    {
      name: "My allocations",
      value: "my_allocations",
    },
    {
      name: "Deals",
      value: "deals",
    },
  ];

  useEffect(() => {
    setContainerHeight(window.innerHeight);
    let previousOpenedPanel = localStorage.getItem("currentDisplayComponent");
    if (
      previousOpenedPanel &&
      panels.find((e) => e.value == previousOpenedPanel)
    ) {
      setSelectedPanel(previousOpenedPanel);
    } else {
      setSelectedPanel("profile");
    }
  }, []);

  const getIcon = (panel) => {
    const iconStyle = `text-2xl text-orange-700`;
    switch (panel) {
      case "profile":
        return <CgProfile className={`${iconStyle}`} />;
      case "dashboard":
        return <RxDashboard className={`${iconStyle}`} />;
      case "my_allocations":
        return <GoDatabase className={`${iconStyle}`} />;
      case "new_Leads":
        return <IoPeople className={`${iconStyle}`} />;
      case "deals":
        return <LuBadgeDollarSign className={`${iconStyle}`} />;
    }
  };

  const onLogOut = () => {
    handleLogout({ dispatch, router });
  };

  const onSelectPanel = (panel) => {
    setSelectedPanel(panel);
    localStorage.setItem("currentDisplayComponent", panel);
  };

  return (
    <div
      // style={{
      //   height: window.innerHeight,
      //   width: window.innerWidth,
      // }}
      className={`flex overflow-hidden relative pl-[45px] sm:pl-[75px] h-screen`}
    >
      <div
        className={`${
          expanded ? "w-[250px] backdrop-blur-md" : "w-[40px] sm:w-[70px]"
        } transition-all h-screen z-20 bg-[#00000012] flex flex-col justify-between fixed top-0 left-0 p-1`}
      >
        <div className="w-full flex flex-col gap-3 mt-4">
          {panels?.map((item) => {
            return (
              <div
                onClick={() => onSelectPanel(item.value)}
                className={`w-full overflow-hidden flex  cursor-pointer transition-all hover:bg-white py-2 px-1 rounded-md  ${
                  expanded
                    ? "justify-start gap-3 items-center"
                    : "flex-col items-center delay-150"
                } ${
                  selectedPanel == item.value
                    ? "bg-white hover:bg-gray-400"
                    : ""
                }`}
              >
                {getIcon(item.value)}
                <span
                  className={`${
                    expanded ? "text-sm" : "text-[10px] hidden sm:block"
                  } text-center text-wrap text-orange-900 font-semibold mt-1 transition-all`}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col gap-2 items-center">
          <div
            onClick={onLogOut}
            className={`w-full overflow-hidden flex  cursor-pointer transition-all bg-white hover:bg-gray-200 py-2 px-1 rounded-md  ${
              expanded
                ? "justify-start gap-3 items-center"
                : "flex-col items-center delay-150"
            }`}
          >
            <IoIosLogOut className="text-2xl text-orange-700" />
            <span
              className={`${
                expanded ? "text-sm" : "text-[10px] hidden sm:block"
              } text-center text-wrap text-orange-900 font-semibold mt-1 transition-all`}
            >
              Logout
            </span>
          </div>
          {/* <img src="/expendico.png" /> */}
        </div>
      </div>

      <div className="w-full h-full overflow-auto flex flex-1 flex-col relative">
        <RxHamburgerMenu
          className="text-2xl text-blue-900 cursor-pointer absolute top-3 right-3"
          onClick={() => setExpanded(!expanded)}
        />

        <div className="w-full h-full">
          <h1 className="text-gray-700 text-2xl text-center">Distributor Panel</h1>
          {selectedPanel == "profile"}
        </div>
      </div>
    </div>
  );
};

export default Home;
