"use client";

import React, { useEffect, useState } from "react";
import { panelRoles, roles } from "@/lib/data/commonData";
import { toast } from "react-toastify";

export const getSeniorRole = (department, currentRole) => {
  const roleData = panelRoles.find((role) => role.department === department);

  if (roleData && roleData.hierarchy) {
    const hierarchy = roleData.hierarchy;
    let indexOfHierarchy = hierarchy?.findIndex((item) => item == currentRole);
    if (indexOfHierarchy != -1) {
      let upperRoles = hierarchy.slice(0, indexOfHierarchy);
      if (upperRoles.length) {
        return upperRoles;
      }
      return null;
    } else {
      return null;
    }
  }
  return null;
};

const AdduserForm = ({ close, refetchUsers, allUsers }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    hierarchy: "",
    employeeId: "",
    isActive: true,
    senior: null,
  });
  const [loading, setLoading] = useState(false);
  // const [allLeaders, setAllLeaders] = useState(null);

  const [seniorPosition, setSeniorPosition] = useState(null);

  useEffect(() => {
    setData((pre) => ({ ...pre, senior: null }));
  }, [data.department, data.hierarchy]);

  useEffect(() => {
    if (
      !data.department ||
      !data.hierarchy ||
      data.hierarchy == "" ||
      data.department == ""
    ) {
      setSeniorPosition(null);
    } else {
      const pos = getSeniorRole(data.department, data.hierarchy);
      setSeniorPosition(pos);
    }
  }, [data]);

  const handleInputChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setData((pre) => ({ ...pre, [name]: value }));
  };

  // useEffect(() => {
  //   let leaders = allUsers.filter((item) => item?.hierarchy == "teamLead");
  //   setAllLeaders(leaders);
  // }, [allUsers]);

  let spanStyle =
    "text-slate-600 font-semibold text-base flex items-center gap-1";

  const handleAdduser = async () => {
    if (!data?.name || data.name == "" || data.name.length < 3) {
      return toast.error("Please enter a valid name");
    }

    if (!data?.email || data.email == "" || data.email.length < 10) {
      return toast.error("Please enter a valid email");
    }

    if (!data?.password || data.password == "" || data.password.length < 4) {
      return toast.error("Enter mimimum 4 words in password");
    }

    if (!data?.phone || data.phone == "" || data.phone.length < 5) {
      return toast.error("Enter valid phone number");
    }

    if (!data?.department || data.department == "") {
      return toast.error("Please choose department of user");
    }
    if (!data?.hierarchy || data.hierarchy == "") {
      return toast.error("Please choose Designation of user");
    }
    try {
      let body = { ...data };
      setLoading(true);
      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/admin/auth/createAuth`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
      });

      const response = await res.json();
      setLoading(false);
      if (response.success) {
        toast.success(response.message);
        refetchUsers();
        close();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter name
        </span>
        <input
          type="text"
          name="name"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter email
        </span>
        <input
          type="text"
          name="email"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter EmployeeId
        </span>
        <input
          type="text"
          name="employeeId"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.employeeId}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter user phone number
        </span>
        <input
          type="number"
          name="phone"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Enter password for user
        </span>
        <input
          type="text"
          name="password"
          required={true}
          className="w-full rounded-md border border-gray-300 p-1"
          value={data?.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Select department of user
        </span>
        <select
          className={`border p-1 rounded-md border-gray-400`}
          name="department"
          value={data.department}
          onChange={(e) => {
            handleInputChange(e), setData((pre) => ({ ...pre, hierarchy: "" }));
          }}
        >
          <option>Select department</option>
          {panelRoles?.map((role) => (
            <option
              value={role.department}
              selected={data?.department == role.department}
            >
              {role?.department}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full gap-1">
        <span className={`${spanStyle}`}>
          {/* <MdOutlineMailOutline /> */}
          Select Designation
        </span>
        <select
          className={`border p-1 rounded-md border-gray-400`}
          name="hierarchy"
          value={data.hierarchy}
          onChange={handleInputChange}
        >
          <option>Select</option>
          {panelRoles
            .filter((item) => item.department == data.department)?.[0]
            ?.hierarchy.map((item) => (
              <option value={item} selected={data?.hierarchy == item}>
                {item}
              </option>
            ))}
        </select>
      </div>

      {Array.isArray(seniorPosition) && seniorPosition.length > 0 && (
        <div className="flex flex-col w-full gap-1">
          <span className={`${spanStyle}`}>Select senior</span>
          <select
            className={`border p-1 rounded-md border-gray-400`}
            name="senior"
            value={data.senior}
            onChange={handleInputChange}
          >
            <option selected={!data.senior || data.senior == ""} value={""}>
              Select Senior
            </option>
            {allUsers
              ?.filter(
                (item) =>
                  item.department == data.department &&
                  seniorPosition.includes(item.hierarchy)
              )
              .map((item) => {
                return (
                  <option
                    className=""
                    value={item.id}
                    selected={data.senior == item.id}
                  >
                    {item.name} {`(${item.hierarchy})`}
                  </option>
                );
              })}
          </select>
        </div>
      )}

      <div className="mt-4 w-full">
        <button
          onClick={handleAdduser}
          disabled={loading}
          className={`w-full bg-colorPrimary py-1 rounded-md text-white oultine-none ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {loading ? "Adding.. wait" : "Add now"}
        </button>
      </div>
    </div>
  );
};

export default AdduserForm;
