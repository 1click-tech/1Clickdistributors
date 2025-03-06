import manufacturerContext from "@/lib/context/manufacturerContext";
import React, { useContext, useEffect, useState } from "react";
import CustomInput from "../uiCompoents/CustomInput";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdEmail, MdKeyboardArrowUp, MdVpnKey } from "react-icons/md";
import { FaCity, FaNetworkWired } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { CiSaveUp2 } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosSave } from "react-icons/io";
import TaxDetails from "./profileComponents/TaxDetails";
import BankDetails from "./profileComponents/BankDetails";
import BusinessDetails from "./profileComponents/BusinessDetails";

const rowStyle = "w-full flex justify-between py-1 flex-col md:flex-row gap-4";
const rowItemStyle = "w-full md:w-[46%]";
const iconStyle = "text-[10px]";

const Profile = () => {
  const { userDetails } = useContext(manufacturerContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showSections, setShowSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    full_name: "",
    phone_number: null,
    email: null,
    password: "",
    city: "",
  });

  useEffect(() => {
    if (userDetails) {
      setData({
        full_name: userDetails?.full_name,
        phone_number: userDetails?.phone_number,
        email: userDetails?.email,
        password: userDetails.password,
        city: userDetails.city,
      });
    }
  }, [userDetails]);

  const saveChanges = async () => {
    try {
      // setIsEditing(false);
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUserProfile`;
      let body = { ...data };
      body.phone_number = parseInt(body.phone_number) || null;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const ress = await response.json();
      if (ress.success) {
        toast.success(ress.message);
        queryClient.invalidateQueries(["currentUserDetail"]);
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      console.log("error in savechanges", error.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const onChangeValue = (value, fieldName) => {
    setData((pre) => ({ ...pre, [fieldName]: value }));
  };

  return (
    <div className="w-full h-full p-2 flex flex-col items-center gap-2">
      {/* {loading && (
        <div className="my-1 w-full flex justify-center absolute top-0 left-0">
          <img src="/loader.gif" className="h-10 w-10" />
        </div>
      )} */}
      <div className="w-[95%] lg:w-[80%] mt-2 ">
        <h1 className="text-gray-700 font-semibold text-xl px-2">
          Personal Details
        </h1>
        <div className="p-3 w-full bg-white rounded-md mt-1">
          {/* user small details */}
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                className="h-[70px] w-auto border border-blue-200 shadow-large rounded-full"
                src={userDetails?.userImageLink}
              />

              <div className="flex flex-col gap-[2px]">
                <span className="text-gray-500 font-semibold text-base">
                  {userDetails?.full_name}
                </span>
                <span className="text-sm text-orange-800 bg-orange-200/30 py-[1px] px-2 rounded-full w-fit">
                  Manufacturer
                </span>
                <span className="text-sm text-[#1b4c7d] rounded-full flex gap-1 items-center">
                  <CiLocationOn />
                  {userDetails?.city}, {userDetails?.country}
                </span>
              </div>
            </div>

            {/* <div className="flex gap-2 h-fit items-center">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-2 md:px-3 flex items-center h-fit w-fit gap-2 rounded py-1 text-xs sm:text-sm md:text-sm bg-blue-500 text-white hover:bg-blue-500/80"
              >
                <MdVpnKey />
                Change Password
              </button>
            </div> */}
          </div>

          {/* Profile Details here */}

          <div className="w-full flex flex-col gap-4 mt-7">
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Your Name"}
                  value={data?.full_name}
                  onChangeValue={(value) => onChangeValue(value, "full_name")}
                  disabled={!isEditing}
                  icon={<FaUser className={`${iconStyle}`} />}
                />
              </div>

              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Designation"}
                  value={data?.designation}
                  disabled={true}
                  icon={<FaNetworkWired className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Your Email"}
                  value={userDetails?.email}
                  disabled={true}
                  icon={<MdEmail className={`${iconStyle}`} />}
                />
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Alt Email"}
                  onChangeValue={(value) => onChangeValue(value, "altEmail")}
                  value={data?.altEmail}
                  disabled={!isEditing}
                  icon={<MdEmail className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Your Phone"}
                  value={data?.phone_number}
                  onChangeValue={(value) =>
                    onChangeValue(value, "phone_number")
                  }
                  type="number"
                  disabled={!isEditing}
                  icon={<FaPhoneAlt className={`${iconStyle}`} />}
                />
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={`City`}
                  value={data?.city}
                  onChangeValue={(value) => onChangeValue(value, "city")}
                  type="text"
                  icon={<FaCity className={`${iconStyle}`} />}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className={`w-full flex justify-end mt-6 gap-3`}>
              {/* <button
                onClick={() =>
                  queryClient.invalidateQueries(["currentUserDetail"])
                }
                className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
              >
                <CiSaveUp2 />
                refetchData
              </button> */}
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  disabled={loading}
                  className="px-2 md:px-3 flex disabled:bg-gray-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-gray-600 text-white hover:bg-gray-600/80 w-fit"
                >
                  Cancel
                </button>
              )}
              {isEditing ? (
                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="px-2 md:px-3 flex disabled:bg-blue-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
                >
                  <IoIosSave />
                  {loading ? "Saving..." : "Save changes"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-sm bg-colorPrimary text-white hover:bg-colorPrimary/80 w-fit"
                >
                  <MdOutlineEdit />
                  Edit details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[95%] lg:w-[80%] mt-2 ">
        <div
          className={`w-full flex justify-between p-2 ${
            showSections.includes("businessDetails")
              ? "bg-transparent"
              : "bg-white rounded-md"
          }`}
        >
          <h1 className="text-gray-700 font-semibold text-xl">
            Business Details
          </h1>

          {showSections.includes("businessDetails") ? (
            <button>
              <MdKeyboardArrowUp
                onClick={() => setShowSections([])}
                className="text-2xl"
              />
            </button>
          ) : (
            <button>
              <MdKeyboardArrowDown
                onClick={() => setShowSections(["businessDetails"])}
                className="text-3xl"
              />
            </button>
          )}
        </div>
        {showSections.includes("businessDetails") && <BusinessDetails />}
      </div>

      {/* Tax details */}
      <div className="w-[95%] lg:w-[80%] mt-2 ">
        <div
          className={`w-full flex justify-between p-2 ${
            showSections.includes("taxDetails")
              ? "bg-transparent"
              : "bg-white rounded-md"
          }`}
        >
          <h1 className="text-gray-700 font-semibold text-xl">Tax Details</h1>

          {showSections.includes("taxDetails") ? (
            <button>
              <MdKeyboardArrowUp
                onClick={() => setShowSections([])}
                className="text-2xl"
              />
            </button>
          ) : (
            <button>
              <MdKeyboardArrowDown
                onClick={() => setShowSections(["taxDetails"])}
                className="text-3xl"
              />
            </button>
          )}
        </div>
        {showSections.includes("taxDetails") && <TaxDetails />}
      </div>

      {/* Bank details */}
      <div className="w-[95%] lg:w-[80%] mt-2 ">
        <div
          className={`w-full flex justify-between p-2 ${
            showSections.includes("bankDetail")
              ? "bg-transparent"
              : "bg-white rounded-md"
          }`}
        >
          <h1 className="text-gray-700 font-semibold text-xl">Bank Details</h1>

          {showSections.includes("bankDetail") ? (
            <button>
              <MdKeyboardArrowUp
                onClick={() => setShowSections([])}
                className="text-2xl"
              />
            </button>
          ) : (
            <button>
              <MdKeyboardArrowDown
                onClick={() => setShowSections(["bankDetail"])}
                className="text-3xl"
              />
            </button>
          )}
        </div>
        {showSections.includes("bankDetail") && <BankDetails />}
      </div>
    </div>
  );
};

export default Profile;
