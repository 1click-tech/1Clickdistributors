import React from "react";

const CustomInput = ({ label, type = "text", value, setValue, icon }) => {
  return (
    <div
      className="w-full relative
     border border-colorPrimary outline-gray-300 outline-2 rounded p-[4px] md:p-[8px]"
    >
      <input
        type={type}
        value={value}
        disabled={true}
        className="w-full border-none outline-none text-orange-800 text-[12px] nd:text-sm bg-white"
      />
      <span className="absolute flex items-center gap-1 font-[500] -top-[10px] py-0 rounded px-2 text-[10px] md:text-[12px] left-2 text-white bg-colorPrimary overflow-auto flex-nowrap text-nowrap">
        {icon}
        {label}
      </span>
    </div>
  );
};

export default CustomInput;
