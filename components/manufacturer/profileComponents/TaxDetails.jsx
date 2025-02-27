import React, { useState } from "react";
import { MdOutlineVerified } from "react-icons/md";

const TaxDetails = () => {
  const [files, setFiles] = useState({ gst: null, pan: null, tan: null });
  const [uploadStatus, setUploadStatus] = useState({
    gst: false,
    pan: false,
    tan: false,
  });

  const handleFileChange = (type) => (event) => {
    const file = event.target.files[0];
    if (file) setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUpload = (type) => () => {
    setTimeout(() => {
      setUploadStatus((prev) => ({ ...prev, [type]: true }));
      setFiles((prev) => ({ ...prev, [type]: null }));
    }, 1000);
  };

  const documentTypes = [
    { label: "GST", value: "gst" },
    { label: "PAN", value: "pan" },
    { label: "TAN", value: "tan" },
  ];

  const images = {
    gst: "/gst.png",
    pan: "/pan.png",
    tan: "/tan.png",
  };

  return (
    <div className="flex justify-between items-center w-full bg-white rounded-md py-3 px-2">
      {documentTypes.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 w-[32%] py-2"
          >
            <img
              className="h-[60px] w-[60px] object-contain"
              src={images[item.value]}
            />
            <div className="flex flex-col items-center">
              <div className="w-full flex items-center justify-center">
                <label className="text-gray-700 font-semibold text-base">
                  {item.label}
                </label>
                {uploadStatus[item.value] && !files[item.value] && (
                  <MdOutlineVerified className="text-xl text-green-600 ml-1" />
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange(item.value)}
                className="hidden"
                id={item.value}
              />
              {!files[item.value] && !uploadStatus[item.value] && (
                <label
                  htmlFor={item.value}
                  className="text-blue-500 underline text-sm cursor-pointer"
                >
                  {"Choose a file"}
                </label>
              )}
              {files[item.value] && (
                <div className="flex gap-2 items-center">
                  <label className="text-gray-500 text-xs">
                    {files[item.value]?.name}
                  </label>
                  <button
                    onClick={handleUpload(item.value)}
                    className="text-white font-semibold text-xs bg-blue-500 py-[1px] px-3 rounded"
                  >
                    Upload
                  </button>
                </div>
              )}

              {uploadStatus[item.value] && !files[item.value] && (
                <div className="flex items-center justify-center gap-2">
                  <label className="text-green-500 text-sm">{"uploaded"}</label>
                  <label
                    htmlFor={item.value}
                    className="text-blue-500 underline text-sm cursor-pointer"
                  >
                    {"Change"}
                  </label>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaxDetails;
