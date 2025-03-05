export const updates = [
  {
    disposition: "In Progress",
    subDisposition: "Under Review",
    remark: "Team is currently analyzing the requirements",
    date: "2025-02-25",
  },
  {
    disposition: "Completed",
    subDisposition: "Approved",
    remark: "Documentation finalized and signed off",
    date: "2025-02-24",
  },
  {
    disposition: "Pending",
    subDisposition: "Awaiting Feedback",
    remark: "Waiting for client response on initial draft",
    date: "2025-02-23",
  },
  {
    disposition: "On Hold",
    subDisposition: "Resource Allocation",
    remark: "Waiting for additional team members",
    date: "2025-02-22",
  },
  {
    disposition: "In Progress",
    subDisposition: "Development",
    remark: "Coding phase has started",
    date: "2025-02-21",
  },
];

import { convertFromTimeStamp, formatValue } from "@/lib/commonFunctions";
import manufacturerContext from "@/lib/context/manufacturerContext";
import { serviceDispositionColors } from "@/lib/data/commonData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
// UpdatesList.jsx
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
//   import { updates } from './UpdatesData';

const UpdatesList = ({}) => {
  // Colors for different dispositions
  const { selectedLead, setSelectedLead } = useContext(manufacturerContext);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const getStatusColor = (disposition) => {
    let color = serviceDispositionColors[disposition] || "gray";
    console.log("coolor", color);
    return color;
  };

  const getLeadUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getAllUpdatesOfLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceDocId: selectedLead?.serviceDocId,
          readStatus: selectedLead?.readStatus || false,
        }),
      });
      const data = await response.json();

      if (data.increasedReadCount) {
        queryClient.invalidateQueries(["allocatedLeads"]);
      }
      if (data.data) {
        return data?.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      console.log("error in getting leadUpates", error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const { data: allUpdates, refetch } = useQuery({
    queryKey: ["allUpdatesOfUsers", selectedLead?.serviceDocId],
    queryFn: getLeadUpdates,
  });

  if (!allUpdates || !allUpdates?.length || loading) {
    return null;
  }

  return (
    <div className="mx-auto mt-4 px-1 w-full">
      {Array.isArray(allUpdates) && allUpdates.length && (
        <>
          <h2 className="text-xl font-bold text-gray-500 mb-4 bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent ">
            Updates Timeline
          </h2>
          <div className="space-y-6">
            {allUpdates.map((update, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-transparent to-gray-100"
              >
                {/* Left gradient bar */}
                <div
                  style={{
                    background: getStatusColor(update.disposition),
                  }}
                  className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b}`}
                ></div>

                <div className="p-3 ml-2">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <h3 className="text-lg font-bold text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 capitalize">
                        {formatValue(update.disposition)}
                      </h3>
                      {update.subDisposition && (
                        <p className="text-sm text-gray-500 capitalize">
                          {formatValue(update.subDisposition)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors duration-300">
                      {moment(convertFromTimeStamp(update.updatedAt)).format(
                        "DD MMMM YYYY HH:mm"
                      )}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {update.remarks}
                  </p>
                </div>

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-indigo-50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UpdatesList;
