import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  MdArrowBack,
  MdClose,
  MdCurrencyRupee,
  MdDeleteOutline,
} from "react-icons/md";
import ProductDetailView, { EditProduct } from "./ProductDetailView";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Modal from "../utills/Modal";
import AddNewProductView from "./AddNewProductView";

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [showAddNewProductModal, setShowAddNewProductModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getAllProductsOfUser`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        if (selectedProduct) {
          let found = data?.products.find(
            (item) => item.productId === selectedProduct.productId
          );
          if (found != -1) {
            setSelectedProduct(found);
          }
        }

        return data?.products;
      } else {
        toast.error(data.message || "Something went wrong");
        return null;
      }
    } catch (error) {
      console.log("error in getting products", error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const { data: products, refetch: refetchProducts } = useQuery({
    queryKey: ["userProducts"],
    queryFn: getUserProducts,
  });

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 769) {
        setIsSmallDevice(true);
      } else {
        setIsSmallDevice(false);
      }
    };
    check();

    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="w-full h-full pt-5 flex flex-row px-1 md:px-3 overflow-hidden">
      {showAddNewProductModal && (
        <Modal>
          <div className="h-[85vh] w-[90vw] sm:w-[45vw] md:w-[30vw] bg-white relative rounded-md overflow-hidden">
            <button
              onClick={() => setShowAddNewProductModal(false)}
              className="text-white bg-red-500 p-1 absolute top-0 right-0"
            >
              <MdClose className="text-white text-xl" />
            </button>

            {/* <AddNewProductView /> */}
            <EditProduct product={null} close={() => {}} is />
          </div>
        </Modal>
      )}

      <div
        className={`${
          isSmallDevice ? (selectedProduct ? "hidden" : "flex w-full") : ""
        } w-full ${
          !selectedProduct ? "w-full" : "md:w-[60%]"
        }  h-full flex flex-col gap-2 items-center p-3 scrollbar-thin overflow-auto`}
      >
        <div className="flex gap-2 w-full items-center mt-3">
          <h1 className="text-lg text-start text-gray-600 font-semibold">
            My Products
          </h1>
          <button
            onClick={() => setShowAddNewProductModal(true)}
            className="text-white bg-blue-500 py-1 text-sm px-3 rounded-md"
          >
            Add New Product
          </button>

          <button onClick={refetchProducts}>Refetch</button>
        </div>

        {loading && (
          <div className="my-3 w-full">
            <img src="/loader.gif" className="h-[35px] w-[35px]" />
          </div>
        )}
        <div className="w-full flex flex-col gap-3">
          {Array.isArray(products) ? (
            products.length ? (
              products?.map((item) => {
                return (
                  <div
                    className="w-full bg-white/60 h-auto rounded-md overflow-hidden flex gap-2 p-3 cursor-pointer hover:bg-blue-100/20 items-center"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <div className="w-[70px] h-[80px] sm:w-[110px] sm:h-[110px] rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/products.png"}
                        alt="Item Image"
                        width={110}
                        height={110}
                        priority
                        objectFit="contain"
                      />
                    </div>

                    <div className="flex flex-1 flex-col items-start py-2 ml-5">
                      <h1 className="text-sm sm:text-base font-semibold text-orange-800">
                        {item.title} , {item.brand}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-orange-800 text-[10px] sm:text-xs py-[2px] px-2 rounded-full bg-orange-500/20">
                          {item.category}
                          <span className="text-[11px] ml-1">
                            ({item.subCategory})
                          </span>
                        </span>

                        <div className="flex items-center gap-1">
                          <MdCurrencyRupee className="text-xs sm:text-base text-orange-800" />
                          <span className="text-orange-800 text-xs sm:text-sm">
                            {item.MRP}
                          </span>
                        </div>
                      </div>

                      <p className="text-orange-700/60 mt-1 text-xs sm:text-sm">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 hidden">
                        <CiEdit className="text-blue-700 text-lg cursor-pointer" />
                        <MdDeleteOutline className="text-red-700 text-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1 className="text-lg text-gray-600 font-semibold mt-4">
                Did not found any product. Add some
              </h1>
            )
          ) : null}
        </div>
      </div>

      {selectedProduct && (
        <div
          className={`${
            isSmallDevice ? (selectedProduct ? "w-full" : "hidden") : ""
          } w-full ${
            selectedProduct ? "md:w-[40%]" : "w-0"
          }  h-full sticky top-0 flex justify-center`}
        >
          <div className="h-[97%] w-full md:w-[95%] rounded-md">
            <ProductDetailView
              product={selectedProduct}
              close={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
