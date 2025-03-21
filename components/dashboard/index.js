import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DataChart from "./dataChart";
import moment from "moment";
import { useSelector } from "react-redux";
import { authSelector } from "@/store/auth/selector";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [date, setDate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [executiveWiseRecord, setExecutiveWiseRecord] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [memberId, setMemberId] = useState("");
  const [popupLeads, setPopupLeads] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");

  const currentLoggedInUser = useSelector(authSelector);

  useEffect(() => {
    let startD = moment().startOf("day").format("YYYY-MM-DD");
    let endD = moment().endOf("day").format("YYYY-MM-DD");
    setSelectedStartDate(startD);
    setSelectedEndDate(endD);
    setDate({
      startDate: startD,
      endDate: endD,
    });
  }, []);

  const getUserDataForDashboard = async () => {
    try {
      if (!date) return null;
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/leads/getDataForDashboard`;
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          startDate: date.startDate,
          endDate: date.endDate,
          memberId: memberId || null,
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      setLoading(false);
      console.log("error in getting update data", error.message);
      return null;
    }
  };

  const { data } = useQuery({
    queryKey: ["userUpdateData", date, memberId],
    queryFn: getUserDataForDashboard,
  });

  useEffect(() => {
    if (Array.isArray(data?.leads) && data.leads.length > 0) {
      const dispositionCounts = {};
      const formattedData = {};
      const membersData = data.membersData;

      data.leads.forEach((lead) => {
        if (lead.disposition) {
          dispositionCounts[lead.disposition] =
            (dispositionCounts[lead.disposition] || 0) + 1;

          const { salesExecutiveName, disposition } = lead;

          if (!formattedData[salesExecutiveName]) {
            formattedData[salesExecutiveName] = {
              salesExecutiveName,
              totalUpdates: 0,
            };
          }

          formattedData[salesExecutiveName].totalUpdates += 1;
          formattedData[salesExecutiveName][disposition] =
            (formattedData[salesExecutiveName][disposition] || 0) + 1;
        }
      });

      Object.keys(formattedData).forEach((memberName) => {
        const member = membersData.find((m) => m.name === memberName);
        if (member?.hierarchy === "manager") {
          const managerExecutives = membersData.filter(
            (m) => m.senior === member.id
          );
          const managerData = formattedData[memberName];

          const aggregatedDispositions = { ...managerData };

          managerExecutives.forEach((executive) => {
            const executiveData = formattedData[executive.name];
            if (executiveData) {
              Object.keys(executiveData).forEach((key) => {
                if (key === "salesExecutiveName" || key === "totalUpdates") {
                  return;
                }
                aggregatedDispositions[key] =
                  (aggregatedDispositions[key] || 0) + executiveData[key];
              });
              aggregatedDispositions.totalUpdates += executiveData.totalUpdates;
            }
          });

          formattedData[memberName] = aggregatedDispositions;
        }
      });

      setExecutiveWiseRecord(formattedData);
      setUserData(dispositionCounts);
    } else {
      setUserData(null);
      setExecutiveWiseRecord({});
    }
  }, [data?.leads, data?.membersData]);

  const getAllExecutiveNames = (memberName) => {
    const member = data?.membersData.find((m) => m.name === memberName);
    if (!member) return [memberName];

    if (member.hierarchy === "executive") {
      return [memberName];
    } else if (member.hierarchy === "manager") {
      const executives = data.membersData.filter(
        (m) => m.senior === member.id
      );
      const executiveNames = executives.map((e) => e.name);
      return [memberName, ...executiveNames];
    }
    return [memberName];
  };

  const handleCellClick = (salesExecutiveName, type) => {
    if (!data || !data.leads) return;

    const allNames = getAllExecutiveNames(salesExecutiveName);
    let filteredLeads;

    if (type === "totalUpdates") {
      filteredLeads = data.leads.filter((lead) =>
        allNames.includes(lead.salesExecutiveName)
      );
      setPopupTitle(`Total Updates for ${salesExecutiveName}`);
    } else {
      filteredLeads = data.leads.filter(
        (lead) =>
          allNames.includes(lead.salesExecutiveName) &&
          lead.disposition === type
      );
      setPopupTitle(`${type} for ${salesExecutiveName}`);
    }

    setPopupLeads(filteredLeads);
    setShowPopup(true);
  };

  const handleSetDate = () => {
    setDate({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    });
    setMemberId(selectedMember);
  };

  return (
    <div className="w-full h-auto p-3 pb-10">
      {loading && (
        <div className="w-full flex justify-center my-1">
          <img src="/loader.gif" className="h-12 w-auto" />
        </div>
      )}

      <div className="flex gap-2 items-end py-1 px-3 rounded-md flex-wrap my-2 mb-6">
        <div className="flex flex-row gap-1 items-center">
          <span className="text-[12px] text-gray-500">From</span>
          <input
            type="date"
            className="text-[12px] border border-gray-600 rounded px-2"
            value={selectedStartDate}
            onChange={(e) => setSelectedStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-1 items-center">
          <span className="text-[12px] text-gray-500">To</span>
          <input
            type="date"
            className="text-[12px] border border-gray-600 rounded px-2"
            value={selectedEndDate}
            onChange={(e) => setSelectedEndDate(e.target.value)}
          />
        </div>
        {currentLoggedInUser?.hierarchy !== "executive" && (
          <select
            className="text-[12px] border border-gray-600 rounded px-2 py-1"
            onChange={(e) => setSelectedMember(e.target.value)}
            value={selectedMember}
          >
            <option value="">Select Name</option>
            {data?.membersData?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleSetDate}
          className="text-white bg-blue-500 px-2 py-1 rounded-md text-xs"
        >
          Search
        </button>
      </div>

      {!userData && (!data?.leads || data?.leads?.length === 0) && !loading && (
        <h1 className="text-gray-600 font-semibold text-xl w-full text-center">
          Looks like no leads updated within selected time range
        </h1>
      )}
      {userData && (
        <div className="w-full flex justify-center h-[60vh]">
          <DataChart stats={userData} />
        </div>
      )}

      {userData && executiveWiseRecord && (
        <div className="w-full flex mt-5 justify-center">
          <div className="overflow-x-auto w-[95%]">
            <table className="min-w-full bg-white border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Sales Executive Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Total Updates
                  </th>
                  {Object.keys(userData).map((disposition) => (
                    <th
                      key={disposition}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {disposition}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(executiveWiseRecord).map(
                  (salesExecutive, index) => (
                    <tr key={index} className="bg-white even:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {salesExecutive.salesExecutiveName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className="cursor-pointer text-blue-500 hover:underline"
                          onClick={() =>
                            handleCellClick(
                              salesExecutive.salesExecutiveName,
                              "totalUpdates"
                            )
                          }
                        >
                          {salesExecutive.totalUpdates}
                        </span>
                      </td>
                      {Object.keys(userData).map((disposition) => (
                        <td
                          key={disposition}
                          className="border border-gray-300 px-4 py-2"
                        >
                          <span
                            className="cursor-pointer text-blue-500 hover:underline"
                            onClick={() =>
                              handleCellClick(
                                salesExecutive.salesExecutiveName,
                                disposition
                              )
                            }
                          >
                            {salesExecutive[disposition] || 0}
                          </span>
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md w-[80%] max-h-[80%] overflow-auto">
            <h2 className="text-xl font-bold mb-4">{popupTitle}</h2>
            <table className="min-w-full bg-white border-collapse border border-gray-300">
              <thead>
                <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                    Sales Executive
                  </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                    Profile Id
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left">
                   Next Followup Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Disposition
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Last Remarks
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Lead Name
                  </th>
 

                  <th className="border border-gray-300 px-4 py-2 text-left">
                   Company Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                   Phone Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                   Mail Id
                  </th>
                </tr>
              </thead>
              <tbody>
                {popupLeads.map((lead, index) => (
                  <tr key={index} className="bg-white even:bg-gray-100">

                    <td className="border border-gray-300 px-4 py-2">
                      {lead.salesExecutiveName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lead.profileId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                         {lead.followUpDate && moment(lead.followUpDate).isValid()
                         ? moment(lead.followUpDate).format("YYYY-MM-DD")
                          : "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lead.disposition}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lead.remarks}
                    </td>

                    <td className="border border-gray-300 px-4 py-2">
                      {lead.full_name}
                    </td>
     

                    <td className="border border-gray-300 px-4 py-2">
                      {lead.company_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lead.phone_number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {lead.email}
                    </td>

                 
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}

{showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="relative bg-white p-5 rounded-md w-[80%] max-h-[80%] overflow-auto">
      <button
        className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => setShowPopup(false)}
      >
        Close
      </button>

      <h2 className="text-xl font-bold mb-4">{popupTitle}</h2>

      {/* Scrollable Table Container */}
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
        {/* <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sales Executive</th>
              <th className="border border-gray-300 px-2 py-1 text-sm w-[80px]">Profile Id</th>
              <th className="border border-gray-300 px-6 py-4 text-left">Next Followup Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Disposition</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Remarks</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Lead Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Company Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mail Id</th>
            </tr>
          </thead> */}

          <thead className="sticky top-0 bg-gray-100 z-10">
  <tr>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[100px]">Sales Executive</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[80px]">Profile Id</th>
    {/* <th className="border border-gray-300 px-2 py-1 text-sm w-[100px]">Next Followup Date</th> */}
    <th className="border border-gray-300 px-2 py-1 text-sm w-[180px]">Next Followup Date</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[100px]">Disposition</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[150px]">Last Remarks</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[150px]">Lead Name</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[180px]">Company Name</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[120px]">Phone Number</th>
    <th className="border border-gray-300 px-2 py-1 text-sm w-[180px]">Mail Id</th>
  </tr>
</thead>

          <tbody>
            {popupLeads.map((lead, index) => (
              <tr key={index} className="bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{lead.salesExecutiveName}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.profileId}</td>
                <td className="border border-gray-300 px-2 py-1">
                  {lead.followUpDate && moment(lead.followUpDate).isValid()
                    ? moment(lead.followUpDate).format("YYYY-MM-DD")
                    : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{lead.disposition}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{lead.remarks}</td> */}
                <td className="border border-gray-300 px-4 py-2 relative group max-w-[200px] cursor-pointer">
  <div className="truncate">{lead.remarks}</div>

  {/* Hover Box */}
  <div className="absolute top-0 left-0 bg-white shadow-lg border border-gray-300 p-3 rounded-md w-[250px] max-w-xs hidden group-hover:block z-10">
    {lead.remarks}
  </div>
</td>
          <td className="border border-gray-300 px-4 py-2">{lead.full_name}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.company_name}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.phone_number}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}





  </div>
  );
};

export default index;
