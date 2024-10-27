import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";

/*
"Not Open": 0,
    Today_Followup: 0,
    "Call Back": 0,
    Presentation_Followup: 0,
    Presentation: 0,
    Prospect: 0,
    Prospect_Followup: 0,
    Deal_Done: 0,
    "Not Interested": 0,
  }
*/

const Filters = ({
  setLeads,
  originalData,
  lockLeads,
  userDetails: currentUser,
  setMyData,
  myData,
}) => {
  const [selectedDisposition, setSelectedDisposition] = useState([]);
  const [selectedSubDisposition, setSelectedSubDisposition] = useState([]);
  const [filters, setFilters] = useState({
    unAllocated: false,
    salesMembers: [],
    btnFilter: null,
  });
  const [list, setList] = useState({
    salesMembers: [],
  });

  const [dispositionData, setDispositionData] = useState(null);

  const currentLoggedInUser = currentUser?.userDetails;

  useEffect(() => {
    if (!originalData) {
      return;
    }
    let salesMembers = {};
    let filteredDispositionData = {
      "Not Open": 0,
      Today_Followup: 0,
      "Call Back": 0,
      "Presentation-Followup": 0,
      Presentation: 0,
      Prospect: 0,
      "Prospect-Followup": 0,
      Deal_Done: 0,
      "Not Interested": 0,
    };
    originalData?.forEach((lead) => {
      if (lead?.salesExecutive && !salesMembers[lead?.salesExecutive]) {
        salesMembers[lead?.salesExecutive] = {
          label: lead.salesExecutiveName,
          value: lead.salesExecutive,
        };
      }

      if (
        lead.disposition &&
        filteredDispositionData.hasOwnProperty(lead.disposition)
      ) {
        filteredDispositionData[lead.disposition]++;
      }

      if (lead?.followUpDate) {
        let followupdate = new Date(lead.followUpDate?._seconds * 1000);
        if (moment(followupdate).isSame(moment(), "date")) {
          filteredDispositionData.Today_Followup++;
        }
      }

      if (
        lead.subDisposition &&
        filteredDispositionData.hasOwnProperty(lead.subDisposition)
      ) {
        filteredDispositionData[lead.subDisposition]++;
      }
    });

    setDispositionData(filteredDispositionData);
    let salesList = Object.values(salesMembers || {});
    setList({
      salesMembers: salesList,
    });
  }, [originalData]);

  const filterLeads = () => {
    if (!Array.isArray(originalData)) {
      return;
    }

    let filtered = [...originalData];
    let dispostionsFilter = [
      "Call Back",
      "Presentation",
      "Not Open",
      "Prospect",
      "Not Interested",
    ];
    let subDispositionFilter = ["Prospect-Followup", "Presentation-Followup"];

    if (filters?.btnFilter) {
      if (dispostionsFilter.includes(filters?.btnFilter)) {
        filtered = filtered.filter((item) => {
          return item.disposition == filters.btnFilter;
        });
      } else if (subDispositionFilter.includes(filters?.btnFilter)) {
        filtered = filtered.filter((item) => {
          return item.subDisposition == filters.btnFilter;
        });
      } else if (filters?.btnFilter == "Today_Followup") {
        filtered = filtered?.filter((lead) => {
          if (lead?.followUpDate) {
            let followupdate = new Date(lead.followUpDate?._seconds * 1000);
            if (moment(followupdate).isSame(moment(), "date")) {
              return true;
            }
          }
          return false;
        });
      } else {
        filtered = [];
      }
    }

    if (filters?.salesMembers?.length > 0) {
      let salesMembers = filters?.salesMembers?.map((item) => item.value);
      filtered = filtered.filter((item) =>
        salesMembers.includes(item.salesExecutive)
      );
    }

    if (filters?.unAllocated) {
      filtered = filtered.filter(
        (item) => !item.salesExecutive || item.salesExecutive == ""
      );
    }

    if (lockLeads) {
      // Filter leads based on follow-up counts greater than 0
      filtered = filtered.filter((lead) => {
        let followupCount = 0;
        if (lead?.subDisposition === "Prospect-Followup") followupCount++;
        if (lead?.subDisposition === "Presentation-Followup") followupCount++;
        return followupCount > 0;
      });
    }

    setLeads(filtered);
  };

  useEffect(() => {
    filterLeads();
  }, [
    selectedDisposition,
    selectedSubDisposition,
    filters,
    originalData,
    lockLeads,
  ]);

  useEffect(() => {
    if (lockLeads) {
      // Set default selected follow-up button if count is greater than 0
      if (dispositionData && dispositionData["Prospect-Followup"] > 0) {
        setFilters((pre) => ({ ...pre, btnFilter: "Prospect-Followup" }));
      } else if (
        dispositionData &&
        dispositionData["Presentation-Followup"] > 0
      ) {
        setFilters((pre) => ({ ...pre, btnFilter: "Presentation-Followup" }));
      }
    } else {
      // Reset btnFilter if lockLeads is false
      setFilters((pre) => ({ ...pre, btnFilter: null }));
    }
  }, [lockLeads, dispositionData]);

  const resetFilters = () => {
    setSelectedDisposition([]);
    setSelectedSubDisposition([]);
    setFilters({ unAllocated: false, salesMembers: [] });
    if (myData) {
      setMyData(false);
    }
  };

  const onSelectButtonFilter = (item) => {
    if (filters?.btnFilter == item) {
      return setFilters((pre) => ({ ...pre, btnFilter: null }));
    }
    setFilters((pre) => ({ ...pre, btnFilter: item }));
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-4 mb-2 pl-4">
      {list?.hasOwnProperty("salesMembers") &&
        currentLoggedInUser?.hierarchy !== "executive" && (
          <div className="w-[180px] flex gap-[2px] flex-col">
            <span className="text-xs text-gray-400">SalesMembers</span>
            <MultiSelect
              options={list?.salesMembers}
              value={filters?.salesMembers}
              onChange={(e) =>
                setFilters((pre) => ({ ...pre, salesMembers: e }))
              }
              labelledBy="SalesMembers"
              className=""
              disabled={lockLeads}
            />
          </div>
        )}
      <div className="flex gap-2 items-end w-full overflow-x-auto">
        <button
          onClick={resetFilters}
          disabled={lockLeads}
          className="flex text-nowrap items-center gap-1 hover:bg-colorPrimary/20 bg-colorPrimary/10 px-3 py-[2px] rounded-md border border-colorPrimary text-colorPrimary font-semibold text-sm"
        >
          Reset filters
          <MdClose className="text-colorPrimary text-lg" />
        </button>

        {currentLoggedInUser?.hierarchy !== "executive" && (
          <button
            onClick={() =>
              setFilters((pre) => ({
                ...pre,
                unAllocated: !pre.unAllocated,
              }))
            }
            disabled={lockLeads}
            className={`py-[2px] text-nowrap text-sm px-3 border font-semibold rounded-md ${
              filters?.unAllocated
                ? "bg-colorPrimary  text-white"
                : "bg-white text-gray-500"
            }`}
          >
            Unallocated leads
          </button>
        )}

        {dispositionData &&
          Object.keys(dispositionData).map((item) => (
            <button
              disabled={
                lockLeads &&
                item !== "Prospect-Followup" &&
                item !== "Presentation-Followup" &&
                item !== "Today_Followup"
              }
              className={`flex text-nowrap items-center gap-1 px-2 py-[2px] rounded-md border border-gray-400  font-semibold text-sm ${
                filters?.btnFilter == item
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600/10 text-gray-500 hover:bg-gray-600/20"
              }`}
              onClick={() => onSelectButtonFilter(item)}
            >
              {item?.split("_").join(" ")} {dispositionData[item]}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Filters;

{
  /* <div className="w-[180px] flex gap-[2px] flex-col">
        <span className="text-xs text-gray-400">Disposition</span>
        <MultiSelect
          options={dispositionsArr}
          value={selectedDisposition}
          onChange={setSelectedDisposition}
          labelledBy="Disposition"
        />
      </div>
      <div className="w-[180px] flex gap-[2px] flex-col">
        <span className="text-xs text-gray-400">Sub-disposition</span>
        <MultiSelect
          options={subDispositionOptions}
          value={selectedSubDisposition}
          onChange={setSelectedSubDisposition}
          labelledBy="Sub-Disposition"
        />
      </div> */
}

// const subDispositionOptions = [
//   ...new Set(Object.values(subDispositions).flat()),
// ].map((item) => ({ label: item, value: item }));

// const dispositionsArr = dispositions?.map((item) => ({
//   label: item,
//   value: item,
// }));
