import manufacturerContext from "@/lib/context/manufacturerContext";
import { vibrantColors } from "@/lib/data/commonData";
import React, { useContext, useEffect, useState } from "react";
import { IoCallOutline } from "react-icons/io5";

import {
  MdArrowBack,
  MdArrowForward,
  MdEdit,
  MdOutlineMailOutline,
} from "react-icons/md";
import AnimatedModal from "../utills/AnimatedModal";
import useModal from "../hooks/useModal";
import CustomSelector from "../uiCompoents/CustomSelector";
import { FaNetworkWired } from "react-icons/fa6";
import { CustomTextarea } from "../uiCompoents/CustomInput";
import UpdatesList from "./UpdatesList";

const LeadDetailView = ({
  isSmallDevice,
  jumpToPreviousLead,
  jumpToNextLead,
}) => {
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);
  const { open, close, modalOpen } = useModal();
  const [updateLoading, setUpdateLoading] = useState(false);

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

  console.log("selectedLead is", selectedLead);

  const rowStyle =
    "w-full flex sm:justify-between gap-1 sm:gap-0 text-sm flex-col sm:flex-row";
  const boxStyle =
    "w-full sm:w-[49%] h-auto flex gap-2 sm:gap-1 justify-start sm:justify-between";
  const keyStyle = "w-auto font-semibold text-gray-600";
  const valueStyle = "flex-1 break-words text-gray-500";

  return (
    <div className="w-full h-full p-2 lg:pt-5">
      <AnimatedModal open={open} close={close} modalOpen={modalOpen}>
        <div className="min-w-[20vw] min-h-[50vh] bg-white rounded-md p-4">
          <UpdateLeadModal
            updateLoading={updateLoading}
            setUpdateLoading={setUpdateLoading}
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
                  {selectedLead?.profileScore}
                </span>
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Disposition:</span>
                <span className={`${valueStyle}`}>
                  {selectedLead?.disposition}
                </span>
              </div>
              <div className={`${boxStyle}`}>
                <span className={`${keyStyle}`}>Sub Disposition:</span>
                <span className={`${valueStyle}`}>
                  {selectedLead?.subDisposition}
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

const UpdateLeadModal = ({ updateLoading, setUpdateLoading }) => {
  const { selectedLead } = useContext(manufacturerContext);
  const [selectedDisposition, setSelectedDisposition] = useState(null);
  const [remarks, setRemarks] = useState(null);

  const [selectedSubDisposition, setSelectedSubDisposition] = useState(null);

  const dispositions = [
    { label: "Followup", value: "followup" },
    { label: "Deal", value: "deal" },
    { label: "Non Contactable", value: "non_contactable" },
    { label: "Not Interested", value: "not_interested" },
  ];

  const subDispositions = {
    non_contactable: [
      { label: "Ring", value: "ring" },
      { label: "No response", value: "no_response" },
      { label: "Switch off", value: "switch_off" },
    ],
    not_interested: [
      { label: "Margin Issue", value: "margin_issue" },
      { label: "Investment Issue", value: "investment_issue" },
      { label: "other", value: "other" },
    ],
  };

  useEffect(() => {
    console.log(selectedLead);
  }, [selectedLead]);

  const update = () => {};

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
          onChangeValue={(e) => setSelectedDisposition(e)}
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
          onClick={update}
          className="text-white bg-colorPrimary py-1 px-3 rounded"
        >
          Update now
        </button>
      </div>
    </div>
  );
};
