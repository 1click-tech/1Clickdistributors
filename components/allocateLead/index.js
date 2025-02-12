import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import CustomTable from "../utills/customTable";
import { camelToTitle } from "../utills/commonFunctions";
import { RiSettings2Line } from "react-icons/ri";
import moment from "moment";
import Modal from "../utills/Modal";
import { MdClose } from "react-icons/md";
import AllocateLeadModal from "./allocateLeadModal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import local from "next/font/local";
import ShowDetails from "./showDetails";
import ManualLeadForm from "../utills/ManualLeadForm";
import Filters from "./filters";
import Table from "../utills/Table";
import { IoCloudDownloadOutline } from "react-icons/io5";
import panelContext from "@/lib/context/panelContext";
import FilterLeadsByMember from "../FilterLeadsByMember";
import { leadsPanelColumns } from "@/lib/data/commonData";
import useModal from "../hooks/useModal";
import AnimatedModal from "../utills/AnimatedModal";
import { useSelector } from "react-redux";

const index = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [allocatingLeads, setAllocatingLeads] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateObjToSearch, setDateObjToSearch] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [workModalVisible, setWorkModalVisible] = useState(false);
  const [uploadModalVisible, setUploadVisible] = useState(false);
  const [leads, setLeads] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pageHeight, setPageHeight] = useState(0);
  const { headerHeight, userDetails } = useContext(panelContext);
  const [selectedSalesMembers, setSelectedSalesMembers] = useState([]);
  const [deletingData, setDeletingData] = useState(false);
  const { open, close, modalOpen } = useModal();
  const [visibleHotLeads, setVisibleHotLeads] = useState(false);

  const filterBtnsRef = useRef(null);

  useEffect(() => {
    if (headerHeight) {
      let windowHeight = window.innerHeight;

      let pageH = windowHeight - headerHeight;
      setPageHeight(pageH);
    }
  }, [headerHeight]);

  const getAllLeads = async () => {
    try {
      if (!dateObjToSearch) {
        return null;
      }

      const token = localStorage.getItem("authToken");
      setLeadsLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: dateObjToSearch?.selectedStartDate,
          endDate: dateObjToSearch?.selectedEndDate,
        }),
      });
      const data = await response.json();
      setLeadsLoading(false);
      if (data.success && data?.leads) {
        return data.leads;
      } else {
        return null;
      }
    } catch (error) {
      setLeadsLoading(false);
      console.log("error in getting leads", error.message);
      return null;
    }
  };

  const { data, refetch: refetchLeads } = useQuery({
    queryKey: ["allLeads", dateObjToSearch],
    queryFn: getAllLeads,
  });

  useEffect(() => {
    let start = moment()
      .startOf("day")
      .subtract({ days: 5 })
      .format("YYYY-MM-DD");
    let end = moment().endOf("day").format("YYYY-MM-DD");
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setDateObjToSearch({
      selectedStartDate: start,
      selectedEndDate: end,
    });
  }, []);

  const handleAssignLeads = async (salesMember) => {
    try {
      if (!salesMember.id) {
        return;
      }
      const leads = selectedRows?.map((item) => item.leadId);
      setAllocatingLeads(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/assignLeadsToSalesMember`;
      let token = localStorage.getItem("authToken");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leads,
          salesMember: salesMember.id,
          salesMemberName: salesMember.name,
        }),
      });
      setAllocatingLeads(false);
      const data = await response.json();

      if (data.success) {
        toast.success(data?.message || "Successfully allocated leads");
        setShowAllocationModal(false);
        refetchLeads();
        setSelectedRows([]);
      } else {
        toast.error(data?.message || "Failed to allocate");
      }
    } catch (error) {
      toast.error(error.message);
      setAllocatingLeads(false);
    }
  };

  const staticColumns = [
    "assignedAt",
    "createdAt",
    "assignedBy",
    "salesExecutive",
    "remarks",
  ];
  const avoidCols = [
    "id",
    "adType",
    "your_mobile_number",
    "leadId",
    "salesExecutiveName",
    "createdTime",
  ]; // Added fields to hide

  let checkMarkCol = ["Select"].map((key) => {
    return {
      Header: camelToTitle(key),
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={
              selectedRows?.filter(
                (item) => item.leadId == row?.original?.leadId
              )?.length > 0
            }
            readOnly={true}
          />
        </div>
      ),
    };
  });

  const columnsOrder = [
    "createdAt",
    "source",
    "dataType",
    "profileId",
    "company_name",
    "looking_for",
    "your_mobile_number",
    "email",
    "city",
    "whats_is_your_requirement_?_write_in_brief",
    "disposition",
  ];

  const managerAndAbove = ["formName", "formId"];

  const columns = useMemo(() => {
    if (leads?.length > 0) {
      // let dynamicCols = Object.keys(leads[0] || {})
      //   .filter((key) => {
      //     if (avoidCols.includes(key) || staticColumns.includes(key)) {
      //       return false;
      //     }
      //     if (typeof leads[0][key] == "object") {
      //       return false;
      //     }
      //     return true;
      //   })
      let dynamicCols = columnsOrder.map((key) => {
        // Split key by underscore and capitalize the first letter of each part
        const headerParts = key
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
        const header = headerParts.join(" "); // Join parts with a space

        if (key == "assignedAt" || key == "createdAt" || key == "updatedAt") {
          return {
            Header: leadsPanelColumns[key] || key,
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

        if (key == "profileId") {
          return {
            Header: leadsPanelColumns[key] || key,
            accessor: key,
            Cell: ({ row }) => {
              return (
                <button className="text-blue-500 font-semibold hover:underline">
                  {row?.original?.profileId}
                </button>
              );
            },
          };
        }

        return {
          Header: leadsPanelColumns[key] || header, // Use the modified header
          accessor: key,
          id: key,
        };
      });

      // const profileIdCol = dynamicCols.find(
      //   (col) => col.accessor === "profileId"
      // );

      // if (profileIdCol) {
      //   dynamicCols = dynamicCols.filter((col) => col.accessor !== "profileId");
      //   dynamicCols.unshift(profileIdCol); // Add profileId to the first position
      // }

      // let statiCols = staticColumns.map((key) => {
      //   if (key == "assignedAt" || key == "createdAt" || key == "updatedAt") {
      //     return {
      //       Header: camelToTitle(key),
      //       accessor: key,
      //       Cell: ({ value }) => {
      //         return (
      //           value && (
      //             <p>
      //               {new Date(value?._seconds * 1000)?.toLocaleDateString()}
      //             </p>
      //           )
      //         );
      //       },
      //       sortType: (rowA, rowB, columnId) => {
      //         const dateA = rowA.values[columnId]?._seconds
      //           ? new Date(rowA.values[columnId]?._seconds * 1000)
      //           : null;
      //         const dateB = rowB.values[columnId]?._seconds
      //           ? new Date(rowB.values[columnId]?._seconds * 1000)
      //           : null;

      //         if (!dateA && !dateB) return 0; // Both dates are missing
      //         if (!dateA) return 1; // dateA is missing, place it after dateB
      //         if (!dateB) return -1; // dateB is missing, place it after dateA

      //         return dateA > dateB ? 1 : -1; // Compare valid dates
      //       },
      //       id: key,
      //     };
      //   }

      //   if (key == "salesExecutive") {
      //     return {
      //       Header: camelToTitle(key),
      //       accessor: "salesExecutiveName",
      //       id: key,
      //     };
      //   }
      //   return {
      //     Header: camelToTitle(key),
      //     accessor: key,
      //     id: key,
      //   };
      // });

      return [...checkMarkCol, ...dynamicCols];
    } else {
      return [];
    }
  }, [leads, selectedRows]);

  const handleRefetchLeads = () => {
    setDateObjToSearch({
      selectedStartDate,
      selectedEndDate,
    });
  };

  const filterTable = () => {
    if (searchValue == "") {
      setLeads(data);
    }
    // Convert searchValue to lowercase to make the search case-insensitive
    const lowerSearchValue = searchValue?.toLowerCase();
    // Filter the array of objects
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

  const deleteData = async () => {
    try {
      if (!selectedRows.length) {
        return toast.error("No data selected");
      }

      console.log("data is", selectedRows);
      setDeletingData(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/deleteDataFromDb`;
      let token = localStorage.getItem("authToken");
      // Create a FormData object to hold the file

      let body = {
        leads: selectedRows?.map((item) => item.docId),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        close();
        refetchLeads();
        setSelectedRows([]);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingData(false);
    }
  };

  return (
    <div
      className="py-1 px-2"
      style={{ height: pageHeight ? pageHeight : "auto" }}
    >
      <AnimatedModal open={open} close={close} modalOpen={modalOpen}>
        <div className="min-w-[30vw] max-w-[85vw] px-3 py-5 rounded-md bg-white relative">
          <h1 className="text-gray-600 text-lg">
            Are you sure? you want to delete {selectedRows?.length} leads
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={deleteData}
              disabled={deletingData}
              className="text-white bg-red-500 py-1 px-3 rounded-md disabled:animate-pulse"
            >
              Delete now
            </button>
            <button
              onClick={close}
              className="text-white bg-gray-500 py-1 px-3 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </AnimatedModal>

      <div ref={filterBtnsRef} className="">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFormVisible(true)}
            className="rounded py-1 px-2 text-sm text-white bg-gray-400 hover:bg-gray-600"
          >
            Create Lead
          </button>
          <button
            onClick={() => setUploadVisible(true)}
            className="rounded py-1 px-2 text-sm text-white bg-gray-400 hover:bg-gray-600"
          >
            Import Excel
          </button>
          <button
            onClick={() => setVisibleHotLeads(true)}
            className="rounded py-1 px-2 text-sm text-white bg-gray-400 hover:bg-gray-600"
          >
            Hot Leads
          </button>

          <div className="flex gap-2 bg-gray-200 items-end py-1 px-3 rounded-md">
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">From</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">To</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefetchLeads}
              className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs"
            >
              Search
            </button>
          </div>

          <RiSettings2Line
            onClick={() => setOpenModal(true)}
            className="text-gray-800 text-2xl font-semibold cursor-pointer"
          />
          <button
            disabled={!selectedRows?.length}
            className="bg-gray-500 flex items-center gap-1 disabled:bg-gray-500/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
            onClick={() => setSelectedRows([])}
          >
            Unselect all
          </button>

          {userDetails?.hierarchy == "superAdmin" && (
            <button
              disabled={!selectedRows?.length}
              className="bg-red-500 flex items-center gap-1 disabled:bg-red-500/40 disabled:cursor-not-allowed py-1 px-3 rounded-md text-white"
              onClick={open}
            >
              Delete
            </button>
          )}

          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="min-w-[160px] border border-gray-400 outline-blue-500 py-1 px-2 rounded"
            placeholder="Enter to search table"
          />

          <FilterLeadsByMember
            selectedSalesMembers={selectedSalesMembers}
            setSelectedSalesMembers={setSelectedSalesMembers}
          />
        </div>
        <Filters
          setLeads={setLeads}
          leads={leads}
          originalData={data}
          selectedSalesMembers={selectedSalesMembers}
        />
      </div>

      {leadsLoading && (
        <div className="w-full flex flex-col items-center justify-center">
          <img src="/loader.gif" className="h-[30px] w-auto" alt="loading" />
          <p className="text-xl font-bold text-gray-500 mt-3">
            Loading leads... please wait
          </p>
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
        {leads?.length > 0 ? (
          <CustomTable
            data={leads || []}
            uniqueDataKey={"leadId"}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            columns={columns}
            openModal={openModal}
            closeModal={() => setOpenModal(false)}
            searchValue={searchValue}
          />
        ) : (
          !leadsLoading && (
            <div className="mt-10 w-full flex px-4">
              <h1 className="text-gray-600 font-semibold text-2xl">
                No data found with current date and filters.
              </h1>
            </div>
          )
        )}
      </div>

      {selectedRows?.length > 0 && (
        <AllocateLeadModal
          data={selectedRows}
          onSubmit={handleAssignLeads}
          loading={allocatingLeads}
        />
      )}

      {formVisible && (
        <Modal>
          <div className="w-full h-[100vh] py-4 md:py-8">
            <ManualLeadForm onClose={() => setFormVisible(false)} />
          </div>
        </Modal>
      )}

      {uploadModalVisible && (
        <Modal>
          <UploadExcelData onClose={() => setUploadVisible(false)} />
        </Modal>
      )}

      {visibleHotLeads && (
        <Modal>
          <DownloadHotLeads close={() => setVisibleHotLeads(false)} />
        </Modal>
      )}
    </div>
  );
};

const UploadExcelData = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadExcelFile = async () => {
    try {
      if (!file) {
        toast.error("Please select a file");
        setLoading(false);
        return;
      }
      setLoading(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/importLeadsFromExcel`;
      let token = localStorage.getItem("authToken");

      // Create a FormData object to hold the file
      const formData = new FormData();
      formData.append("file", file); // Append the file to the FormData

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Use FormData as the body
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setLoading(false);
        onClose();
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-80 bg-white border shadow-sm rounded relative px-4 pt-10 pb-6 overflow-hidden">
      <button
        className="bg-red-600 text-white text-base absolute top-0 right-0 px-4"
        onClick={onClose}
      >
        close
      </button>
      <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={onChange}
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
        />
        <div className="flex gap-2 mt-8">
          <span className="block px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold">
            <a
              href="/dummy_data.xlsx"
              download="1click_dummy.xlsx"
              className="flex gap-1 items-center"
            >
              Download <IoCloudDownloadOutline />
            </a>
          </span>
          <button
            disabled={loading}
            onClick={uploadExcelFile}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Uploading..." : "Upload Excel"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DownloadHotLeads = ({ close }) => {
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const downloadFile = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getHotLeads`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: moment(selectedStartDate).format("YYYY-MM-DD"),
          endDate: moment(selectedEndDate).format("YYYY-MM-DD"),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert the response into a Blob
      const blob = await response.blob();

      // Create a URL for the Blob and a temporary <a> element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hot_leads.xlsx"; // filename for the downloaded file
      document.body.appendChild(a);
      a.click();

      // Cleanup: remove the element and revoke the Blob URL
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-5">
          <h2 className="text-base font-semibold text-gray-800">
            Download Hot Leads
          </h2>
          <div className="flex gap-2 items-end py-1 px-3 rounded-md mt-4">
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">From</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="text-[12px] text-gray-600">To</span>
              <input
                type="date"
                className="text-[12px] border border-gray-600 rounded px-2"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={close}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-4"
          >
            Cancel
          </button>
          <button
            onClick={downloadFile}
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 mr-2"
          >
            {loading ? "Downloading..." : "Download Excel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default index;
