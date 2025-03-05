import manufacturerContext from "@/lib/context/manufacturerContext";
import { dispositions, vibrantColors } from "@/lib/data/commonData";
import React, { useContext, useEffect, useState } from "react";
import { IoArchiveOutline, IoCallOutline } from "react-icons/io5";

import {
  MdArrowBack,
  MdArrowForward,
  MdEdit,
  MdOutlineMailOutline,
  MdOutlineUnarchive,
} from "react-icons/md";
import AnimatedModal from "../utills/AnimatedModal";
import useModal from "../hooks/useModal";
import CustomSelector from "../uiCompoents/CustomSelector";
import { FaNetworkWired } from "react-icons/fa6";
import { CustomTextarea } from "../uiCompoents/CustomInput";
import UpdatesList from "./UpdatesList";
import { toast } from "react-toastify";
import {
  service_manufacturer_dispositions,
  service_manufacturer_subDispositions,
} from "../../lib/data/commonData";
import { useQueryClient } from "@tanstack/react-query";
import { formatValue } from "@/lib/commonFunctions";
import Tooltip from "@mui/material/Tooltip";

const LeadDetailView = ({
  isSmallDevice,
  jumpToPreviousLead,
  jumpToNextLead,
}) => {
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);
  const { open, close, modalOpen } = useModal();
  const [updateLoading, setUpdateLoading] = useState(false);
  const queryClient = useQueryClient();
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    const handleBackButton = (event) => {
      console.log("Back button pressed!");

      if (isSmallDevice) {
        // Handle back button logic for small devices
        closeCurrentComponent();

        // Push the state back to prevent navigation
        window.history.pushState(null, "", window.location.href);
      } else {
        // Let the default browser behavior happen
        console.log("Default back navigation for non-small devices");
      }
    };

    const closeCurrentComponent = () => {
      if (isSmallDevice) {
        setSelectedLead(null); // Your logic for small devices
      }
    };

    if (isSmallDevice) {
      // Push a dummy state only for small devices
      window.history.pushState(null, "", window.location.href);
    }

    // Attach the event listener
    window.addEventListener("popstate", handleBackButton);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isSmallDevice]);

  const rowStyle =
    "w-full flex sm:justify-between gap-1 sm:gap-0 text-sm flex-col sm:flex-row";
  const boxStyle =
    "w-full sm:w-[49%] h-auto flex gap-2 sm:gap-1 justify-start sm:justify-between";
  const keyStyle = "w-auto font-semibold text-gray-600";
  const valueStyle = "flex-1 break-words text-gray-500";

  const updateArchiveStatusOfLead = async (updateTo) => {
    try {
      console.log("selectedLead", selectedLead);
      setArchiveLoading(true);
      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/updateArchiveStatusOfLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceDocId: selectedLead?.serviceDocId,
          archived: updateTo,
        }),
      });

      let data = await response.json();
      if (!data.success) {
        return toast.error(data.message || "Something went wrong");
      }
      toast.success("Archive status udpated successfully");
      queryClient.invalidateQueries(["allocatedLeads"]);
    } catch (error) {
      console.log("error in updateArchiveStatusOfLead", error.message);
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-2 lg:pt-5">
      <AnimatedModal open={open} close={close} modalOpen={modalOpen}>
        <div className="min-w-[20vw] min-h-[50vh] bg-white rounded-md p-4">
          <UpdateLeadModal
            updateLoading={updateLoading}
            setUpdateLoading={setUpdateLoading}
            close={close}
          />
        </div>
      </AnimatedModal>

      <div className="w-full h-full rounded-md bg-white rounded-t-2xl overflow-hidden">
        <div className="h-[10%] bg-gradient-to-r from-[#cc6f11] to-[#cd4030] p-1 pt-3 flex flex-col items-center">
          <div className="flex justify-between px-1 border-b border-orange-800/30 pb-2 w-[98%]">
            <div className="gap-2 flex items-center">
              <MdArrowBack
                className="text-3xl md:hidden text-white"
                onClick={() => setSelectedLead(null)}
              />

              <button
                onClick={() => open()}
                className="text-orange-800 bg-white py-1 px-3 rounded"
              >
                Update Status
              </button>

              {archiveLoading ? (
                <img src="/loader.gif" className="h-4 w-4" />
              ) : !selectedLead?.archived ? (
                <Tooltip title="Archive" placement="top">
                  <span>
                    <IoArchiveOutline
                      onClick={() => updateArchiveStatusOfLead(true)}
                      className="text-xl text-white cursor-pointer"
                    />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Unarchive" placement="top">
                  <span>
                    <MdOutlineUnarchive
                      onClick={() => updateArchiveStatusOfLead(false)}
                      className="text-xl text-white cursor-pointer"
                    />
                  </span>
                </Tooltip>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={jumpToPreviousLead}
                className="w-fit px-3 py-1 text-white bg-transparent border border-white/70 rounded hover:bg-white/10 flex items-center gap-1"
              >
                <MdArrowBack />
                Previous
              </button>
              <button
                onClick={jumpToNextLead}
                className="w-fit px-3 py-1 text-white bg-transparent border border-white/70 rounded hover:bg-white/10 flex items-center gap-1"
              >
                Next
                <MdArrowForward />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[90%] flex-1 w-full p-2 flex-col overflow-auto">
          <div className="w-full flex justify-between mt-3">
            <div className="w-[48%] h-[120px] rounded-md bg-gradient-to-r from-violet-500/20 to-blue-500/20">
              <div className="w-full py-2 px-4 flex flex-col justify-around h-full">
                <div className="flex gap-3 detailsView items-center">
                  <div className="h-[45px] bg-blue-500 w-[45px] rounded-full flex items-center justify-center text-white text-[20px]">
                    {selectedLead.full_name?.slice(0, 1)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base leading-[17px] font-semibold text-blue-800">
                      {selectedLead?.full_name || "...."}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] leading[12px] text-gray-600">
                      <MdOutlineMailOutline />
                      {selectedLead?.email || "...."}
                    </span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <a
                    className="outline-none bg-none"
                    href={`tel:${selectedLead.phone_number}`}
                  >
                    <span className="text-white  bg-blue-500 py-1 px-2 rounded-full flex gap-1 cursor-pointer items-center text-xs">
                      <IoCallOutline className="text-lg" />
                      {selectedLead.phone_number}
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-[48%] h-[120px] rounded-md bg-gradient-to-r from-green-800/20 to-blue-800/20"></div>
          </div>

          <div className="mt-3 w-full flex flex-col gap-1">
            <div className={`${rowStyle}`}>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Profile Id:</span>
                <span className={`${valueStyle}`}>
                  {selectedLead?.profileId}
                </span>
              </div>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Profile Score:</span>
                <span className={`${valueStyle}`}>
                  {selectedLead?.profileScore || "_"}
                </span>
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Disposition:</span>
                <span className={`${valueStyle} capitalize`}>
                  {formatValue(selectedLead?.disposition)}
                </span>
              </div>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Sub Disposition:</span>
                <span className={`${valueStyle} capitalize`}>
                  {formatValue(selectedLead?.subDisposition) || "_"}
                </span>
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Query:</span>
                <span className={`${valueStyle}`}>
                  {selectedLead["whats_is_your_requirement_?_write_in_brief"] ||
                    "NA"}
                </span>
              </div>
            </div>
          </div>

          <UpdatesList />
        </div>
      </div>
    </div>
  );
};

export default LeadDetailView;

const UpdateLeadModal = ({ updateLoading, setUpdateLoading, close }) => {
  const { selectedLead } = useContext(manufacturerContext);
  const [selectedDisposition, setSelectedDisposition] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const dispositions = service_manufacturer_dispositions;
  const subDispositions = service_manufacturer_subDispositions;
  const [selectedSubDisposition, setSelectedSubDisposition] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedLead) {
      setSelectedDisposition(selectedLead?.disposition || null);
      setSelectedSubDisposition(selectedLead?.subDisposition || null);
    }
  }, [selectedLead]);

  const update = async () => {
    try {
      if (subDispositions[selectedDisposition]?.length) {
        if (!selectedSubDisposition) {
          return toast.error("Please select sub disposition");
        }

        console.log(
          "subDispositions[selectedDisposition]",
          subDispositions[selectedDisposition]
        );
        let found = subDispositions[selectedDisposition]?.find(
          (item) => item.value === selectedSubDisposition
        );

        console.log("found is", found);
        if (!found || found == -1) {
          return toast.error("Please select valid sub disposition");
        }
      }
      setUpdateLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/updateAllocatedLead`;
      const body = {
        disposition: selectedDisposition,
        subDisposition: selectedSubDisposition || null,
        remarks: remarks || "",
        serviceDocId: selectedLead?.serviceDocId,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "something went wrong");
      } else {
        toast.success(data.message || "Updated successfully");
        queryClient.invalidateQueries(["allUpdatesOfUsers", "allocatedLeads"]);
        close();
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      <h1 className="text-gray-600 font-semibold text-base">
        Update the status of {selectedLead?.full_name || selectedLead?.email}
      </h1>

      <div className="mt-6 flex flex-col gap-6">
        <CustomSelector
          label={"Disposition"}
          options={dispositions}
          value={selectedDisposition}
          onChangeValue={(e) => {
            setSelectedDisposition(e), setSelectedSubDisposition(null);
          }}
          icon={<FaNetworkWired className={`text-base text-white`} />}
        />

        {subDispositions[selectedDisposition] && (
          <CustomSelector
            label={"Sub disposition"}
            options={subDispositions[selectedDisposition]}
            value={selectedSubDisposition}
            onChangeValue={(e) => setSelectedSubDisposition(e)}
            icon={<FaNetworkWired className={`text-base text-white`} />}
          />
        )}

        <CustomTextarea
          label={"remarks"}
          value={remarks}
          onChangeValue={(value) => setRemarks(value)}
          disabled={false}
          icon={<MdEdit className={`text-base text-white`} />}
          placeholder={"Enter your remarks here"}
        />
      </div>

      <div className="flex justify-start gap-2 mt-3">
        <button
          disabled={updateLoading}
          onClick={update}
          className="text-white bg-colorPrimary py-1 px-3 rounded disabled:bg-colorPrimary/50 disabled:animate-pulse"
        >
          Update now
        </button>
      </div>
    </div>
  );
};
