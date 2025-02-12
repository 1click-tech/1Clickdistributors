"use client";

import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import panelContext from "@/lib/context/panelContext";
import { useQuery } from "@tanstack/react-query";
import PanelSelector from "@/components/homepage/PanelSelector";
import ManageRoles from "@/components/homepage/ManageRoles";
import ManageUsers from "@/components/manageUsers";
import AllocateLeadsPanel from "@/components/allocateLead";
import Sales from "@/components/sales/Sales";
import ServicePanel from "@/components/services/page";
import { panels } from "@/lib/data/commonData";
import GlobalSearch from "@/components/globalSearch";
import Panelsettings from "@/components/panelSettings";
import { AnimatePresence } from "framer-motion";
import Dashboard from "@/components/dashboard";

const Page = () => {
  const [displayComponent, setDisplayComponent] = useState("Manage roles");
  const [userRoles, setuserRoles] = useState(null);
  const [token, setToken] = useState(null);
  const [previousComponent, setPreviousComponent] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(null);

  console.log("header height: ", headerHeight);

  useEffect(() => {
    let userToken = localStorage.getItem("authToken");
    setToken(userToken);
  }, []);

  // get roles of the user
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

  const getAllUserRoles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/roles/getRoles`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.roles) {
        return data?.roles;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  const { data: allUserRoles, error } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllUserRoles,
  });

  useEffect(() => {
    let commonPanels = ["dashboard"];
    if (userDetails?.hierarchy == "superAdmin") {
      let userPanels = panels.map((item) => item.panel);
      setuserRoles([...commonPanels, ...userPanels]);
      return;
    }

    if (userDetails?.hierarchy) {
      let userPanels =
        allUserRoles?.filter((item) => item.id == userDetails?.hierarchy)?.[0]
          ?.panels || [];
      setuserRoles([...commonPanels, ...userPanels]);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userRoles?.length > 0) {
      setDisplayComponent("dashboard");
      // let previousComponent = localStorage.getItem("currentDisplayComponent");
      // if (previousComponent && userRoles.includes(previousComponent)) {
      //   setDisplayComponent(previousComponent);
      // } else {
      //   setDisplayComponent(userRoles[0]);
      // }
    }
  }, [userRoles]);

  return (
    <panelContext.Provider
      value={{
        displayComponent,
        setDisplayComponent,
        userRoles,
        userDetails,
        setPreviousComponent,
        previousComponent,
        allUserRoles,
        showSidebar,
        setShowSidebar,
        headerHeight,
        setHeaderHeight,
      }}
    >
      <div className="w-full h-[100vh] overflow-auto relative">
        <Header />
        <AnimatePresence>{showSidebar && <PanelSelector />}</AnimatePresence>

        {displayComponent == "roles_and_permissions" && <ManageRoles />}
        {displayComponent == "manage_users" && <ManageUsers />}
        {displayComponent == "allocate_leads" && <AllocateLeadsPanel />}
        {displayComponent == "sales_panel" && <Sales />}
        {displayComponent == "service_panel" && <ServicePanel />}
        {displayComponent == "globalSearch" && <GlobalSearch />}
        {displayComponent == "panel_settings" && <Panelsettings />}
        {displayComponent == "dashboard" && <Dashboard />}
      </div>
    </panelContext.Provider>
  );
};

export default Page;
