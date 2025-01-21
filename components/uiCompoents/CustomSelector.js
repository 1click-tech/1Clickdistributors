import React from "react";

const CustomSelector = ({
  label,
  value,
  icon,
  disabled,
  onChangeValue,
  options,
  ...props
}) => {
  return (
    <div
      className={`w-full relative
     border ${
       disabled ? "border-[#c37f4f]" : "border-colorPrimary"
     } outline-gray-300 outline-2 rounded p-[4px] md:p-[8px]`}
    >
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChangeValue && onChangeValue(e.target.value)}
        className="w-full border-none outline-none text-orange-900 disabled:text-orange-700 text-[12px] nd:text-sm bg-white"
        {...props}
      >
        <option>{props?.firstLabel || "Select"}</option>

        {Array.isArray(options) &&
          options?.map((item) => (
            <option selected={value == item.value} value={item.value}>
              {item.label}
            </option>
          ))}
      </select>
      {label && (
        <span
          className={`absolute flex items-center gap-1 font-[500] -top-[10px] py-0 rounded px-2 text-[10px] md:text-[12px] left-2 text-white ${
            disabled ? "bg-[#c37f4f]" : "bg-colorPrimary"
          } overflow-auto flex-nowrap text-nowrap`}
        >
          {icon}
          {label}
        </span>
      )}
    </div>
  );
};

export default CustomSelector;
