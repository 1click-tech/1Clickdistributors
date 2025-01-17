import manufacturerContext from "@/lib/context/manufacturerContext";
import panelContext from "@/lib/context/panelContext";
import React, { useContext, useEffect, useState } from "react";
import CustomInput from "../uiCompoents/CustomInput";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdEmail, MdKeyboardArrowUp, MdOutlinePassword } from "react-icons/md";
import { FaBuilding } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { CiSaveUp2 } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";

const rowStyle = "w-full flex justify-between py-1 flex-col md:flex-row gap-4";
const rowItemStyle = "w-full md:w-[46%]";
const iconStyle = "text-[10px]";

const Profile = () => {
  const { userDetails } = useContext(manufacturerContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showSections, setShowSections] = useState([]);

  const [data, setData] = useState({
    name: "",
    phone: null,
    email: null,
    password: "",
  });

  useEffect(() => {
    if (userDetails) {
      setData({
        name: userDetails?.name,
        phone: userDetails?.phone,
        email: userDetails?.email,
        password: userDetails.password,
      });
    }
  }, [userDetails]);

  const saveChanges = async () => {
    try {
      console.log("data is", data);
      setIsEditing(false);
    } catch (error) {
      console.log("error in savechanges", error.message);
    }
  };

  const onChangeValue = (value, fieldName) => {
    setData((pre) => ({ ...pre, [fieldName]: value }));
  };

  return (
    <div className="w-full h-full p-2 flex flex-col items-center gap-2">
      <div className="w-[95%] lg:w-[80%] mt-2 ">
        <h1 className="text-gray-700 font-semibold text-xl px-2">
          Profile Details
        </h1>
        <div className="p-3 w-full bg-white rounded-md mt-1">
          {/* user small details */}
          <div className="w-full flex gap-2">
            <img
              className="h-[70px] w-auto border border-blue-200 shadow-large rounded-full"
              src={userDetails?.userImageLink}
            />

            <div className="flex flex-col gap-[2px]">
              <span className="text-gray-500 font-semibold text-base">
                {userDetails?.name}
              </span>
              <span className="text-sm text-orange-800 bg-orange-200/30 py-[1px] px-2 rounded-full w-fit">
                Manufacturer
              </span>
              <span className="text-sm text-[#1b4c7d] rounded-full flex gap-1 items-center">
                <CiLocationOn />
                Noida, Uttar Pradesh
              </span>
            </div>
          </div>

          {/* Profile Details here */}

          <div className="w-full flex flex-col gap-4 mt-7">
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Your Name"}
                  value={data?.name}
                  onChangeValue={(value) => onChangeValue(value, "name")}
                  disabled={!isEditing}
                  icon={<FaUser className={`${iconStyle}`} />}
                />
              </div>

              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Your Phone"}
                  value={data?.phone}
                  onChangeValue={(value) => onChangeValue(value, "phone")}
                  type="number"
                  disabled={!isEditing}
                  icon={<FaPhoneAlt className={`${iconStyle}`} />}
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
                  label={"Your Password"}
                  value={data?.password}
                  onChangeValue={(value) => onChangeValue(value, "password")}
                  disabled={!isEditing}
                  icon={<MdOutlinePassword className={`${iconStyle}`} />}
                />
              </div>
            </div>

            <div className={`w-full flex justify-end mt-6`}>
              {isEditing ? (
                <button
                  onClick={saveChanges}
                  className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
                >
                  <CiSaveUp2 />
                  Save changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-sm bg-colorPrimary text-white hover:bg-colorPrimary/80 w-fit"
                >
                  <MdOutlineEdit />
                  Save profile changes
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
        {showSections.includes("businessDetails") && <BusinessProfile />}
      </div>
    </div>
  );
};

export default Profile;

const BusinessProfile = () => {
  const { userDetails } = useContext(manufacturerContext);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="p-3 w-full bg-white rounded-md mt-1">
        {/* business Details here */}
        <div className="w-full flex flex-col gap-4 mt-7">
          <div className={`${rowStyle}`}>
            <div className={`${rowItemStyle}`}>
              <CustomInput
                label={"Company Name"}
                value={userDetails?.name}
                icon={<FaUser className={`${iconStyle}`} />}
              />
            </div>
            <div className={`${rowItemStyle}`}>
              <CustomInput
                label={"GST number"}
                value={userDetails?.email}
                icon={<MdEmail className={`${iconStyle}`} />}
              />
            </div>
          </div>
          <div className={`${rowStyle}`}>
            <div className={`${rowItemStyle}`}>
              <CustomInput
                label={"Contact number"}
                value={userDetails?.phone}
                type="number"
                icon={<FaPhoneAlt className={`${iconStyle}`} />}
              />
            </div>
            <div className={`${rowItemStyle}`}>
              <CustomInput
                label={"Ownership Type"}
                value={userDetails?.department}
                icon={<FaBuilding className={`${iconStyle}`} />}
              />
            </div>
          </div>

          <div className={`w-full flex justify-end mt-6`}>
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
              >
                <CiSaveUp2 />
                Save changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-2 md:px-3 flex items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-sm bg-colorPrimary text-white hover:bg-colorPrimary/80 w-fit"
              >
                <MdOutlineEdit />
                Save profile changes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
