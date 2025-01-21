import React from "react";

const ProductsPage = () => {
  const products = [
    {
      name: "Rice",
      image:
        "https://cdn.britannica.com/17/176517-050-6F2B774A/Pile-uncooked-rice-grains-Oryza-sativa.jpg",
    },
    {
      name: "Wheat",
      image:
        "https://goodineverygrain.ca/wp-content/uploads/2021/06/wheat-berries-bowl.png",
    },
    {
      name: "Ragi",
      image:
        "https://organicmandya.com/cdn/shop/files/Fingermillet_Ragi.jpg?v=1719903862&width=1024",
    },
    {
      name: "Corn",
      image:
        "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/6/28/fresh-corn-on-the-cob-partially-shucked-on-dark-background.jpg.rend.hgtvcom.1280.1280.85.suffix/1687987003387.webp",
    },
    {
      name: "Rajma",
      image:
        "https://biobasics.org/cdn/shop/files/order-organic-rajima-chitra-online-at-bio-basics.png?v=1736601880&width=823",
    },
    {
      name: "Groundnut",
      image: "https://aarogyamastu.in/wp-content/uploads/2022/11/Groundnut.png",
    },
  ];
  return (
    <div className="w-full h-full pt-5 flex flex-col px-3 ">
      <h1 className="text-lg text-gray-600 font-semibold mt-2">My Products</h1>
      <div className="w-full flex flex-1 overflow-auto scrollbar-thin flex-wrap mt-3 justify-start gap-2">
        {products?.map((item) => {
          return (
            <div className="w-[230px] h-[240px] sm:h-[200px] md:h-[240px] shadow-md rounded-md overflow-hidden flex flex-col justify-start">
              <img src={item.image} className="h-[87%] w-full bg-cover" />
              <h1 className="text-sm font-semibold text-orange-800 text-center">
                {item.name}
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
