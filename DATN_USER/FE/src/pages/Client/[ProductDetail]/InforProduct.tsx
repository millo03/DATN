/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Mutation_Cart } from "../../../common/hooks/Cart/mutation_Carts";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { IProduct } from "../../../common/interfaces/Product";
import { Button } from "../../../components/ui/button";
import { Dow, Up } from "../../../resources/svg/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { message, Rate } from "antd";
import useStoreZustand from "../../../Stores/useStore";

interface InforProductProp {
  product: IProduct;
}


const InforProduct: React.FC<InforProductProp> = ({ dataProps }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { setVisible } = useStoreZustand()
  const navi = useNavigate();
  const ref_validate_attr = useRef<HTMLSpanElement>(null);
  const [color, setColor] = useState();
  const [size, setSize] = useState();
  const [arr_size, setArr_Size] = useState<any>();
  const [price_attr, set_price_attr] = useState(0);
  const [quantity_attr, setQuantity_attr] = useState();
  const [quantity_item, setQuantity_item] = useState<number>(1);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [selectedSizeQuantity, setSelectedSizeQuantity] = useState<number>(0);
  const dataItem = dataProps?.products;
  const { name_product, price_product, _id, stock } = dataItem;
  const [user] = useLocalStorage("user", {});
  const account = user?.user;
  const { mutate } = Mutation_Cart("ADD");

  useEffect(() => {
    if (!dataProps?.products?.attributes) {
      setQuantity_attr(stock);
      setTotalQuantity(stock);
    } else {
      const firstColor = dataProps?.products?.attributes?.values[0];
      if (firstColor) {
        setArr_Size(firstColor.size);
        setColor(firstColor.color);
      }
      const total = dataProps?.products?.attributes?.values.reduce(
        (acc: number, attr: any) => acc + attr.size.reduce((sum: number, size: any) => sum + size.stock_attribute, 0),
        0
      );
      setTotalQuantity(total);
    }
  }, [dataProps]);

  const addCart = (id?: string | number, action?: string) => {
    if (account) {
      if (quantity_attr) {
        if (quantity_item > 0) {
          let item: any = {
            userId: account,
            productId: id,
            price_item_attr: (dataProps?.products?.sale > 0) ? price_attr * (1 - dataProps?.products?.sale / 100) : price_attr,
            quantity: quantity_item,
            color: color,
            size: size,
          };
          if (action === "checkout") {
            item = {
              ...item,
              status_checked: true,
            };
          }
          mutate(item);
          if (action === "checkout") {
            navi("/cart");
          }
          setVisible(dataProps?.products?.image_product);
        }
        else {
          messageApi.destroy();
          messageApi.open({
            type: "error",
            content: "Số lượng phải lớn hơn 0!",
          });
        }
      } else {
        text_validate();
      }
    } else {
      navi("/login");
    }
  };

  function text_validate() {
    ref_validate_attr?.current?.classList.add("block");
    ref_validate_attr?.current?.classList.remove("hidden");
  }

  function handle_atrtribute(item?: any, action?: any) {
    switch (action) {
      case "Color":
        setQuantity_item(1);
        setSize(undefined);
        setQuantity_attr(undefined);
        ref_validate_attr?.current?.classList.add("hidden");
        ref_validate_attr?.current?.classList.remove("block");
        dataItem?.attributes?.values?.filter((i: any) => {
          if (i?.color == item) {
            i?.size?.filter((j: any) => {
              j.name_size
                ? setArr_Size(i?.size)
                : (setQuantity_attr(j?.stock_attribute),
                  set_price_attr(j?.price_attribute),
                  setArr_Size(""));
            });
          }
        });
        return setColor(item);
      case "Size":
        setQuantity_item(1);
        ref_validate_attr?.current?.classList.add("hidden");
        ref_validate_attr?.current?.classList.remove("block");
        for (const i of dataProps?.products?.attributes?.values) {
          if (i?.color == color) {
            for (const k of i.size) {
              if (k?.name_size == item) {
                setQuantity_attr(k?.stock_attribute);
                setSelectedSizeQuantity(k?.stock_attribute);
                setSize(k.name_size);
                set_price_attr(k?.price_attribute);
              }
            }
          }
        }
        return;
      default:
        return;
    }
  }

  function handle_quantity_item(action: any) {
    switch (action) {
      case "dow":
        if (quantity_attr) {
          if (quantity_item > 1) {
            setQuantity_item(quantity_item - 1);
          }
        } else if (color || size) {
          if (quantity_item > 1) {
            setQuantity_item(quantity_item - 1);
          }
        } else {
          text_validate();
        }
        return;
      case "up":
        if (quantity_attr) {
          if (quantity_item < quantity_attr) {
            setQuantity_item(quantity_item + 1);
          } else {
            messageApi.destroy();
            messageApi.open({
              type: 'error',
              content: 'Vượt quá số lượng sản phẩm!',
            });
          }
        } else {
          text_validate();
        }
        return;
      default:
        return;
    }
  }
  let min =
    dataProps?.products?.attributes?.values[0]?.size[0]?.price_attribute ?? 0;
  let max =
    dataProps?.products?.attributes?.values[0]?.size[0]?.price_attribute ?? 0;
  let min_price_sale = 0;
  let max_price_sale = 0;
  if (dataProps?.products?.attributes) {
    const check_attr = new Set();
    const values_attributes = dataProps?.products?.attributes?.values?.filter(
      (item: any) => {
        if (check_attr.has(item?.color)) {
          return false;
        } else {
          check_attr.add(item?.color);
          return true;
        }
      }
    );
    for (const i of values_attributes) {
      for (const j of i.size) {
        if (j.price_attribute < min) {
          min = j.price_attribute;
        }
        if (j.price_attribute > max) {
          max = j.price_attribute;
        }
      }
    }
  }
  if (dataProps?.products?.sale || dataProps?.products?.sale > 0) {
    min_price_sale = min * (1 - dataProps?.products?.sale / 100);
    max_price_sale = min * (1 - dataProps?.products?.sale / 100);
  }

  const handleQuantityChange = (e: any) => {
    const value: string = e?.target?.value;
    if (/[^0-9]/.test(value) && value !== '' && value !== 'Backspace') {
      e.preventDefault();
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Vui lòng nhập số hợp lệ!",
      });
    } else {
      if (+value < 1) {
        setQuantity_item(0)
      } else {
        if (quantity_attr) {
          if (+value < quantity_attr) {
            setQuantity_item(+value)
          } else {
            messageApi.destroy();
            messageApi.open({
              type: "error",
              content: `Số lượng sản phẩm được phép mua là ${quantity_attr}`,
            });
            setQuantity_item(quantity_attr)
          }
        }
      }
    }
  };
  return (
    <div className="h-full w-full *:w-full lg:mt-2 mb:mt-5">
      {contextHolder}
      <div className="flex flex-col lg:gap-y-2">
        <div className="flex flex-col lg:gap-y-2">
          <span className="text-gray-700 font-bold lg:text-3xl mb:text-xl">
            {name_product}
          </span>
          <span>
            <Rate
              allowHalf
              allowClear={false}
              disabled={
                !!dataProps.products.averageRating ||
                !dataProps.products.averageRating
              }
              value={dataProps.products.averageRating || 0}
            />
          </span>

          <strong className="lg:text-2xl lg:mt-0 mb:mt-3.5 mb:text-xl lg:tracking-[-1.2px] font-medium lg:leading-[38.4px]"></strong>
          <div className="flex flex-col gap-y-2 justify-between">
            <div className="flex gap-x-2 items-end">
              {min && max ? (
                price_attr ? (
                  <div className="flex items-center gap-x-4">
                    {dataProps?.products?.sale > 0 &&
                      <span className="text-[#EB2606]">
                        {(price_attr * (1 - dataProps?.products?.sale / 100))?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    }
                    <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                      {price_attr?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                ) : min === max ? (
                  <div className="flex items-center gap-x-4">
                    {
                      dataProps?.products?.sale > 0 &&
                      <span className="text-[#EB2606]">
                        {max_price_sale?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    }
                    <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                      {max?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-4 *:flex *:items-center *:gap-x-2">
                    {
                      dataProps?.products?.sale > 0 &&
                      <div>
                        <span className="text-[#EB2606]">
                          {min_price_sale?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                        -
                        <span className="text-[#EB2606]">
                          {max_price_sale?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    }
                    <div>
                      <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                        {min?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                      -
                      <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                        {max?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-x-4">
                  {
                    dataProps?.products?.sale > 0 &&
                    <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                      {(price_product * (1 - dataProps?.products?.sale / 100))?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  }
                  <span className={`${(dataProps?.products?.sale > 0) ? 'text-gray-500 line-through' : 'text-[#EB2606]'}`}>
                    {price_product?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {dataProps?.products?.attributes && (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-4 lg:mt-2 mt-3 lg:pb-0 mb:pb-5 font-medium">
                {dataProps?.products?.attributes?.values?.map((item: any) => (
                  item?.symbol ? (
                    item?.symbol[0] === '#' ? (
                      <button
                        key={item?.color}
                        onClick={() => handle_atrtribute(item?.color, "Color")}
                        className={`w-8 h-8 rounded-full border-2 ${color === item?.color ? "border-black" : "border-gray-300"} ${item?.symbol === '#ffffff' || item?.symbol === '#fff' ? 'border-black' : 'border-white'} hover:scale-110 transition-transform duration-300`}
                        style={{ backgroundColor: item?.symbol }}
                      ></button>
                    ) : (
                      <button
                        key={item?.color}
                        onClick={() => (handle_atrtribute(item?.color, "Color"))}
                        className={`w-8 h-8 rounded-full border-2 ${color === item?.color ? "border-black" : "border-gray-300"} hover:scale-110 transition-transform duration-300`}
                      >
                        <img src={item?.symbol} alt="" className="w-full h-full object-cover rounded-full" />
                      </button>
                    )
                  ) : (
                    <button
                      key={item?.color}
                      onClick={() => handle_atrtribute(item?.color, "Color")}
                      className={`px-3 py-1 rounded border-2 ${color === item?.color ? "border-black" : "border-gray-300"} hover:scale-110 transition-transform duration-300`}
                    >
                      {item?.color}
                    </button>
                  )
                ))}
              </div>
            </div>
            {arr_size && (
              <div>
                <span className="text-lg lg:mt-[1px] mb:mt-3.5 lg:tracking-[-1.2px] font-medium lg:leading-[38.4px]">
                  Size
                </span>
                <div className="flex items-center gap-x-4 lg:mt-[2px] mt-[3px] lg:pb-0 mb:pb-[21px] font-medium *:px-3 *:py-1 *:rounded *:border *:border-black *:duration-200">
                  {arr_size?.map((item: any) => (
                    <button
                      key={Math.random()}
                      onClick={() => handle_atrtribute(item?.name_size, "Size")}
                      className={`${size == item?.name_size && "bg-black text-white"
                        } hover:bg-black hover:text-white grid place-items-center`}
                    >
                      {item?.name_size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className=" mt-2 *:w-full rounded-xl">
          <span ref={ref_validate_attr} className="hidden text-red-500 text-sm">
            Vui lòng chọn!
          </span>
          <div className=" flex lg:flex-row mb:flex-col lg:gap-y-0 gap-y-[17px] gap-x-8 lg:items-center mb:items-start">
            <div className="border lg:py-2.5 lg:pr-6  mb:py-1 mb:pl-2 mb:pr-[18px] *:text-xs flex items-center gap-x-3 rounded-xl">
              <div className="flex items-center *:w-9 *:h-9 gap-x-1 *:grid *:place-items-center">
                <button onClick={() => handle_quantity_item("dow")}>
                  <Dow />
                </button>
                {
                  quantity_attr ?
                    <input
                      onChange={(e) =>
                        handleQuantityChange(e)}
                      className="bg-[#F4F4F4] text-center rounded"
                      value={quantity_item}
                    /> : <input
                      className="bg-[#F4F4F4] text-center rounded cursor-not-allowed"
                      value={1}
                      disabled={true}
                    />
                }
                <button onClick={() => handle_quantity_item("up")}>
                  <Up />
                </button>
              </div>
              <span className="text-gray-800 lg:tracking-[0.5px] border-l pl-4 border-black">
                Còn lại {selectedSizeQuantity || totalQuantity} sản phẩm
              </span>
            </div>
          </div>
          {/* <div className="mt-3 flex items-center mb-4 gap-x-2 font-medium lg:text-xl lg:tracking-[0.7px] mb:text-base">
            <span>Tạm tính :</span>
            <span className="text-[#EB2606]">
              {(dataProps?.products?.attributes
                ? (
                  dataProps?.products?.sale > 0 ? (price_attr * (1 - dataProps?.products?.sale / 100)) * quantity_item : price_attr * quantity_item
                )
                : (price_product * quantity_item)
              )?.toLocaleString("vi", { style: "currency", currency: "VND" })}
            </span>
          </div> */}
          <div className="mt-5 flex items-center gap-x-5 font-medium lg:text-base mb:text-sm *:rounded *:duration-300 w-full">
            <Button
              className="hover:bg-black hover:text-white w-full lg:w-[20%]"
              onClick={() => addCart(_id)}
            >
              Thêm vào giỏ
            </Button>
            <Button
              onClick={() => addCart(_id, "checkout")}
              className="hover:bg-black hover:text-white w-full lg:w-[20%]"
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InforProduct;