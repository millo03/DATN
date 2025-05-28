// import { Link } from "react-router-dom";
// import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
// import { RecycleIcon } from "../../../resources/svg/Icon/Icon";
// import { IProduct } from "../../../common/interfaces/Product";
// import useLocalStorage from "../../../common/hooks/Storage/useStorage";
// import { List_Cart } from "../../../common/hooks/Cart/querry_Cart";
// import { TotalPrice } from "../../../components/common/Client/_component/Icons";

// const MiniCart = () => {
//     const [user] = useLocalStorage("user", {});
//     const account = user?.user;
//     const userId = user?.user?._id;
//     const { data, isLoading, isError } = List_Cart(userId);
//     console.log(data?.products?.productId);



//     return (
//         <div
//             className="absolute rounded bg-white z-[50 mb:w-[70vw] lg:w-[25vw] right-0 group-hover:scale-100 scale-0 shadow-2xl
//     p-4 group-hover:translate-y-[15px] lg:group-hover:translate-x-0 group-hover:translate-x-1/2 translate-x-1/2 -translate-y-1/2
//     before:absolute before:w-[65px] before:h-[40px] before:right-[-5px] before:top-0 before:translate-y-[-20px] before:bg-none"
//         >
//             {account ? (
//                 <>
//                     {!data?.products || data?.products.length === 0 ? (
//                         <div className="w-full h-[200px] flex flex-col justify-center items-center">
//                             <img src="../../src/assets/Images/Products/no_products.png" className="w-44 h-40" alt="" />
//                             <p>Chưa có sản phẩm nào</p>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="mb-[20px]">
//                                 {/* <span className="text-sm">
//                                     You have {calculateTotalProduct()} items in your cart
//                                 </span> */}
//                             </div>
//                             <div className="grid h-full grid-flow-rows">
//                                 {data?.products?.map((item: any, index: number) => (
//                                     <div
//                                         className="border-b w-full grid grid-cols-[70px_auto] py-[20px] gap-3 auto-rows-[70px]"
//                                         key={index}
//                                     >
//                                         <div className="">
//                                             <img
//                                                 className="relative w-full h-full duration-300"
//                                                 src={item?.productId?.image_product}
//                                                 alt={item?.productId?.name_product}
//                                             />
//                                         </div>
//                                         <div className="w-full flex justify-between">
//                                             <div className="flex flex-col *:text-sm justify-between">
//                                                 <span>{item.productId?.name_product}</span>
//                                                 <strong>
//                                                     {item?.quantity} x ${item?.productId?.price_product}
//                                                 </strong>
//                                                 <span>{item?.color_item} - {item?.name_size}</span>
//                                             </div>
//                                             <div className="flex items-end cursor-pointer">
//                                                 {/* <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeProductInCart.mutate(item.productId)
//                                                     }
//                                                 >
//                                                     <RecycleIcon />
//                                                 </button> */}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div>
//                                 <div className="flex justify-between items-center my-6">
//                                     <strong>Subtotal</strong>
//                                     <strong>${TotalPrice()}</strong>
//                                 </div>
//                                 <div className="flex flex-col gap-y-[20px] *:rounded-md *:w-full *:h-[55px] *:grid *:place-items-center *:text-sm">
//                                     <Link
//                                         onClick={ScrollTop}
//                                         to="/cart"
//                                         className="bg-black text-white cursor-pointer"
//                                     >
//                                         View Cart
//                                     </Link>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </>
//             ) : (
//                 <div className="text-center p-4">
//                     <p>Please login to view your cart</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MiniCart;
