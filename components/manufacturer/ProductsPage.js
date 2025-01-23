import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdCurrencyRupee, MdDeleteOutline } from "react-icons/md";

const ProductsPage = () => {
  const products = [
    {
      name: "Rice",
      image:
        "https://cdn.britannica.com/17/176517-050-6F2B774A/Pile-uncooked-rice-grains-Oryza-sativa.jpg",
      price: 100,
      pricePer: "kg",
      description: "The premium quality of basmati Rice with long fine grains.",
      productType: "Grains",
    },
    {
      name: "Wheat",
      image:
        "https://goodineverygrain.ca/wp-content/uploads/2021/06/wheat-berries-bowl.png",
      price: 50,
      pricePer: "kg",
      description: "Freshly harvested wheat, perfect for making chapatis.",
      productType: "Grains",
    },
    {
      name: "Ragi",
      image:
        "https://organicmandya.com/cdn/shop/files/Fingermillet_Ragi.jpg?v=1719903862&width=1024",
      price: 60,
      pricePer: "kg",
      description: "High-quality ragi, great for healthy and nutritious meals.",
      productType: "Millets",
    },
    {
      name: "Corn",
      image:
        "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/6/28/fresh-corn-on-the-cob-partially-shucked-on-dark-background.jpg.rend.hgtvcom.1280.1280.85.suffix/1687987003387.webp",
      price: 30,
      pricePer: "kg",
      description:
        "Sweet and fresh corn, ideal for boiling, grilling, or salads.",
      productType: "Vegetables",
    },
    {
      name: "Rajma",
      image:
        "https://biobasics.org/cdn/shop/files/order-organic-rajima-chitra-online-at-bio-basics.png?v=1736601880&width=823",
      price: 120,
      pricePer: "kg",
      description:
        "Premium organic rajma with rich flavor and high protein content.",
      productType: "Legumes",
    },
    {
      name: "Groundnut",
      image: "https://aarogyamastu.in/wp-content/uploads/2022/11/Groundnut.png",
      price: 80,
      pricePer: "kg",
      description:
        "Crunchy and fresh groundnuts, perfect for snacking or cooking.",
      productType: "Nuts",
    },
  ];

  return (
    <div className="w-full h-full pt-5 flex flex-col px-3 overflow-auto">
      <h1 className="text-lg text-gray-600 font-semibold mt-2">My Products</h1>
      <div className="w-full flex flex-col gap-3 md:w-[50%]">
        {products?.map((item) => {
          return (
            <div className="w-full bg-white/60 h-auto rounded-md overflow-hidden flex gap-2 p-3">
              <img
                src={item.image}
                className="h-[100px] w-[90px] bg-cover rounded-md"
              />

              <div className="flex flex-1 flex-col items-start py-2 ml-5">
                <h1 className="text-base font-semibold text-orange-800">
                  {item.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-orange-800 text-xs py-[2px] px-2 rounded-full bg-orange-500/20">
                    {item.productType}
                  </span>

                  <div className="flex items-center gap-1">
                    <MdCurrencyRupee className="text-base text-orange-800" />
                    <span className="text-orange-800 text-sm">
                      {item.price}/{item.pricePer}
                    </span>
                  </div>
                </div>

                <p className="text-orange-700/60 mt-1 text-sm">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <CiEdit className="text-blue-700 text-lg cursor-pointer" />
                  <MdDeleteOutline className="text-red-700 text-lg cursor-pointer" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
