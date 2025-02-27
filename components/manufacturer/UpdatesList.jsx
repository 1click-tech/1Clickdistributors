// UpdatesData.js (remains the same)
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

// UpdatesList.jsx
import React from "react";
//   import { updates } from './UpdatesData';

const UpdatesList = () => {
  // Colors for different dispositions
  const getStatusColor = (disposition) => {
    switch (disposition) {
      case "In Progress":
        return "from-blue-500 to-blue-600";
      case "Completed":
        return "from-green-500 to-green-600";
      case "Pending":
        return "from-yellow-500 to-yellow-600";
      case "On Hold":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="mx-auto mt-4 px-1 w-full">
      <h2 className="text-xl font-bold text-gray-500 mb-4 bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent ">
        Project Updates
      </h2>
      <div className="space-y-6">
        {updates.map((update, index) => (
          <div
            key={index}
            className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-transparent to-gray-100"
          >
            {/* Left gradient bar */}
            <div
              className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${getStatusColor(
                update.disposition
              )}`}
            ></div>

            <div className="p-3 ml-2">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {update.disposition}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {update.subDisposition}
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors duration-300">
                  {new Date(update.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 text-base leading-relaxed">
                {update.remark}
              </p>
            </div>

            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-indigo-50 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesList;
