import { units } from "@/lib/data/servicePanelData";
import React, { useRef, useState } from "react";
import CustomInput from "../uiCompoents/CustomInput";
import CustomSelector from "../uiCompoents/CustomSelector";

const AddNewProductView = () => {
  const productSchema = {
    title: "",
    brand: "",
    category: "",
    subCategory: "",
    ingredients: "",
    MRP: null,
    material: null,
    thickness: null,
    dimension: null,
    measuringUnit: "",
    quantityOrSize: "",
    foodType: "",
    description: "",
    shelfLife: "",
    FSSAI_Lic_No: null,
    countryOfOrigin: "",
  };
  const productFieldNames = {
    title: "Prduct title",
    brand: "Brand",
    category: "Product Category",
    subCategory: "Sub Category",
    ingredients: "Ingredients",
    MRP: "MRP",
    material: "Material",
    thickness: "Thickness",
    dimension: "Dimensions",
    measuringUnit: "Measuring unit",
    quantityOrSize: "Quantity or Size",
    foodType: "Food Type",
    description: "Description",
    shelfLife: "Shelf Life",
    FSSAI_Lic_No: "FSSAI License no",
    countryOfOrigin: "Coutry of origin",
  };

  const [product, setProduct] = useState(productSchema);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const simpleFields = [
    "title",
    "brand",
    "ingredients",
    "material",
    "dimension",
    "description",
    "countryOfOrigin",
    "thickness",
  ];

  const simpleFieldsWithNum = ["FSSAI_Lic_No", "MRP", "quantityOrSize"];
  const selectors = {
    category: [],
    subCategory: [],
    measuringUnit: units,
  };

  const rowItemStyle = "w-full my-1";

  const isValidImageSize = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        console.log("width, height", width, height);
        URL.revokeObjectURL(img.src); // Clean up object URL
        if (width >= 500 && width <= 1025 && height >= 500 && height <= 1025) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const onChangeFile = async (e) => {
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    const isValid = await isValidImageSize(file);

    if (!isValid) {
      toast.error("Image dimensions must be between 500x500 and 1000x1000.");
      return;
    }

    if (inputRef?.current?.value) {
      inputRef.current.value = "";
    }
    const { url, message } = await uploadFile(file);
    if (url) {
      setFile(file);
      setProduct((pre) => ({ ...pre, tempImageURL: url }));
    } else {
      toast.error(message || "Error uploading file");
    }
  };

  const onChangeValue = (value, key) => {
    setProduct((pre) => ({ ...pre, [key]: value }));
  };

  return (
    <div className="w-[85vw] sm:w-[45vw] md:w-[30vw] h-[85vh] overflow-auto rounded-md p-4">
      <div className="w-full h-full flex flex-col">
        <div className="h-[90%] w-full overflow-auto mt-2 py-2 px-3">
          <div
            className={`${rowItemStyle} my-2 pt-3 flex gap-2 flex-col items-start`}
          >
            <img
              src={product.tempImageURL || product.image}
              className="h-24 w-24 rounded-full shadow-xl border"
            />
            <button
              onClick={() => {
                inputRef?.current?.click();
              }}
              className="text-blue-500 underline"
            >
              Change image
            </button>

            <input
              accept="image/*"
              type={"file"}
              className="hidden"
              ref={inputRef}
              onChange={onChangeFile}
            />
          </div>

          {Object.keys(productSchema)?.map((key) => {
            if (
              simpleFields?.includes(key) ||
              simpleFieldsWithNum?.includes(key)
            ) {
              return (
                <div className={`${rowItemStyle} my-2 pt-3`}>
                  <CustomInput
                    label={productFieldNames[key] || key}
                    value={product[key]}
                    type={
                      simpleFieldsWithNum?.includes(key) ? "number" : "string"
                    }
                    onChangeValue={(value) => onChangeValue(value, key)}
                    icon={getIcon(key)}
                  />
                </div>
              );
            } else if (selectors[key]) {
              return (
                <div className={`${rowItemStyle} my-2 pt-3`}>
                  <CustomSelector
                    label={productFieldNames[key] || key}
                    options={selectors[key]}
                    value={product[key]}
                    onChangeValue={(value) => onChangeValue(value, key)}
                    icon={getIcon(key)}
                  />
                </div>
              );
            }
          })}
        </div>

        <div className="h-[10%] w-full flex justify-center gap-3 items-center">
          <button
            onClick={close}
            className="bg-blue-500 rounded py-1 px-3 h-fit text-white"
          >
            Cancel
          </button>
          <button
            onClick={updateDetails}
            className="bg-colorPrimary rounded py-1 px-3 h-fit text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProductView;
