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
import { handleLogout } from "@/lib/commonFunctions";
import Profile from "@/components/manufacturer/profile";
import manufacturerContext from "@/lib/context/manufacturerContext";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import { IoMdClose } from "react-icons/io";
import LeadsView from "@/components/manufacturer/LeadsView";

const Home = () => {
  const [containerHeight, setContainerHeight] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(true);
  const [mainPanelHeight, setMainPanelHeight] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  // context states
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const check = () => {
      let h = window.innerHeight - 60;
      setMainPanelHeight(h);
      if (window.innerWidth < 1025) {
        setShowSidebar(false);
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

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
      name: "Leads & Enquiries",
      value: "leads&Enquiries",
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
      case "leads&Enquiries":
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

  const getUserDetails = async () => {
    try {
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
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const {
    data: userDetails,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUserDetail"],
    queryFn: getUserDetails,
  });

  return (
    <manufacturerContext.Provider
      value={{ userDetails, setShowSidebar, selectedLead, setSelectedLead }}
    >
      {isLoading ? (
        <div className="w-full mt-5 flex justify-center flex-col items-center">
          <img src="/loader.gif" className="h-12 w-12" />
          <span className="text-gray-500 text-xl">Feching user info...</span>
        </div>
      ) : (
        userDetails && (
          <div
            className={`flex flex-col items-center overflow-hidden bg-blue-100/40 w-full h-screen relative`}
            // className={`flex overflow-hidden relative pl-[45px] sm:pl-[75px] h-screen`}
          >
            <div className="w-full h-[50px] bg-white shadow-md top-0">
              <Header />
            </div>

            <div
              style={{ height: mainPanelHeight }}
              className="w-full xl:w-[95%] flex overflow-auto "
            >
              <div
                className={`${
                  isSmallDevice
                    ? showSidebar
                      ? "w-[250px] fixed top-0 left-0 bg-blue-100/50 backdrop-blur-md"
                      : "w-[0px] fixed top-0 left-0"
                    : "w-[310px] xl:w-[380px] sticky top-0"
                }  flex items-center justify-center overflow-hidden transition-all z-40 h-full`}
              >
                <button
                  className="lg:hidden absolute top-1 right-0 bg-colorPrimary rounded-l-md py-[2px] px-2 text-white flex items-center gap-1"
                  onClick={() => setShowSidebar(false)}
                >
                  <IoMdClose />
                  Close
                </button>
                <div
                  className={`${
                    isSmallDevice
                      ? "w-full h-full py-8"
                      : "w-[95%] xl:w-[85%] h-[90%]"
                  }  transition-all rounded-md p-2 bg-[#00000006] flex flex-col justify-between `}
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
                              expanded
                                ? "text-sm"
                                : "text-[10px] hidden sm:block"
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
                  </div>
                </div>
              </div>

              <div className="w-full h-full flex-col relative">
                <div className="w-full h-full">
                  {selectedPanel == "profile" && <Profile />}
                  {selectedPanel == "leads&Enquiries" && <LeadsView />}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </manufacturerContext.Provider>
  );
};

export default Home;

// fixed top-0 left-0 p-1
