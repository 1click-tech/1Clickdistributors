import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import Modal from "../utills/Modal";
import UpdateLead from "./UpdateLead";
import { salesPanelColumns, subDispositions } from "@/lib/data/commonData";
import LeadManager from "../leadManager/index";
import Filters from "../allocateLead/filters";
import panelContext from "@/lib/context/panelContext";
import FilterLeadsByMember from "../FilterLeadsByMember";
import { IoMdRefresh } from "react-icons/io";

const salesFilters = ["All", "Pendings", "New Leads", "Follow Ups"];

export default function Sales() {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [showLeadManager, setShowLeadManager] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [lockLeads, setLockLeads] = useState(false);
  const [myData, setMyData] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pageHeight, setPageHeight] = useState(0);
  const filterBtnsRef = useRef(null);
  const userDetails = useContext(panelContext);
  const { headerHeight } = useContext(panelContext);
  const [selectedSalesMembers, setSelectedSalesMembers] = useState([]);

  useEffect(() => {
    if (headerHeight) {
      let windowHeight = window.innerHeight;

      let pageH = windowHeight - headerHeight;
      setPageHeight(pageH);
    }
  }, [headerHeight]);

  // search for default date
  useEffect(() => {
    let startD = moment().startOf("month").format("YYYY-MM-DD");
    let endD = moment().format("YYYY-MM-DD");
    setStartDate(startD);
    setEndDate(endD);
    setDate({
      startDate: startD,
      endDate: endD,
    });
  }, []);

  const getLeads = async () => {
    try {
      if (!date) return null;
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeadsForSalesPanel`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          startDate: date.startDate,
          endDate: date.endDate,
          myData,
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data.leads;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  // Fetch user roles using react-query
  const { data, refetch: refetchLeads } = useQuery({
    queryKey: ["salesLeads", date, myData],
    queryFn: getLeads,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filterTable = () => {
    if (searchValue == "") {
      setLeads(data);
    }
    const lowerSearchValue = searchValue?.toLowerCase();
    const filtered = data?.filter((obj) =>
      Object.values(obj).some((value) =>
        value?.toString().toLowerCase().includes(lowerSearchValue)
      )
    );

    setLeads(filtered);
  };

  useEffect(() => {
    if (Array.isArray(data) && data?.length > 0) {
      filterTable();
    }
  }, [searchValue, data?.length]);

  const getColumnsForSalesPanel = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/panel/getAllColumnsForSalesPanel`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(data.message || "couldn't fetch columns");
        return null;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data: assignedColumns } = useQuery({
    queryKey: ["assignedColumnsForSalesPanel"],
    queryFn: getColumnsForSalesPanel,
  });

  const handleSearchLeads = () => {
    setDate({
      startDate: startDate,
      endDate: endDate,
    });
  };

  const staticColumns = [];

  let updateBtn = ["Select"].map((key) => {
    return {
      Header: camelToTitle(key),
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            className="text-blue-500 font-semibold hover:underline"
            onClick={() => {
              setSelectedRows([row?.original]);
              setShowLeadManager(true);
            }}
          >
            Update
          </button>
        </div>
      ),
    };
  });

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      let dynamicCols = assignedColumns
        ?.filter((item) => {
          let arr = ["assignedAt", "createdAt", "updatedAt"];

          if (!arr.includes(item) && typeof item == "object") {
            return false;
          }
          return true;
        })
        .map((key) => {
          if (key == "profileId") {
            return {
              Header: key,
              accessor: key,
              Cell: ({ row }) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedRows([row?.original]);
                      setShowLeadManager(true);
                    }}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    {row?.original?.profileId}
                  </button>
                );
              },
            };
          }

          if (
            key == "assignedAt" ||
            key == "createdAt" ||
            key == "updatedAt" ||
            key == "followUpDate"
          ) {
            return {
              Header: salesPanelColumns[key] || key,
              accessor: key,
              Cell: ({ value }) => {
                return (
                  value && (
                    <p>{moment(value?._seconds * 1000).format("DD/MM/YYYY")}</p>
                  )
                );
              },
              sortType: (rowA, rowB, columnId) => {
                const dateA = rowA.values[columnId]?._seconds
                  ? new Date(rowA.values[columnId]?._seconds * 1000)
                  : null;
                const dateB = rowB.values[columnId]?._seconds
                  ? new Date(rowB.values[columnId]?._seconds * 1000)
                  : null;

                if (!dateA && !dateB) return 0; // Both dates are missing
                if (!dateA) return 1; // dateA is missing, place it after dateB
                if (!dateB) return -1; // dateB is missing, place it after dateA

                return dateA > dateB ? 1 : -1; // Compare valid dates
              },
              id: key,
            };
          }

          return {
            Header: salesPanelColumns[key] || camelToTitle(key),
            accessor: key,
            id: key,
          };
        });

      // Remove leadId column
      dynamicCols = dynamicCols?.filter((col) => col.accessor !== "leadId"); // Remove leadId

      // Add Profile Id column
      // const profileIdCol = {
      //   Header: "Profile Id", // New column header
      //   id: "profileId",
      //   Cell: ({ row }) => {
      //     return (
      //       <button
      //         onClick={() => {
      //           setSelectedRows([row?.original]);
      //           setShowLeadManager(true);
      //         }}
      //         className="text-blue-500 font-semibold hover:underline"
      //       >
      //         {row?.original?.profileId}
      //       </button>
      //     );
      //   },
      // };

      // Move Profile Id to the second position
      // dynamicCols.splice(1, 0, profileIdCol); // Insert Profile Id at index 1

      let statiCols = staticColumns.map((key) => {
        return {
          Header: camelToTitle(key),
          accessor: key,
          id: key,
        };
      });

      return [...dynamicCols, ...statiCols, ...updateBtn];
    } else {
      return [];
    }
  }, [assignedColumns, leads]);

  const subDispositionOptions = [
    ...new Set(Object.values(subDispositions).flat()),
  ];

  const getFollowUps = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getFollowUpDates`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.followUps;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return null;
    }
  };

  const { data: followUps } = useQuery({
    queryKey: ["getFollowUps"],
    queryFn: getFollowUps,
  });

  useEffect(() => {
    if (followUps && followUps.length > 0) {
      setShowFollowUp(true);
    }
  }, [followUps]);

  console.log("followups", followUps);

  // Lock leads
  const getLockLeadsStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getLockLeadsStatus`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.lockLeads;
      } else {
        return false;
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
      return false;
    }
  };

  const { data: lockLeadStatus, refetch: refetchLockLeads } = useQuery({
    queryKey: ["lockLeadsStatus"],
    queryFn: getLockLeadsStatus,
  });

  useEffect(() => {
    setLockLeads(lockLeadStatus);
  }, [lockLeadStatus]);

  const updateLockLeadStatus = async (status) => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/updateLockLeadsStatus`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lockLeads: status }),
      });
      const data = await response.json();
      if (data.success) {
        refetchLockLeads();
      }
    } catch (error) {
      console.log("error in getting roles", error.message);
    }
  };

  const fetchLeadsAgain = async () => {
    refetchLeads();
  };

  const getCountOfAssignedLeads = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getTotalAssignedLeads`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error in getting roles", error.message);
    }
  };

  const { data: assignedData, refetch: refreshAssigned } = useQuery({
    queryKey: ["assignedLeadsCount"],
    queryFn: getCountOfAssignedLeads,
  });

  return (
    <div className="pt-1" style={{ height: pageHeight || "auto" }}>
      <div className="px-1" ref={filterBtnsRef}>
        <div className="flex gap-1 flex-col rounded-md flex-wrap">
          <div className="flex gap-2 items-end flex-wrap">
            <div className="flex gap-2 items-end p-1 rounded bg-gray-300">
              <div className="flex flex-row items-center gap-1">
                <span className="text-[12px] text-gray-600">From</span>
                <input
                  type="date"
                  className="text-[12px] border border-gray-600 rounded px-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="text-[12px] text-gray-600">To</span>
                <input
                  type="date"
                  className="text-[12px] border border-gray-600 rounded px-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex ml-2">
                <button
                  onClick={handleSearchLeads}
                  className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs mt-auto"
                >
                  Search
                </button>
              </div>
            </div>

            <FilterLeadsByMember
              selectedSalesMembers={selectedSalesMembers}
              setSelectedSalesMembers={setSelectedSalesMembers}
            />

            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="min-w-[160px] border border-gray-400 outline-blue-500 py-1 px-2 rounded text-sm"
              placeholder="Enter to search table"
            />
            <button
              className="text-white bg-blue-500 px-6 py-1 rounded-md text-sm hover:opacity-80"
              onClick={() => setMyData(true)}
            >
              My Data
            </button>
            {assignedData?.totalLeads && (
              <div className="flex-row flex items-center gap-1">
                <span className="text-gray-700 font-medium text-lg">{`(${assignedData?.totalLeads})`}</span>
                <button onClick={refreshAssigned}>
                  <IoMdRefresh size={20} />
                </button>
              </div>
            )}
          </div>

          <Filters
            setLeads={setLeads}
            originalData={data}
            leads={leads}
            userDetails={userDetails}
            setMyData={setMyData}
            myData={myData}
            isSalesPanel={true}
            selectedSalesMembers={selectedSalesMembers}
          />
        </div>
      </div>

      {loading && (
        <div className="w-full flex flex-col items-center justify-center mt-3">
          <img src="/loader.gif" className="h-[30px] w-auto" alt="loading" />
          <p className="text-xl font-bold text-gray-500 mt-3">
            Loading leads... please wait
          </p>
        </div>
      )}

      {!loading && leads?.length == 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-3">
          <p className="text-xl font-bold text-gray-500 mt-3">No Leads Found</p>
        </div>
      )}

      <div
        className="w-full"
        style={{
          height: filterBtnsRef?.current
            ? pageHeight - filterBtnsRef?.current?.offsetHeight - 8
            : "560px",
        }}
      >
        <CustomTable
          data={leads || []}
          uniqueDataKey={"leadId"}
          selectedRows={[]}
          setSelectedRows={() => {}}
          columns={columns}
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          searchValue={searchValue}
        />
      </div>

      {showUpdateModal && (
        <Modal>
          <UpdateLead
            onClose={() => setShowUpdateModal(false)}
            leads={selectedRows}
          />
        </Modal>
      )}

      {showDetailsModal && (
        <Modal>
          <div className="w-[90vw] sm:w-[55vw] md:w-[45vw] xl:w-[35vw] h-[70vh] bg-white rounded-md p-2 relative">
            <MdClose
              className="text-red-500 absolute top-2 right-4 cursor-pointer text-2xl"
              onClick={() => setShowDetailsModal(false)}
            />

            <ShowDetails
              data={selectedRows?.[0]}
              close={() => setShowDetailsModal(false)}
            />
          </div>
        </Modal>
      )}

      {showLeadManager && (
        <LeadManager
          onClose={() => setShowLeadManager(false)}
          lead={selectedRows[0]}
          fetchLeadsAgain={fetchLeadsAgain}
        />
      )}

      {showFollowUp && (
        <Modal>
          <FollowUpModal
            followUps={followUps}
            setShowFollowUp={setShowFollowUp}
            setLockLeads={setLockLeads}
            updateLockLeadStatus={updateLockLeadStatus}
          />
        </Modal>
      )}
    </div>
  );
}

const FollowUpModal = ({ followUps, setShowFollowUp }) => {
  useEffect(() => {
    followUps.forEach((followUp) => {
      const followUpTime = new Date(
        followUp.followUpDate._seconds * 1000
      ).getTime();
      const currentTime = new Date().getTime();
      const delay = followUpTime - currentTime;

      if (delay > 0) {
        setTimeout(async () => {
          alert(`Follow-up reminder for: ${followUp?.full_name}`);
        }, delay);
      }
    });
  }, [followUps]);

  const closeModal = () => {
    setShowFollowUp(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Follow-Up Leads</h2>
      <p className="text-gray-700 mb-6">
        You have <span className="font-bold">{followUps?.length}</span>{" "}
        follow-up lead
        {followUps?.length !== 1 ? "s" : ""} for today.
      </p>
      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};
