import React, { useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdEdit,
  MdOutlineCurrencyRupee,
  MdOutlineDescription,
} from "react-icons/md";
import CustomInput from "../uiCompoents/CustomInput";
import { CiLocationOn, CiShoppingBasket } from "react-icons/ci";
import { SiBrandfolder, SiCodeclimate } from "react-icons/si";
import { IoCartOutline } from "react-icons/io5";
import { GiBookshelf, GiSaltShaker } from "react-icons/gi";
import { RxDimensions } from "react-icons/rx";
import { IoIosResize } from "react-icons/io";
import { FaBowlFood } from "react-icons/fa6";
import { GrLicense } from "react-icons/gr";
import { uploadFile, uploadMediaFileToDB } from "@/lib/commonFunctions";
import { toast } from "react-toastify";
import CustomSelector from "../uiCompoents/CustomSelector";
import { units } from "@/lib/data/servicePanelData";
import { useQueryClient } from "@tanstack/react-query";

const ProductDetailView = ({ product, close }) => {
  const [selectedView, setSelectedView] = useState("specifications");
  const [showEditView, setShowEditView] = useState(false);
  const exempted = ["image", "description"];
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center ">
      <div className="flex md:hidden justify-start items-center px-3">
        <MdArrowBack
          className="text-orange-800 text-xl cursor-pointer"
          onClick={close}
        />
      </div>
      <div className="h-[94%] mt-1 w-full bg-white flex flex-col p-1 relative rounded-md">
        {showEditView ? (
          <EditProduct data={product} close={() => setShowEditView(false)} />
        ) : (
          <>
            <div className="w-full flex bg-orange-500/10">
              <div
                onClick={() => setSelectedView("specifications")}
                className={`w-[50%] h-fit p-2 flex justify-center cursor-pointer ${
                  selectedView == "specifications"
                    ? "bg-colorPrimary text-white hover:bg-colorPrimary/80"
                    : "bg-transparent text-orange-800 hover:bg-colorPrimary/30"
                }`}
              >
                <h1 className="uppercase text-sm md:text-base">
                  specifications
                </h1>
              </div>
              <div
                onClick={() => setSelectedView("description")}
                className={`w-[50%] h-fit p-2 flex justify-center cursor-pointer ${
                  selectedView == "description"
                    ? "bg-colorPrimary text-white hover:bg-colorPrimary/80"
                    : "bg-transparent text-orange-800 hover:bg-colorPrimary/10"
                }`}
              >
                <h1 className="uppercase text-sm md:text-base">Description</h1>
              </div>
            </div>
            <div className="flex flex-1 w-full overflow-auto flex-col mt-4">
              {selectedView == "specifications" &&
                Object.keys(product || {})
                  .filter(
                    (key) =>
                      typeof product[key] != "object" &&
                      !exempted?.includes(key)
                  )
                  .map((key) => {
                    return (
                      <div className="flex flex-col sm:flex-row odd:bg-blue-50 w-full items-start text-xs md:text-sm px-4 py-2">
                        <span className="sm:w-[40%] text-wrap overflow-hidden font-semibold text-gray-600 uppercase">
                          {key}:
                        </span>
                        <span className="sm:w-[60%] text-wrap overflow-hidden text-gray-500 capitalize">
                          {product[key]}
                        </span>
                      </div>
                    );
                  })}

              {selectedView == "description" && (
                <div>
                  <p className="text-gray-600 px-4 py-2">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShowEditView(true), console.log("i am here");
              }}
              className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-tl-md z-[1]"
            >
              <MdEdit className="text-lg text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailView;

export const getIcon = (key) => {
  const iconStyle = "text-base text-white";
  switch (key) {
    case "title":
      return <CiShoppingBasket className={`${iconStyle}`} />;
    case "brand":
      return <SiBrandfolder className={`${iconStyle}`} />;
    case "category":
      return <IoCartOutline className={`${iconStyle}`} />;
    case "subCategory":
      return <IoCartOutline className={`${iconStyle}`} />;
    case "ingredients":
      return <GiSaltShaker className={`${iconStyle}`} />;
    case "MRP":
      return <MdOutlineCurrencyRupee className={`${iconStyle}`} />;
    case "material":
      return <SiCodeclimate className={`${iconStyle}`} />;
    case "thickness":
      return <SiCodeclimate className={`${iconStyle}`} />;
    case "dimension":
      return <RxDimensions className={`${iconStyle}`} />;
    case "quantityOrSize":
      return <IoIosResize className={`${iconStyle}`} />;
    case "foodType":
      return <FaBowlFood className={`${iconStyle}`} />;
    case "description":
      return <MdOutlineDescription className={`${iconStyle}`} />;
    case "shelfLife":
      return <GiBookshelf className={`${iconStyle}`} />;
    case "FSSAI_Lic_No":
      return <GrLicense className={`${iconStyle}`} />;
    case "countryOfOrigin":
      return <CiLocationOn className={`${iconStyle}`} />;

    default:
      break;
  }
};

export const EditProduct = ({ data, close }) => {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
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
    category: [
      { label: "Fitness", value: "fitness" },
      { label: "Electronics", value: "electronics" },
      { label: "Fashion", value: "fashion" },
      { label: "Home & Kitchen", value: "home_kitchen" },
      { label: "Beauty & Personal Care", value: "beauty_personal_care" },
      { label: "Sports & Outdoors", value: "sports_outdoors" },
      { label: "Automotive", value: "automotive" },
      { label: "Toys & Games", value: "toys_games" },
      { label: "Books & Stationery", value: "books_stationery" },
      { label: "Health & Wellness", value: "health_wellness" },
    ],
    subCategory: [
      { label: "Gym Equipment", value: "gym_equipment" },
      { label: "Yoga Mats", value: "yoga_mats" },
      { label: "Dumbbells", value: "dumbbells" },
      { label: "Supplements", value: "supplements" },
      { label: "Wearables", value: "wearables" },
    ],
    measuringUnit: units,
  };

  useEffect(() => {
    if (data) {
      setProduct((pre) => ({ ...pre, ...data }));
    }
  }, [data]);

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

  const rowItemStyle = "w-full my-1";

  const feildsValidated = () => {
    if (!product.title || product.title?.length < 3) {
      toast.error("Product title must be atleast 3 characters long");
      return false;
    }
    if (product.MRP < 1) {
      toast.error("MRP must be greater than 0");
      return false;
    }
    if (!product.brand || product.brand?.length < 3) {
      toast.error("Brand name must be atleast 3 characters long");
      return false;
    }
    if (!product.description || product.description?.length < 10) {
      toast.error("Description must be atleast 10 characters long");
      return false;
    }

    return true;
  };

  const updateDetails = async () => {
    try {
      // setIsEditing(false);

      // if (!feildsValidated()) {
      //   return;
      // }

      let body = { ...product };

      // uncomment later
      // if (file) {
      //   console.log("file is", file);
      //   const resp = await uploadMediaFileToDB(file, `/products/${file.name}`);
      //   console.log("resp", resp);
      //   body.image = resp.downloadURL;
      //   delete body.tempImageURL;
      // }

      delete body.tempImageURL;
      setUploading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/updateProduct`;
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
        queryClient.invalidateQueries(["userProducts"]);
        close();
      } else {
        toast.error(ress.message || "Something went wrong");
      }
    } catch (error) {
      console.log("error in updatePrduct", error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
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
          disabled={uploading}
          className="bg-colorPrimary disabled:bg-colorPrimary/40 disabled:animate-pulse rounded py-1 px-3 h-fit text-white"
        >
          {uploading ? "Saving.." : "Save"}
        </button>
      </div>
    </div>
  );
};
