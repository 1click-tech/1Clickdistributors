import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Filters from "../Filters";
import { compareDesignations } from "@/lib/commonFunctions";
import CustomTable from "@/components/utills/customTable";
import { camelToTitle } from "@/components/utills/commonFunctions";
import { leadsPanelColumns } from "@/lib/data/commonData";
import moment from "moment";
import AllocateServiceLead from "../AllocateServiceLead";
const index = ({
  dateObjToSearch,
  searchValue,
  setSearchValue,
  selectedRows,
  setSelectedRows,
}) => {
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState(null);
  const [selectedServiceMembers, setSelectedServiceMembers] = useState([]);
  const [selectedSubTab, setSelectedSubTab] = useState("welcome_calls");
  const [allocatingLeads, setAllocatingLeads] = useState(false);

  const subTabs = [
    {
      label: "Welcome calls",
      value: "welcome_calls",
    },
    {
      label: "My allocations",
      value: "my_allocations",
    },
  ];

  const getServiceLeads = async () => {
    try {
      if (!dateObjToSearch) return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/getLeadsForService`;
      setLoading(true);
      let payload = {
        startDate: dateObjToSearch?.selectedStartDate,
        endDate: dateObjToSearch?.selectedEndDate,
        value: selectedSubTab,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data.leads || [];
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log("error in getting update data", error.message);
      return null;
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["servicePanelLeads", dateObjToSearch, selectedSubTab],
    queryFn: getServiceLeads,
  });

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
    if (Array.isArray(data)) {
      filterTable();
    }
  }, [searchValue, data?.length]);

  const allocateServiceLeads = async (serviceMember) => {
    try {
      if (!serviceMember.id) {
        return;
      }
      const leads = selectedRows?.map((item) => item.leadId);
      setAllocatingLeads(true);
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/service/allocateServiceLeads`;
      let token = localStorage.getItem("authToken");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leads,
          serviceExecutive: serviceMember.id,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data?.message || "Successfully allocated leads");
        refetch();
        setSelectedRows([]);
      } else {
        toast.error(data?.message || "Failed to allocate");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAllocatingLeads(false);
    }
  };

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="w-full flex flex-col items-center justify-center mt-1">
          <img src="/loader.gif" className="h-[25px] w-auto" alt="loading" />
          <p className="text-sm font-bold text-gray-500 mt-1">
            Loading leads... please wait
          </p>
        </div>
      )}

      <div className="flex gap-1 h-[24px] items-center mt-1 overflow-auto scrollbar-none">
        {subTabs.map((tab) => {
          return (
            <button
              className={`py-[1px] sm:py-[2px] px-1 border sm:px-3 h-fit rounded text-nowrap ${
                selectedSubTab == tab.value
                  ? "bg-[#4d82fc] border-[#4d82fc] text-white"
                  : "border-[#4c83ff6e] text-blue-400"
              } text-[10px] sm:text-xs font-semibold `}
              onClick={() => setSelectedSubTab(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}

        <Filters
          setLeads={setLeads}
          originalData={data}
          leads={leads}
          selectedSalesMembers={selectedServiceMembers}
        />
      </div>
      <div className="h-[95%]">
        {Array.isArray(data) ? (
          data.length > 0 ? (
            <div
              className={`w-full flex flex-1 ${
                selectedRows?.length ? "h-[90%]" : "h-full"
              } flex flex-col`}
            >
              <RenderTable
                leads={leads}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                searchValue={searchValue}
              />
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-center w-full text-gray-500">
              No data to show for this time range
            </h1>
          )
        ) : null}
        {selectedRows?.length > 0 && (
          <AllocateServiceLead
            data={selectedRows}
            onSubmit={allocateServiceLeads}
            loading={allocatingLeads}
          />
        )}
      </div>
    </div>
  );
};

export default index;

const RenderTable = ({ leads, selectedRows, setSelectedRows, searchValue }) => {
  const columnsOrder = [
    "createdAt",
    "source",
    // "dataType",
    "profileId",
    "serviceExecutiveName",
    "assignedServiceLeadBy",
    "company_name",
    // "looking_for",
    "your_mobile_number",
    "email",
    // "disposition",
    "city",
    "whats_is_your_requirement_?_write_in_brief",
  ];

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

  const columns = useMemo(() => {
    if (leads?.length > 0) {
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
      return [...checkMarkCol, ...dynamicCols];
    } else {
      return [];
    }
  }, [leads, selectedRows, columnsOrder]);
  return (
    <CustomTable
      data={leads || []}
      uniqueDataKey={"leadId"}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      columns={columns}
      openModal={false}
      closeModal={() => {}}
      searchValue={searchValue}
    />
  );
};
