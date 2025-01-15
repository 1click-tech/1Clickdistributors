import manufacturerContext from "@/lib/context/manufacturerContext";
import { vibrantColors } from "@/lib/data/commonData";
import React, { useContext, useEffect } from "react";
import { IoCallOutline } from "react-icons/io5";

import {
  MdArrowBack,
  MdArrowForward,
  MdOutlineMailOutline,
} from "react-icons/md";

const LeadDetailView = ({
  isSmallDevice,
  jumpToPreviousLead,
  jumpToNextLead,
}) => {
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);

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

  return (
    <div className="w-full h-full p-2 lg:pt-5">
      <div className="w-full h-full rounded-md bg-white rounded-t-2xl overflow-hidden">
        <div className="h-auto bg-gradient-to-r from-[#cc6f11] to-[#cd4030] p-1 pt-3 flex flex-col items-center">
          <div className="flex justify-between md:justify-end px-1 border-b border-orange-800/30 pb-2 w-[98%]">
            <MdArrowBack
              className="text-3xl md:hidden text-white"
              onClick={() => setSelectedLead(null)}
            />

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

          <div className="flex w-full justify-between mt-2">
            <div className="max-w-[60%] flex items-center gap-2 px-2">
              <div
                style={{
                  background: "#fff",
                }}
                className="h-[30px] w-[30px] rounded-full flex items-center justify-center text-gray-500 text-[20px]"
              >
                {selectedLead.full_name?.slice(0, 1)}
              </div>

              <div className="flex flex-col">
                <span className="text-base leading-[17px] font-semibold text-white">
                  {selectedLead?.full_name || "...."}
                </span>
                <span className="flex items-center gap-1 text-[13px] leading[12px] text-white/80">
                  <MdOutlineMailOutline />
                  {selectedLead?.email || "...."}
                </span>
              </div>
            </div>

            <div className="max-w-[40%]">
              <span className="text-white bg-white/30 py-1 px-2 rounded-full flex gap-1 cursor-pointer items-center">
                <IoCallOutline className="text-lg" />
                {selectedLead.phone_number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailView;
