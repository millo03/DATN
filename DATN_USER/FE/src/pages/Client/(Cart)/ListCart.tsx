/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Input,
  message,
  Popconfirm,
  Spin,
  Table,
  TableProps,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { filter_positive_Stock_Item } from "../../../_lib/Config/Filter_stock_cart_and_order";
import { Mutation_Cart } from "../../../common/hooks/Cart/mutation_Carts";
import { List_Cart } from "../../../common/hooks/Cart/querry_Cart";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import Dow_btn from "./_components/dow";
import { useToast } from '../../../components/ui/use-toast'
import Het_hang from "./_components/het_hang";
import Up_btn from "./_components/up";
import { Trash2 } from "lucide-react";
import { io } from "socket.io-client";
import { ToastAction } from "@radix-ui/react-toast";
import { Toaster } from "../../../components/ui/toaster";

interface DataType {
  key: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

const ListCart = () => {
  const socket = io("http://localhost:8888");
  const routing = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const { toast: toast_shadcn } = useToast();
  const { data, isLoading, isError, error } = List_Cart(userId);
  const { mutate: removeSingle } = Mutation_Cart("REMOVE");
  const { mutate: removeMultiple } = Mutation_Cart("REMOVE_MULTIPLE");
  const { mutate: handle_status_checked, isLoading: loading_btn_checkked } =
    Mutation_Cart("HANLDE_STATUS_CHECKED");
  useEffect(() => {
    socket.on("connect_error", () => {
      socket.disconnect();
    });
  }, [socket]);
  useEffect(() => {
    socket.on("res_message_delete_item", (data: any) => {
      toast_shadcn({
        title: "Thông báo!",
        description: `Rất tiếc, sản phẩm ${data?.name_product} không còn tồn tại!`,
        className: 'border border-gray-800 bg-white',
        action: (
          <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
        ),
      })
    });
  }, []);
  const { mutate: updateQuantity, isLoading: loading_update_quantity } =
    Mutation_Cart("UPDATEQUANTITY");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<any>(0);
  const remove_item = (item: any) => {
    const data_item = {
      userId: userId,
      id: item?._id,
    };
    removeSingle(data_item);
    messageApi.open({
      type: "success",
      content: `Đã xóa sản phẩm ${item?.productId?.name_product?.length > 20 ?
        item?.productId?.name_product?.slice(20) + '...' : item?.productId?.name_product}`,
    });
  };

  const handleRemoveMultiple = () => {
    const product_item = {
      userId: userId,
    };
    const data_cart = dataSort?.filter(
      (item: any) => item?.status_checked && item
    );
    if (data_cart.length === 0) {
      messageApi.open({
        type: "warning",
        content: "Vui lòng chọn sản phẩm để xóa!",
      });
      return;
    }
    removeMultiple(product_item);
    messageApi.open({
      type: "success",
      content: "Xóa thành công",
    });
  };

  const handleCheckboxChange = (productId: string, color: any, size: any) => {
    const item_client = {
      userId: userId,
      productId: productId,
      color: color,
      size: size,
    };
    handle_status_checked(item_client);
  };

  const handleQuantityClick = (productId: string, quantity: number) => {
    setEditingProductId(productId);
    setInputValue(quantity);
  };

  const handleBlur = (product: any, item: any) => {
    const check_color = item?.productId?.attributes?.values?.find(
      (a: any) => a?.color === item?.color_item
    );
    const check_size = check_color?.size?.find(
      (b: any) =>
        (b?.name_size?.trim() ? b?.name_size : undefined) === item?.name_size
    );
    // (inputValue > check_size?.stock_attribute) && setInputValue(check_size?.stock_attribute)
    if (inputValue !== product?.quantity) {
      if (inputValue > check_size?.stock_attribute) {
        messageApi.destroy();
        messageApi.open({
          type: "error",
          content: `Số lượng sản phẩm được mua là ${check_size?.stock_attribute}`,
        });
        setInputValue(check_size?.stock_attribute);
      }
      updateQuantity({
        userId: userId,
        productId: product?._id,
        quantity:
          inputValue > check_size?.stock_attribute
            ? check_size?.stock_attribute
            : inputValue,
      });
    }
  };
  const dataSort = data?.products?.filter(
    (product: any) =>
      product?.productId?._id && {
        key: product?.productId?._id,
        ...product,
      }
  );
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
      setInputValue(Number(value));
    }
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      key: "checkbox",
      dataIndex: "checkbox",
      render: (_: any, product: any) => {
        return (
          <Checkbox
            checked={product?.status_checked}
            onChange={() =>
              handleCheckboxChange(
                product?.productId,
                product?.color_item,
                product?.name_size
              )
            }
          ></Checkbox>
        );
      },
    },
    {
      key: "image",
      title: "Ảnh",
      dataIndex: "image",
      render: (_: any, product: any) => {
        return (
          <Link to={`/shops/${product?.productId?._id}`}>
            <img
              src={product?.productId?.image_product}
              className="w-[100px] h-[80px] object-cover"
              alt=""
            />
          </Link>
        );
      },
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, product: any) => (
        <>
          <Het_hang dataProps={product} />
          <Link
            to={`/shops/${product?.productId?._id}`}
            className="py-2 font-bold text-gray-900 hover:text-gray-900"
          >
            {product?.productId?.name_product}
          </Link>
          <p className="font-medium">
            {product?.color_item} - {product?.name_size}
          </p>
        </>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, product: any) => {
        return (
          <div className="font-medium">
            {product?.price_item.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      key: "quantity",
      title: "Số lượng",
      dataIndex: "quantity",
      render: (_: any, product: any) => {
        return (
          <div className="flex space-x-2">
            <Dow_btn
              dataProps={{
                id_item: product?.productId,
                quantity_item: product?.quantity,
                color: product?.color_item,
                size: product?.name_size,
              }}
            />
            {editingProductId === product?.productId ? (
              <Input
                value={inputValue}
                onChange={(e) => handleQuantityChange(e)}
                onBlur={() => handleBlur(product?.productId, product)}
                className="px-0 text-center !max-w-20"
              />
            ) : (
              <Input
                value={product?.quantity}
                onClick={() =>
                  handleQuantityClick(product?.productId, product?.quantity)
                }
                className="px-0 text-center !max-w-20"
              />
            )}
            <Up_btn
              dataProps={{
                id_item: product?.productId,
                quantity_item: product?.quantity,
                color: product?.color_item,
                size: product?.name_size,
              }}
            />
          </div>
        );
      },
    },
    {
      title: <span className="whitespace-nowrap">Tổng tiền</span>,
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_: any, product: any) => {
        return (
          <div className="font-medium">
            {(product?.total_price_item).toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      key: "action",
      dataIndex: "action",
      render: (_: any, product: any) => {
        return (
          <div>
            <Popconfirm
              className="text-red-500 cursor-pointer opacity-75 hover:opacity-100 duration-200 h-6"
              title="Xóa sản phẩm khỏi giỏ hàng?"
              description={`Bạn có chắc chắn muốn xóa sản phẩm ${product?.productId?.name_product?.length > 20
                ? product?.productId?.name_product?.slice(0, 20) + "..."
                : product?.productId?.name_product
                } khỏi giỏ hàng không?`}
              onConfirm={() => remove_item(product)}
              okText="Có"
              cancelText="Không"
            >
              <Trash2 />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const item_order_checkked = data?.products?.filter(
    (value: any) => value?.status_checked
  );
  const item_lon_hon_0 = filter_positive_Stock_Item(item_order_checkked);
  const totalPrice = item_lon_hon_0?.reduce(
    (a: any, curr: any) => a + curr?.total_price_item,
    0
  );
  // next order
  function next_order() {
    ScrollTop();
    // validate stock
    for (const i of item_order_checkked) {
      if (i?.productId?.attributes) {
        const check_color = i?.productId?.attributes?.values?.find(
          (a: any) => a?.color === i?.color_item
        );
        const check_size = check_color?.size?.find(
          (b: any) =>
            (b?.name_size?.trim() ? b?.name_size : undefined) === i?.name_size
        );
        if (i?.quantity > check_size?.stock_attribute) {
          let message: any;
          if (check_size?.stock_attribute < 1) {
            message = `Sản phẩm ${i?.productId?.name_product} hiện tại đã hết hàng, 
            vui lòng xóa khỏi giỏ hàng và chọn sản phẩm khác để thanh toán!`;
          } else {
            message = `Sản phẩm ${i?.productId?.name_product} hiện tại 
            chỉ còn ${check_size?.stock_attribute}. Vui lòng giảm số lượng trước khi thanh toán!`;
          }
          toast.error(message, { autoClose: 1200 });
          return;
        }
      } else if (i?.quantity > i?.productId?.stock) {
        toast.error(
          `Sản phẩm ${i?.productId?.name_product} hiện tại 
          chỉ còn ${i?.productId?.stock}. Vui lòng giảm số lượng trước khi thanh toán!`,
          { autoClose: 1200 }
        );
        return;
      }
    }
    const data_cart = dataSort?.filter(
      (item: any) => item?.status_checked && item
    );
    if (userId) {
      if (data_cart.length === 0 || data?.total_price < 1) {
        messageApi.destroy()
        messageApi.open({
          type: "warning",
          content: "Vui lòng chọn sản phẩm trước khi thanh toán!",
        });
        return null;
      }
      const categories = data_cart
        .map((item: any) => item?.productId?.category_id)
        .filter((categoryId: any) => !!categoryId); // Lọc những giá trị không hợp lệ
      console.log("thong tin từ giỏ hàng", categories);
      console.log("Item Order Checked:", item_order_checkked);

      sessionStorage.setItem("item_order", JSON.stringify(data_cart));
      sessionStorage.setItem(
        "categories",
        JSON.stringify([...new Set(categories)])
      );
      routing("/cart/pay");
    } else {
      routing("/login");
    }
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    <div className="max-w-[1440px] w-[95vw] mx-auto relative">
      {isLoading ||
        loading_btn_checkked ||
        (loading_update_quantity && (
          <div className="fixed grid place-items-center w-screen h-screen top-0 left-0 bg-[#33333333] z-[10]">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ))}
      <Toaster />
      <div className="mt-10">
        {contextHolder}
        <div className="text-sm py-6 bg-[#F3F3F3] font-medium px-[2.5%] rounded">
          <Link to={`/`} className="text-gray-500 hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-1 text-gray-500">&#10148;</span>
          Giỏ hàng
        </div>
        <>
          <div className="w-full md:mt-10 h-auto flex mb:flex-col md:flex-row gap-x-[5%] my-[30px] mb:gap-y-[30px] md:gap-y-0">
            <div className="md:w-[70%] mb:w-full w-full">
              {item_order_checkked?.length > 0 ? (
                <Popconfirm
                  className="text-red-500 border rounded border-red-500 cursor-pointer mb-4 opacity-75 hover:opacity-100 duration-200"
                  title={`Xóa ${item_order_checkked?.length} sản phẩm khỏi giỏ hàng?`}
                  description="Bạn có chắc chắn muốn xóa không?"
                  onConfirm={() => handleRemoveMultiple()}
                  okText="Có"
                  cancelText="Không"
                >
                  <Trash2 className="!w-10 p-1 h-8" />
                </Popconfirm>
              ) : (
                <Trash2 className="!w-10 p-1 h-8 text-red-500 border border-red-500 rounded opacity-75 cursor-not-allowed mb-4" />
              )}

              <Table
                columns={columns}
                dataSource={dataSort}
                pagination={false}
              />
            </div>

            <div className="md:w-[27%] bg-white flex flex-col text-sm text-black">
              <div className="flex flex-col justify-between w-full h-[150px] border rounded lg:p-6 mb:p-4">
                <div className="flex justify-between *:md:text-base *:mb:text-sm *:font-medium">
                  <strong>Tổng giá trị đơn hàng</strong>
                  <p className="text-xl font-bold text-yellow-500">
                    {totalPrice?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
                <button
                  onClick={next_order}
                  className="px-4 py-3 mr-5 text-white duration-200 bg-gray-800 border border-black rounded hover:bg-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ListCart;
