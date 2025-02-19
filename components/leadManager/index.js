import React, { useState } from "react";
import Modal from "../utills/Modal";
import CallDetails from "./CallDetails";
import BusinessDetails from "./BusinessDetails";
import ContactDetails from "./ContactDetails";
import ActivityHistory from "./ActivityHistory";
import ProductDetails from "./ProductDetails";
import ContractDetails from "./ContractDetails";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineClose } from "react-icons/ai";

const tabs = [
  "Contact Details",
  "Business Details",
  "Activity History",
  "Product Details",
  "Contract Details",
];

export default function LeadManager({
  onClose,
  lead,
  goToPreviousLead,
  goToNextLead,
  currentLeadIndex,
  totalLeads,
}) {
  const { leadId } = lead;

  const getLeadDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeadDetails`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leadId }),
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      } else {
        toast.error(result.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["fetchLeadDetails", leadId],
    queryFn: getLeadDetails,
  });

  return (
    <Modal>
      <div className="w-screen h-screen p-4 flex">
        <div className="bg-slate-50 w-full px-4 pb-4 pt-8 overflow-hidden relative rounded">
          {/* <button
            className="absolute right-20 top-0 text-gray-800 text-sm px-3 py-1"
            onClick={refetch}
          >
            refetch
          </button> */}
          <div className="absolute right-0 top-1 flex flex-row">
            <div className="flex flex-row gap-2 ml-4">
              <button
                onClick={goToPreviousLead}
                disabled={currentLeadIndex === 0}
                className={`px-3 py-1 bg-slate-200 text-blue-500 ${
                  currentLeadIndex > 0 && "hover:text-blue-600"
                } text-sm font-medium ${
                  currentLeadIndex > 0 && "hover:bg-slate-300"
                } ${currentLeadIndex === 0 ? "opacity-60" : "opacity-100"}`}
              >
                Back
              </button>
              <button
                onClick={goToNextLead}
                disabled={currentLeadIndex === totalLeads - 1}
                className={`px-3 py-1 bg-slate-200 text-blue-500 ${
                  currentLeadIndex < totalLeads && "hover:text-blue-600"
                } text-sm font-medium ${
                  currentLeadIndex < totalLeads && "hover:bg-slate-300"
                } ${
                  currentLeadIndex === totalLeads - 1
                    ? "opacity-60"
                    : "opacity-100"
                }`}
              >
                Next
              </button>
            </div>
            <button className="px-3 py-1 group" onClick={onClose}>
              <AiOutlineClose className="text-lg text-gray-500 group-hover:text-gray-600" />
            </button>
          </div>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/loader.gif"
                className="h-[60px] w-auto"
                alt="loading"
              />
            </div>
          ) : (
            <div className="w-full h-full flex gap-2 mt-2">
              {/* call details */}
              <CallDetails
                data={data}
                onClose={onClose}
                refetchLead={refetch}
              />
              {/* Tabs */}
              <div className="bg-white flex flex-1 border border-gray-200">
                <Tabs data={data} refetch={refetch} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

const Tabs = ({ data, refetch }) => {
  const [currentTab, setCurrentTab] = useState("Contact Details");

  const renderTab = (tab) => {
    switch (tab) {
      case "Business Details":
        return <BusinessDetails data={data} refetch={refetch} />;
      case "Contact Details":
        return <ContactDetails data={data} refetch={refetch} />;
      case "Activity History":
        return <ActivityHistory data={data} refetch={refetch} />;
      case "Product Details":
        return <ProductDetails data={data} refetch={refetch} />;
      case "Contract Details":
        return <ContractDetails data={data} refetch={refetch} />;
    }
  };

  const handleTabs = (t) => setCurrentTab(t);

  return (
    <div className="w-full flex flex-col">
      <div className="flex">
        {tabs.map((tab) => {
          return (
            <div key={tab} className="relative hover:bg-gray-100">
              <button
                className={`p-3 ${
                  tab === currentTab ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => handleTabs(tab)}
              >
                {tab}
              </button>
              <div
                className={`absolute left-0 right-0 bottom-0 h-0 border ${
                  tab === currentTab ? "border-blue-600" : "border-transparent"
                }`}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex-1 overflow-auto relative">
        <div className="w-full">{renderTab(currentTab)}</div>
      </div>
    </div>
  );
};
