import { useState, useMemo } from "react";
import Table from "../utills/Table";
import { convertToTimeStamp } from "@/lib/commonFunctions";

const ActivityHistory = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");

  const handleOpenDialog = (remark) => {
    setSelectedRemark(remark);
    setIsDialogOpen(true);
  };

  const updatedData = data?.historyData?.map((item) => {
    return {
      ...item,
      followUpDate: item?.followUpDate
        ? convertToTimeStamp(item?.followUpDate)
        : null,
      updatedAt: item?.updatedAt ? convertToTimeStamp(item?.updatedAt) : "",
    };
  });

  const columns = useMemo(
    () => [
      {
        Header: "Call Back Date",
        accessor: "followUpDate",
      },
      {
        Header: "Disposition",
        accessor: "disposition",
      },
      {
        Header: "Sub-Disposition",
        accessor: "subDisposition",
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        Cell: ({ row }) => {
          return (
            <>
              <span className="text-gray-800 leading-relaxed w-fit">
                {row?.remarks?.length > 20
                  ? row?.remarks?.slice(0, 20) + "..."
                  : row?.remarks}
              </span>
              {row?.remarks?.length > 20 && (
                <button
                  onClick={() => handleOpenDialog(row?.remarks)}
                  className="ml-1 text-[11px] text-blue-600 hover:underline focus:outline-none"
                >
                  {"Read More"}
                </button>
              )}
            </>
          );
        },
      },
      {
        Header: "Sales Member",
        accessor: "updatedBy",
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <Table data={updatedData} columns={columns} />
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-5">
              <h2 className="text-base font-semibold text-gray-800">Remarks</h2>
              <p className="mt-2 text-sm text-gray-600">{selectedRemark}</p>
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;
