import manufacturerContext from "@/lib/context/manufacturerContext";
import React, { useContext, useEffect, useState } from "react";
import CustomInput from "@/components/uiCompoents/CustomInput";
import {
  MdOutlineCurrencyRupee,
  MdOutlinePersonPinCircle,
} from "react-icons/md";
import { FaAddressCard, FaBuilding, FaNetworkWired } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import CustomSelector from "@/components/uiCompoents/CustomSelector";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { IoIosSave } from "react-icons/io";
import { company_types } from "@/lib/data/commonData";

const rowStyle = "w-full flex justify-between py-1 flex-col md:flex-row gap-4";
const rowItemStyle = "w-full md:w-[46%]";
const iconStyle = "text-[10px]";

const BusinessDetails = () => {
  const { userDetails } = useContext(manufacturerContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    company_name: "",
    company_type: null,
    turnOver: null,
    address: "",
    pinCode: null,
    companyEstablishedAt: null,
    businessCity: "",
    businessState: "",
    country: "",
  });

  useEffect(() => {
    if (userDetails) {
      setData({
        company_name: userDetails?.company_name || "",
        company_type: userDetails?.company_type || "",
        turnOver: userDetails?.turnOver || null,
        address: userDetails.address || "",
        pinCode: userDetails.pinCode || null,
        companyEstablishedAt: userDetails.companyEstablishedAt || null,
        businessState: userDetails.businessState,
        businessCity: userDetails.businessCity,
        country: userDetails.country,
      });
    }
  }, [userDetails]);

  const saveChanges = async () => {
    try {
      let body = { ...data };
      body.pinCode = parseInt(body.pinCode) || null;
      body.turnOver = parseInt(body.turnOver) || null;
      setLoading(true);

      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/updateUserProfile`;
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

  const values = [
    { label: "Thousands", value: "thousand" },
    { label: "Lakhs", value: "lakh" },
    { label: "Crores", value: "crore" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full">
        <div className="p-3 w-full bg-white rounded-md">
          {/* Profile Details here */}
          <div className="w-full flex flex-col gap-4 mt-7">
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Company Name"}
                  value={data?.company_name}
                  onChangeValue={(value) =>
                    onChangeValue(value, "company_name")
                  }
                  disabled={!isEditing}
                  icon={<FaBuilding className={`${iconStyle}`} />}
                />
              </div>

              <div className={`${rowItemStyle}`}>
                <CustomSelector
                  label={"Company type"}
                  options={company_types}
                  value={data?.company_type}
                  icon={<FaNetworkWired className={`${iconStyle}`} />}
                  onChangeValue={(value) =>
                    onChangeValue(value, "company_type")
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div
                className={`${rowItemStyle} flex items-center justify-between`}
              >
                <div className="w-[100%]">
                  <CustomInput
                    label={"Turnover (annually)"}
                    value={data?.turnOver}
                    onChangeValue={(value) => onChangeValue(value, "turnOver")}
                    type="number"
                    disabled={!isEditing}
                    icon={<MdOutlineCurrencyRupee className={`${iconStyle}`} />}
                  />
                </div>
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Year of establishment"}
                  onChangeValue={(value) =>
                    onChangeValue(value, "companyEstablishedAt")
                  }
                  type="number"
                  value={data?.companyEstablishedAt}
                  disabled={!isEditing}
                  icon={<FaAddressCard className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Address"}
                  onChangeValue={(value) => onChangeValue(value, "address")}
                  value={data?.address}
                  disabled={!isEditing}
                  icon={<FaAddressCard className={`${iconStyle}`} />}
                />
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Pincode"}
                  value={data?.pinCode}
                  onChangeValue={(value) => onChangeValue(value, "pinCode")}
                  type="number"
                  disabled={!isEditing}
                  icon={<MdOutlinePersonPinCircle className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Business city"}
                  onChangeValue={(value) =>
                    onChangeValue(value, "businessCity")
                  }
                  value={data?.businessCity}
                  disabled={!isEditing}
                  icon={<FaAddressCard className={`${iconStyle}`} />}
                />
              </div>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"State"}
                  value={data?.businessState}
                  onChangeValue={(value) =>
                    onChangeValue(value, "businessState")
                  }
                  type="text"
                  disabled={!isEditing}
                  icon={<MdOutlinePersonPinCircle className={`${iconStyle}`} />}
                />
              </div>
            </div>
            <div className={`${rowStyle}`}>
              <div className={`${rowItemStyle}`}>
                <CustomInput
                  label={"Country"}
                  onChangeValue={(value) => onChangeValue(value, "country")}
                  value={data?.country}
                  disabled={!isEditing}
                  icon={<FaAddressCard className={`${iconStyle}`} />}
                />
              </div>
            </div>

            <div className={`w-full flex justify-end mt-6 gap-3`}>
              {isEditing ? (
                <>
                  <button
                    onClick={saveChanges}
                    disabled={loading}
                    className="px-2 md:px-3 flex disabled:bg-blue-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-blue-600 text-white hover:bg-blue-600/80 w-fit"
                  >
                    <IoIosSave />
                    {loading ? "Saving..." : "Save changes"}
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    disabled={loading}
                    className="px-2 md:px-3 flex disabled:bg-gray-300 disabled:animate-pulse items-center gap-2 rounded py-1 text-xs sm:text-sm md:text-base bg-gray-600 text-white hover:bg-gray-600/80 w-fit"
                  >
                    Cancel
                  </button>
                </>
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
    </div>
  );
};

export default BusinessDetails;
