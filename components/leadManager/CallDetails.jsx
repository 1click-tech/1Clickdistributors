import React, { useEffect, useState } from "react";
import { dispositions, subDispositions } from "@/lib/data/commonData";
import { MdEdit } from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";
import { convertTimeStamp } from "@/lib/commonFunctions";

const CallDetails = ({ data, onClose }) => {
  const { leadData } = data;

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

  const toggleEditCallDetails = () => {
    setEditCallDetails(!editCallDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const updateLeadStage = async () => {
    try {
      if (!fields.followUpDate || !fields.remarks) {
        toast.error("Please select follow up date");
        return;
      }
      const body = {
        leadId: leadData.leadId,
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
        onClose();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in updateLead", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white w-[30%] max-w-[512px] border border-gray-200 overflow-auto p-2 relative">
      <button
        className="bg-gray-200 absolute right-0 top-0 py-1 px-2"
        onClick={toggleEditCallDetails}
      >
        <MdEdit className="text-gray-700 text-3xl" />
      </button>
      <h2 className="font-normal text-gray-700 text-center text-2xl mt-4">
        Call Details
      </h2>

      <div className="mt-4 p-4">
        <div className="flex items-start gap-2">
          <div className="flex-1 text-left">
            <label
              htmlFor="name"
              className=" text-gray-700 font-semibold nowrap"
            >
              Name:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">{leadData?.full_name}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="companyName"
              className=" text-gray-700 font-semibold nowrap"
            >
              Company Name:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">{leadData?.company_name}</p>
          </div>
        </div>
        {/* <div className="flex items-start gap-2 mt-4">
          <label
            htmlFor="designation"
            className=" text-gray-700 font-semibold nowrap"
          >
            Designation:
          </label>
          <select
            disabled={!editCallDetails}
            className={`border p-2 rounded-md border-gray-400 w-full`}
            name={"designation"}
          >
            {designations?.map((designantion, idx) => (
              <option key={idx.toString()} value={designantion}>
                {designantion}
              </option>
            ))}
          </select>
        </div> */}
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="phone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Contact Number:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">
              {leadData?.phone_number || leadData.mobile_number}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="altPhone"
              className=" text-gray-700 font-semibold nowrap"
            >
              Alt Contact Number:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">
              {leadData?.altPhoneNumber || "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="city"
              className=" text-gray-700 font-semibold nowrap"
            >
              City:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">{leadData?.city}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="requirement"
              className=" text-gray-700 font-semibold nowrap"
            >
              Requirement:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">
              {leadData["whats_is_your_requirement_?_write_in_brief"] || "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="disposition"
              className=" text-gray-700 font-semibold nowrap"
            >
              Disposition:
            </label>
          </div>
          <div className="flex-1 text-left">
            {editCallDetails ? (
              <select
                className={`border p-2 rounded-md border-gray-400 w-full max-w-72`}
                name="disposition"
                id="disposition"
                value={fields.disposition}
                onChange={handleChange}
              >
                {dispositions?.map((disposition, idx) => (
                  <option key={idx.toString()} value={disposition}>
                    {disposition}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-base text-gray-700">
                {leadData?.disposition || "NA"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="subDisposition"
              className=" text-gray-700 font-semibold nowrap"
            >
              Sub-Disposition:
            </label>
          </div>
          <div className="flex-1 text-left">
            {editCallDetails ? (
              <select
                className={`border p-2 rounded-md border-gray-400 w-full max-w-72`}
                name="subDisposition"
                value={fields.subDisposition}
                onChange={handleChange}
              >
                {subDispositions[fields.disposition]?.map(
                  (subDisposition, idx) => (
                    <option key={idx.toString()} value={subDisposition}>
                      {subDisposition}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p className="text-base text-gray-700">
                {leadData?.subDisposition || "NA"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="lastCallBackDate"
              className=" text-gray-700 font-semibold nowrap"
            >
              Last Call Back Date:
            </label>
          </div>
          <div className="flex-1 text-left">
            <p className="text-base text-gray-700">
              {leadData?.lastCallBackDate
                ? moment(leadData.lastCallBackDate).toLocaleString()
                : "NA"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-4">
          <div className="flex-1 text-left">
            <label
              htmlFor="followUpDate"
              className=" text-gray-700 font-semibold nowrap"
            >
              Next Call Back Date:
            </label>
          </div>
          <div className="flex-1 text-left">
            {editCallDetails ? (
              <input
                type="datetime-local"
                id="followUpDate"
                name="followUpDate"
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none`}
                onChange={handleChange}
              />
            ) : (
              <p className="text-base text-gray-700">
                {leadData?.followUpDate
                  ? convertTimeStamp(leadData.followUpDate)
                  : "NA"}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="min-w-fit text-left">
            <label
              htmlFor="remarks"
              className=" text-gray-700 font-semibold nowrap"
            >
              Remarks:
            </label>
          </div>
          <div className="flex-1 items-start justify-start">
            {editCallDetails ? (
              <input
                disabled={!editCallDetails}
                id="remarks"
                name="remarks"
                value={fields.remarks}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Remarks"
                onChange={handleChange}
              />
            ) : (
              <p className="text-base text-gray-700">
                {leadData?.remarks || "NA"}
              </p>
            )}
          </div>
        </div>
        <button
          disabled={!editCallDetails}
          className={`mt-8 bg-colorPrimary text-white p-2 rounded-md w-full ${
            editCallDetails ? "opacity-100" : "opacity-70"
          }`}
          onClick={updateLeadStage}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CallDetails;