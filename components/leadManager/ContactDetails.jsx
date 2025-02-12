import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { designations } from "@/lib/data/commonData";
import { toast } from "react-toastify";

const defaultFields = [
  {
    field: "full_name",
    label: "Name",
    type: "text",
  },
  {
    field: "designation",
    label: "Designation",
    type: "select",
    options: designations,
  },
  {
    field: "phone_number",
    label: "Phone Number",
    type: "number",
  },
  {
    field: "mobile_number",
    label: "Alt Phone Number",
    type: "number",
  },
  {
    field: "contactNumber_3",
    label: "Contact Number 3",
    type: "number",
  },
  {
    field: "contactNumber_4",
    label: "Contact Number 4",
    type: "number",
  },
  {
    field: "email_1",
    label: "Email 1",
    type: "email",
  },
  {
    field: "email_2",
    label: "Email 2",
    type: "email",
  },
];

const contactFields = [
  {
    field: "name",
    label: "Name",
    type: "text",
  },
  {
    field: "designation",
    label: "Designation",
    type: "select",
    options: designations,
  },
  {
    field: "phone_number",
    label: "Phone Number",
    type: "number",
  },
  {
    field: "mobile_number",
    label: "Alt Phone Number",
    type: "number",
  },
  {
    field: "email_1",
    label: "Email 1",
    type: "email",
  },
  {
    field: "email_2",
    label: "Email 2",
    type: "email",
  },
  {
    field: "address",
    label: "Address",
    type: "text",
  },
];

const ContactDetails = ({ data: lead, refetch }) => {
  const leadData = lead?.leadData;
  const { register, handleSubmit, setValue } = useForm();

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (leadData) {
      setValue("full_name", leadData?.full_name || "");
      setValue("designation", leadData?.designation || "");
      setValue("phone_number", leadData?.phone_number || "");
      setValue("mobile_number", leadData?.mobile_number || "");
      setValue("contactNumber_3", leadData?.contactNumber_3 || "");
      setValue("contactNumber_4", leadData?.contactNumber_4 || "");
      setValue("email_1", leadData?.email_1 || "");
      setValue("email_2", leadData?.email_2 || "");
      setValue("officeContact.name", leadData?.officeContact?.name || "");
      setValue(
        "officeContact.designation",
        leadData?.officeContact?.designation || ""
      );
      setValue(
        "officeContact.phone_number",
        leadData?.officeContact?.phone_number || ""
      );
      setValue(
        "officeContact.mobile_number",
        leadData?.officeContact?.mobile_number || ""
      );
      setValue("officeContact.email_1", leadData?.officeContact?.email_1 || "");
      setValue("officeContact.email_2", leadData?.officeContact?.email_2 || "");
      setValue("officeContact.address", leadData?.officeContact?.address || "");
      setValue("altContact.name", leadData?.altContact?.name || "");
      setValue(
        "altContact.designation",
        leadData?.altContact?.designation || ""
      );
      setValue(
        "altContact.phone_number",
        leadData?.altContact?.phone_number || ""
      );
      setValue(
        "altContact.mobile_number",
        leadData?.altContact?.mobile_number || ""
      );
      setValue("altContact.email_1", leadData?.altContact?.email_1 || "");
      setValue("altContact.email_2", leadData?.altContact?.email_2 || "");
      setValue("altContact.address", leadData?.altContact?.address || "");
    }
  }, [setValue, leadData]);

  const toggleEdit = () => setEdit(!edit);

  const updateContactDetails = async (data) => {
    try {
      if (!lead?.leadData?.leadId) {
        toast.error("Something went wrong");
        return;
      }

      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/sales/contactDetails`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactDetails: data,
          leadId: lead?.leadData?.leadId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        refetch();
        setEdit(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("error in contact details", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full relative">
      <button
        className="bg-gray-200 py-1 px-2 absolute top-0 right-0"
        onClick={toggleEdit}
      >
        <MdEdit className="text-gray-700 text-3xl" />
      </button>
      <form onSubmit={handleSubmit(updateContactDetails)} className="p-4">
        {defaultFields.map((item, index) => (
          <div className="flex items-center gap-4 mt-2" key={index}>
            <LeftBox>
              <label className="text-gray-700 font-semibold">
                {item.label}
              </label>
            </LeftBox>
            <RightBox>
              {item.type === "select" ? (
                <select
                  {...register(item.field)}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                >
                  <option value="">Select {item.label}</option>
                  {item.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(item.field)}
                  placeholder={`Enter ${item.label}`}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                  type={item.type}
                />
              )}
            </RightBox>
          </div>
        ))}
        <h3 className="text-black text-base font-semibold mt-6">
          Alternative Contact Details
        </h3>
        {contactFields.map((item, index) => (
          <div className="flex items-center gap-4 mt-2" key={index}>
            <LeftBox>
              <label className="text-gray-700 font-semibold">
                {item.label}
              </label>
            </LeftBox>
            <RightBox>
              {item.type === "select" ? (
                <select
                  {...register(`altContact.${item.field}`)}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                >
                  <option value="">Select {item.label}</option>
                  {item.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(`altContact.${item.field}`)}
                  placeholder={`Enter ${item.label}`}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                  type={item.type}
                />
              )}
            </RightBox>
          </div>
        ))}
        <h3 className="text-black text-base font-semibold mt-6">
          Office Contact Details
        </h3>
        {contactFields.map((item, index) => (
          <div className="flex items-center gap-4 mt-2" key={index}>
            <LeftBox>
              <label className="text-gray-700 font-semibold">
                {item.label}
              </label>
            </LeftBox>
            <RightBox>
              {item.type === "select" ? (
                <select
                  {...register(`officeContact.${item.field}`)}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                >
                  <option value="">Select {item.label}</option>
                  {item.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(`officeContact.${item.field}`)}
                  placeholder={`Enter ${item.label}`}
                  className="input-field flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none md:w-72"
                  type={item.type}
                />
              )}
            </RightBox>
          </div>
        ))}
        <button
          type="submit"
          className="mt-8 bg-colorPrimary text-white p-2 rounded-md w-full max-w-52"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

const LeftBox = ({ children }) => (
  <div className="w-40 text-left">{children}</div>
);
const RightBox = ({ children }) => (
  <div className="flex-1 text-left">
    <div className="max-w-64">{children}</div>
  </div>
);

export default ContactDetails;
