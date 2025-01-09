import React, { useEffect, useState } from "react";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { toast } from "react-toastify";
import { convertTimeStamp } from "@/lib/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { authSelector } from "@/store/auth/selector";
import Modal from "../utills/Modal";
import { AiOutlineClose } from "react-icons/ai";

const CallDetails = ({ data: leadDetails, refetchLead }) => {
  const userData = useSelector(authSelector);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const [editCallDetails, setEditCallDetails] = useState(false);
  const [fields, setFields] = useState({
    disposition: "Not Open",
    subDisposition: "",
    followUpDate: "",
    remarks: "",
  });

  useEffect(() => {
    setFields((pre) => ({
      ...fields,
      subDisposition: subDispositions[pre.disposition][0],
    }));
  }, [fields.disposition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  // Work of today
  const getLeadsUpdateCount = async () => {
    try {
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/getLeadsStatsToday`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      return null;
    }
  };

  const { data: leadsCount, refetch } = useQuery({
    queryKey: ["todayUpdateLeadsCount"],
    queryFn: getLeadsUpdateCount,
  });

  const updateLeadStage = async () => {
    try {
      const body = {
        leadId: leadDetails?.leadData?.leadId,
        followUpDate: fields.followUpDate,
        disposition: fields.disposition,
        subDisposition: fields.subDisposition,
        remarks: fields.remarks,
      };

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/updateLead`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        refetchLead();
        setEditCallDetails(false);
        setFields({
          disposition: "Not Open",
          subDisposition: "Hot Lead",
          followUpDate: "",
          remarks: "",
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[30%] max-w-80 overflow-auto relative pr-3 flex flex-col">
      {/* show only for sales members */}
      {userData?.hierarchy === "executive" && (
        <LeadsCount leadsCount={leadsCount} refetch={refetch} />
      )}

      <div className="w-full border border-gray-200 bg-white p-3 rounded">
        <div className="flex items-start gap-2">
          <div className="text-left">
            <label htmlFor="name" className="font-semibold text-black nowrap">
              Name:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">{leadDetails?.leadData?.full_name}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label
              htmlFor="contact number"
              className="font-semibold text-black nowrap"
            >
              Contact Number:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.phone_number}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label
              htmlFor="companyName"
              className="text-black font-semibold nowrap"
            >
              Company Name:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.company_name}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label htmlFor="city" className=" text-black font-semibold nowrap">
              City:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">{leadDetails?.leadData?.city}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 mt-2">
          <div className="text-left">
            <label
              htmlFor="requirement"
              className="text-black font-semibold nowrap"
            >
              Requirement
            </label>
          </div>
          <div className="text-left">
            <span className="text-gray-700">
              {leadDetails?.leadData[
                "whats_is_your_requirement_?_write_in_brief"
              ]?.length > 30
                ? leadDetails?.leadData[
                    "whats_is_your_requirement_?_write_in_brief"
                  ]?.slice(0, 30) + "..."
                : leadDetails?.leadData[
                    "whats_is_your_requirement_?_write_in_brief"
                  ] || "NA"}
            </span>
            {leadDetails?.leadData["whats_is_your_requirement_?_write_in_brief"]
              ?.length > 30 && (
              <button
                onClick={toggleVisible}
                className="ml-1 text-[11px] text-blue-600 hover:underline focus:outline-none"
              >
                {"Read More"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-4 mt-4 rounded bg-white flex-1">
        <div className="flex items-start gap-2">
          <div className="text-left">
            <label
              htmlFor="disposition"
              className=" text-black font-semibold nowrap"
            >
              Disposition:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.disposition || "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label
              htmlFor="subDisposition"
              className="text-black font-semibold nowrap"
            >
              Sub-Disposition:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.subDisposition || "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label
              htmlFor="lastCallBackDate"
              className="text-black font-semibold nowrap"
            >
              Last Call Back:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.lastCallBackDate
                ? convertTimeStamp(leadDetails?.leadData?.lastCallBackDate)
                : "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2">
          <div className="text-left">
            <label
              htmlFor="followUpDate"
              className="text-black font-semibold nowrap"
            >
              Next Call Back:
            </label>
          </div>
          <div className="text-left">
            <p className="text-gray-700">
              {leadDetails?.leadData?.followUpDate
                ? convertTimeStamp(leadDetails?.leadData?.followUpDate)
                : "NA"}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="min-w-fit text-left">
            <label
              htmlFor="remarks"
              className="text-black font-semibold nowrap"
            >
              Remarks
            </label>
          </div>
          <div className="text-left flex items-end">
            <p className="text-gray-800 leading-relaxed w-fit">
              {leadDetails?.leadData?.remarks?.length > 30
                ? leadDetails?.leadData?.remarks?.slice(0, 30) + "..."
                : leadDetails?.leadData?.remarks}
            </p>
            {leadDetails?.leadData?.remarks?.length > 30 && (
              <button
                onClick={toggleDialog}
                className="ml-1 text-[11px] text-blue-600 hover:underline focus:outline-none"
              >
                {"Read More"}
              </button>
            )}
          </div>
        </div>
        <button
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full`}
          onClick={() => setEditCallDetails(true)}
        >
          Update
        </button>
      </div>
      {editCallDetails && (
        <Modal>
          <div className="bg-white rounded w-full max-w-2xl border border-gray-200 overflow-auto py-2 lg:pb-4 px-6 relative shadow-xl">
            <div className="flex w-full justify-between items-center py-2">
              <h2 className="text-base font-semibold">Remarks</h2>
              <button
                className="relative group"
                data-lable="update"
                onClick={() => setEditCallDetails(false)}
              >
                <AiOutlineClose
                  fontSize={18}
                  className="text-gray-400 group-hover:text-gray-500 font-bold"
                />
              </button>
            </div>

            <div className="mt-4">
              {/* Remarks Textarea */}
              <div className="mb-4">
                {/* <label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Remarks
                </label> */}
                <textarea
                  name="remarks"
                  id="remarks"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  rows="4"
                  placeholder="Enter your remarks here"
                  value={fields.remarks}
                  onChange={handleChange}
                />
              </div>

              {/* Row for Disposition, Sub-disposition, and Follow-up Date */}
              <div className="flex flex-wrap -mx-2">
                {/* Disposition Select */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="disposition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Disposition
                  </label>
                  <select
                    name="disposition"
                    id="disposition"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={fields.disposition}
                    onChange={handleChange}
                  >
                    {dispositions.map((disposition) => (
                      <option key={disposition} value={disposition}>
                        {disposition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-disposition Select */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="subDisposition"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sub-disposition
                  </label>
                  <select
                    name="subDisposition"
                    id="subDisposition"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={fields.subDisposition}
                    onChange={handleChange}
                  >
                    {subDispositions[fields.disposition].map((subDis) => (
                      <option key={subDis} value={subDis}>
                        {subDis}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Follow-up Date Input */}
                <div className="w-full md:w-1/3 px-2">
                  <label
                    htmlFor="followUpDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Follow-up Date
                  </label>
                  <input
                    name="followUpDate"
                    type="datetime-local"
                    id="followUpDate"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6 flex w-full justify-end">
                  <button
                    onClick={updateLeadStage}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-5">
              <h2 className="text-base font-semibold text-gray-800">Remarks</h2>
              <p className="mt-2 text-sm text-gray-600">
                {leadDetails?.leadData?.remarks}
              </p>
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={toggleDialog}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-5">
              <h2 className="text-base font-semibold text-gray-800">
                Requirement
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {
                  leadDetails?.leadData[
                    "whats_is_your_requirement_?_write_in_brief"
                  ]
                }
              </p>
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={toggleVisible}
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

const LeadsCount = ({ leadsCount, refetch }) => {
  return (
    <div className="mt-4 border-b-1 border-gray-200 relative">
      <button className="absolute left-0 top-0" onClick={refetch}>
        Refresh
      </button>
      <div className="flex gap-4 mt-8">
        <div className="py-4 rounded">
          <div className="text-center">
            <h4 className="font-normal text-gray-700 text-center text-lg mt-4">
              Total Leads
            </h4>
            <h2 className="font-semibold text-gray-700 text-center text-2xl mt-4">
              {leadsCount ? leadsCount?.totalLeadsAssigned : "NA"}
            </h2>
          </div>
        </div>
        <div className="py-4 rounded">
          <div className="text-center">
            <h4 className="font-normal text-gray-700 text-center text-lg mt-4">
              Today Worked
            </h4>
            <h2 className="font-semibold text-gray-700 text-center text-2xl mt-4">
              {leadsCount ? leadsCount?.leadsUpdatedToday : "NA"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
