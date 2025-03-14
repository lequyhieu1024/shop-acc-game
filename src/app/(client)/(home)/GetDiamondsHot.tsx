"use client";
import React from "react";
// import image from "../../../../public/client/assets/images/image.jpg";
// import BoxCommon from "@/components/(client)/(common)/BoxCommon";

const GetDiamondsHot = () => {
  // const products = [
  //   {
  //     id: 1,
  //     name: "M4A1 Phong Cách Naruto",
  //     played: "6970",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 1
  //   },
  //   {
  //     id: 2,
  //     name: "AK47 Rồng Xanh Lv 7",
  //     played: "1953",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 2
  //   },
  //   {
  //     id: 3,
  //     name: "Lật thẻ săn kim cương",
  //     played: "17777",
  //     price: "9.000",
  //     oldPrice: "11.250",
  //     discount: "20%",
  //     image: image.src,
  //     top: 3
  //   },
  //   {
  //     id: 4,
  //     name: "Pịc Cà Bón săn Kim Cương",
  //     played: "17374",
  //     price: "9.000",
  //     oldPrice: "18.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 4
  //   },
  //   {
  //     id: 5,
  //     name: "Lật hình săn M1014 Huyết...",
  //     played: "68101",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 5
  //   },
  //   {
  //     id: 6,
  //     name: "M4A1 Phong Cách Naruto",
  //     played: "6970",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 6
  //   },
  //   {
  //     id: 7,
  //     name: "AK47 Rồng Xanh Lv 7",
  //     played: "1953",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 7
  //   },
  //   {
  //     id: 8,
  //     name: "Lật thẻ săn kim cương",
  //     played: "17777",
  //     price: "9.000",
  //     oldPrice: "11.250",
  //     discount: "20%",
  //     image: image.src,
  //     top: 8
  //   },
  //   {
  //     id: 9,
  //     name: "Pịc Cà Bón săn Kim Cương",
  //     played: "17374",
  //     price: "9.000",
  //     oldPrice: "18.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 9
  //   },
  //   {
  //     id: 10,
  //     name: "Lật hình săn M1014 Huyết...",
  //     played: "68101",
  //     price: "19.000",
  //     oldPrice: "38.000",
  //     discount: "50%",
  //     image: image.src,
  //     top: 10
  //   }
  // ];
  // const productCount = products.length;

  // const maxCols = 5; // Tối đa 5 cột trên 1 hàng
  // const cols = productCount <= maxCols ? productCount : maxCols;
  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="flex justify-between items-center mb-4">
  //       <div className="flex items-center">
  //         <div className="w-7 h-7 mr-2">
  //           <svg
  //             viewBox="0 0 24 24"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <circle cx="12" cy="12" r="12" fill="#E84C3D" />
  //             <path
  //               d="M12 4L14.5 9.5L20 10.5L16 14.5L17 20L12 17.5L7 20L8 14.5L4 10.5L9.5 9.5L12 4Z"
  //               fill="#FFF"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-bold">Nhận Kim Cương Siêu Hot</h2>
  //       </div>
  //       <Link
  //         href="/diamonds"
  //         className="text-gray-600 hover:text-blue-600 flex items-center"
  //       >
  //         Xem thêm <RightOutlined className="ml-1" />
  //       </Link>
  //     </div>

  //     <div
  //       className={`grid grid-cols-${cols} md:grid-cols-${cols} lg:grid-cols-${cols} gap-4`}
  //     >
  //       {products.slice(0, 10).map((product) => (
  //         <Card

  //           key={product.id}
  //           hoverable
  //           className="border rounded-lg overflow-hidden"
  //           cover={
  //             <div className="relative h-[150px] bg-gray-100 overflow-hidden">
  //               <div
  //                 className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full flex items-center justify-center z-10"
  //                 style={{
  //                   backgroundColor:
  //                     product.top === 1
  //                       ? "#FF9800"
  //                       : product.top === 2
  //                       ? "#E91E63"
  //                       : product.top === 3
  //                       ? "#9C27B0"
  //                       : product.top === 4
  //                       ? "#2196F3"
  //                       : "#00BCD4"
  //                 }}
  //               >
  //                 <div className="flex items-center justify-center">
  //                   <svg
  //                     width="16"
  //                     height="16"
  //                     viewBox="0 0 24 24"
  //                     fill="none"
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     className="mr-1"
  //                   >
  //                     <path
  //                       d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z"
  //                       fill="white"
  //                     />
  //                   </svg>
  //                   Top {product.top}
  //                 </div>
  //               </div>
  //               <div className="w-full h-full relative overflow-hidden group">
  //                 <div
  //                   className="absolute inset-0 bg-cover bg-center transition-transform duration-400 ease-in-out group-hover:scale-110"
  //                   style={{
  //                     backgroundImage: `url(${product.image.src})`,
  //                     backgroundSize: "cover"
  //                   }}
  //                 ></div>
  //               </div>
  //             </div>
  //           }
  //         >
  //           <h3 className="text-sm font-medium mb-1 truncate">
  //             {product.name}
  //           </h3>
  //           <div className="text-xs text-gray-500 mb-2">
  //             Đã chơi: {product.played}
  //           </div>
  //           <div className="flex items-center">
  //             <span className="text-blue-600 font-bold mr-2">
  //               {product.price}
  //             </span>
  //             <span className="text-gray-400 line-through text-xs mr-2">
  //               {product.oldPrice}
  //             </span>
  //             <Tag color="pink" className="m-0 leading-none text-xs">
  //               {product.discount}
  //             </Tag>
  //           </div>
  //         </Card>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
      <h1>GetDiamondsHot</h1>
    // <BoxCommon
    //   title="Nhận Kim Cương Siêu Hot"
    //   items={products}
    //   badgeText={undefined}
    // />
  );
};

export default GetDiamondsHot;
