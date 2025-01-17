import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { FaFilter, FaFirstAid } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import manufacturerContext from "@/lib/context/manufacturerContext";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import LeadDetailView from "./LeadDetailView";
import { vibrantColors } from "@/lib/data/commonData";
import { toast } from "react-toastify";
import AnimatedModal from "../utills/AnimatedModal";
import useModal from "../hooks/useModal";
import { IoMdAdd } from "react-icons/io";

const LeadsView = () => {
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState(null);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 769) {
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };
    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const getLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getAllocatedLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.data) {
        return data?.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      console.log("error in getting roles", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["allocatedLeads"],
    queryFn: getLeads,
  });

  useEffect(() => {
    setLeads(data);
  }, [data]);

  const jumpToPreviousLead = () => {
    let indexOfCurrentLead = leads?.findIndex(
      (item) => item.leadId == selectedLead?.leadId
    );
    if (indexOfCurrentLead != -1) {
      if (indexOfCurrentLead == 0) {
        toast.error("No previous lead found");
      } else {
        setSelectedLead(leads[indexOfCurrentLead - 1]);
      }
    }
  };

  const jumpToNextLead = () => {
    let indexOfCurrentLead = leads?.findIndex(
      (item) => item.leadId == selectedLead?.leadId
    );
    if (indexOfCurrentLead != -1) {
      if (indexOfCurrentLead == leads.length - 1) {
        toast.error("No Next lead found");
      } else {
        setSelectedLead(leads[indexOfCurrentLead + 1]);
      }
    }
  };

  return (
    <div className=" w-full h-full p-2 flex justify-center lg:pt-8">
      <div
        className={`${
          isSmallDevice ? (selectedLead ? "hidden" : "flex w-full") : ""
        } w-full md:w-[42%] xl:w-[35%] h-full flex flex-col gap-2 items-center`}
      >
        {loading && <img src="/loader.gif" className="h-8 w-8" />}

        {Array.isArray(leads) ? (
          leads.length ? (
            <ListView leads={leads} />
          ) : (
            <h1>No leads found</h1>
          )
        ) : null}
      </div>

      <div
        className={`${
          isSmallDevice ? (selectedLead ? "w-full" : "hidden") : ""
        }  md:w-[58%] xl:w-[60%] h-full sticky top-0`}
      >
        {selectedLead && (
          <LeadDetailView
            isSmallDevice={isSmallDevice}
            jumpToPreviousLead={jumpToPreviousLead}
            jumpToNextLead={jumpToNextLead}
          />
        )}
      </div>
    </div>
  );
};

export default LeadsView;

const ListView = ({ leads }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);
  const [showFilters, setShowFilters] = useState(false);
  const { open, close, modalOpen } = useModal();

  let filters = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Read",
      value: "read",
    },
    {
      label: "Unread",
      value: "unread",
    },
    {
      label: "Archived",
      value: "archived",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <AnimatedModal open={open} close={close} modalOpen={modalOpen}>
        <div className="p-3 bg-white">
          <Filters />
        </div>
      </AnimatedModal>

      <div className="w-full flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-700">
          Total Leads ({leads.length})
        </h1>
        <div className="w-full flex items-center gap-3">
          <div className="w-[220px] border flex items-center px-1 justify-between border-orange-400 rounded overflow-hidden h-auto">
            <input
              className="border-none outline-none text-sm bg-transparent text-gray-500 w-[80%] p-1"
              placeholder="Enter to search..."
            />
            <MdSearch className="text-colorPrimary text-2xl cursor-pointer" />
          </div>

          <FaFilter
            data-tooltip-id="filtersBtn"
            data-tooltip-content="Filters"
            className="text-colorPrimary text-[20px] outline-none cursor-pointer"
            onClick={open}
          />

          <Tooltip id="filtersBtn" />
        </div>

        <div className="w-full overflow-auto scrollbar-none flex items-center gap-2 mt-1">
          {filters?.map((item) => {
            return (
              <button
                onClick={() => setSelectedFilter(item.value)}
                className={`px-4 py-1 text-xs border rounded ${
                  selectedFilter == item.value
                    ? "bg-colorPrimary text-white border-colorPrimary"
                    : "bg-transparent text-colorPrimary border-colorPrimary"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 mt-2 w-full overflow-auto py-2 px-3 bg-white rounded-md scrollbar-thin">
        {leads.map((lead, index) => {
          let selected = selectedLead?.leadId == lead.leadId;
          return (
            <div
              onClick={() => setSelectedLead(lead)}
              className={`w-full p-2 border  relative cursor-pointer hover:bg-gray-100/60 rounded-md ${
                selected
                  ? "border-colorPrimary"
                  : "bg-transparent border-gray-400/60"
              }`}
            >
              {selected && (
                <span class="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[8px] border-l-colorPrimary border-t-transparent border-b-transparent"></span>
              )}

              <div className="w-full flex items-center gap-2 px-2">
                <div
                  style={{
                    background: vibrantColors[index % vibrantColors.length],
                  }}
                  className="h-[30px] w-[30px] rounded-full flex items-center justify-center text-white text-[20px]"
                >
                  {lead.full_name?.slice(0, 1)}
                </div>

                <div className="flex flex-col">
                  <span className="text-[13px] leading-[15px] font-semibold text-gray-500">
                    {lead?.full_name || "...."}
                  </span>
                  <span className="flex items-center gap-[1px] text-[11px] leading[12px] text-gray-500">
                    <MdOutlineMailOutline />
                    {lead?.email || "...."}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-start mt-2">
                <p className="text-gray-500 text-[12px] flex items-center gap-1">
                  <CiLocationOn className="text-lg" />
                  <span>{lead.city}, India</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Filters = ({}) => {
  const [expanded, setExpanded] = useState(["locations"]);

  const locations = ["Banglore", "Delhi", "Chennai", "Rishikesh", "Dehradun"];

  const onClickFilter = () => {
    if (expanded?.includes("locations")) {
      setExpanded([]);
    } else {
      setExpanded(["locations"]);
    }
  };

  return (
    <div className="w-[20vw] min-h-[50vh] rounded-md">
      <h1 className="text-gray-500 text-lg font-semibold">Filters</h1>

      <div className="w-full p-2 shadow-large rounded-md transition-all mt-1">
        <div className="flex justify-between items-center">
          <span className="text-base text-gray-600">Location</span>
          <IoMdAdd className="text-xl cursor-pointer" onClick={onClickFilter} />
        </div>

        {expanded?.includes("locations") && (
          <div className="mt-2 flex flex-col gap-1">
            {locations?.map((item) => {
              return (
                <div className="flex gap-3 items-center">
                  <input type="checkbox" className="h-4 w-4 p-1 rounded" />
                  <span className="text-sm text-gray-500">{item}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-full p-2 shadow-large rounded-md transition-all mt-2">
        <div className="flex justify-between items-center">
          <span className="text-base text-gray-600">Source</span>
          <IoMdAdd className="text-xl cursor-pointer" onClick={onClickFilter} />
        </div>
      </div>
    </div>
  );
};
