/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, message, Popconfirm, Space } from "antd";
import { ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { FaEdit, FaRecycle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import { io } from 'socket.io-client';
import { useEffect } from "react";

export default function Data_Table({ dataProps }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const socket = io('http://localhost:8888');
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy");
  };
  useEffect(() => {
    socket.on('connect_error', () => {
      socket.disconnect();
    })
  }, [socket])

  return (
    <>
      {contextHolder}
      <div className="grid text-gray-900 grid-cols-[20px_70px_180px_150px_200px_150px_150px_120px] gap-x-4 items-center justify-between p-4 text-sm whitespace-nowrap">
        <div></div>
        <span>Ảnh</span>
        <span>Tên</span>
        <span>Thể loại</span>
        <span>Giá tiền</span>
        <span>Số lượng</span>
        <span>Thời gian tạo</span>
        <span>Thao tác</span>
      </div>
      {dataProps?.dataTable?.map((data: any) => {
        return (
          <div
            key={data?._id}
            className="flex flex-col w-full text-gray-800 border-t border-gray-300 text-sm"
          >
            <div className="grid grid-cols-[20px_70px_180px_150px_200px_150px_150px_120px] gap-x-4 items-center justify-between p-4">
              {/* checkbox */}
              <Checkbox
                onChange={() => dataProps?.handleCheckboxChange(data?._id)}
              ></Checkbox>
              {/* image */}
              <img
                width={100}
                height={100}
                className="rounded border"
                src={data?.image_product}
                alt="Loading..."
              />
              {/* name */}
              <Link to={`/admin/products/edit/${data._id}`} className="line-clamp-3">{data?.name_product}</Link>
              {/* category */}
              <span className="line-clamp-2">
                {data?.category_id?.name_category}
              </span>
              {/* price */}
              <span className="line-clamp-2 text-red-500">
                {data?.price_product?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              {/* stock */}
              <span className="line-clamp-2">{data?.stock}</span>
              {/* create time */}
              {/* <span className="line-clamp-2">{data?.createdAt?.slice(0, 10)}</span> */}
              <span className="line-clamp-1">
                {formatDate(data?.createdAt)}
              </span>
              {/* options */}
              <div className="flex justify-center items-center gap-x-2 *:duration-200">
                {dataProps?.action === "recycle" ? (
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        messageApi.destroy()
                        messageApi.open({
                          type: "success",
                          content: `Đã khôi phục lại sản phẩm ${(data?.name_product?.length > 20 ? data?.name_product?.slice(0, 20) + '...' : data?.name_product)}!`,
                        });
                        dataProps?.mutate({
                          action: "restore",
                          id_item: data._id,
                        })
                      }
                      }
                    >
                      <FaRecycle />
                    </Button>

                    <Popconfirm
                      title="Xóa vĩnh viễn sản phẩm"
                      description="Bạn chắc chắn muốn xóa vĩnh viễn sản phẩm này chứ?"
                      onConfirm={() => {
                        messageApi.destroy()
                        messageApi.open({
                          type: "success",
                          content: "Xóa thành công!",
                        });
                        dataProps?.mutate(data._id!)
                      }}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>
                        <TiDelete />
                      </Button>
                    </Popconfirm>
                  </Space>
                ) : (
                  <Space className="flex items-center">
                    <Link to={`/admin/products/edit/${data._id}`} className="bg-transparent h-8 grid place-items-center w-10 rounded border border-sky-600">
                      <FaEdit />
                    </Link>
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có muốn xóa sản phẩm này không?"
                      onConfirm={() => {
                        socket.emit('send_message_delete_item', data);
                        messageApi.destroy()
                        messageApi.open({
                          type: "success",
                          content: `Đã xóa sản phẩm ${(data?.name_product?.length > 20 ? data?.name_product?.slice(0, 20) + '...' : data?.name_product)}. Bạn có thể 
                          khôi phục lại trong thùng rác!`,
                        });
                        dataProps?.mutate({
                          id_item: data._id,
                          action: "remove",
                        })
                      }
                      }
                      // onCancel={cancel}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger>
                        <FaDeleteLeft />
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              </div>
            </div>
            {/* options */}
            {
              data?.attributes && (
                <details
                  className="group [&_summary::-webkit-details-marker]:hidden"
                  open={true}
                >
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-1 w-[100px] mx-auto ">
                    <span className="group-open:block hidden">Ẩn</span>
                    <span className="group-open:hidden">Hiện</span>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <ChevronUp className="h-4" />
                    </span>
                  </summary>
                  {data?.attributes &&
                    data?.attributes?.values?.map((item: any) =>
                      item?.size?.map((value: any) => (
                        <div
                          key={value?._id}
                          className="grid border-t duration-200 border-gray-300 gap-x-4 grid-cols-[180px_180px_180px_250px_100px_100px_150px_80px] 
                                                items-center text-start justify-between py-4"
                        >
                          <div></div>
                          {/* attributes */}
                          <div className="flex gap-x-2 w-full">
                            {(item?.symbol?.trim()) ? item?.symbol[0] === '#' ? <div style={{ background: item?.symbol }} className={`w-6 h-6 rounded`} /> :
                              <img width={40} height={40} src={item?.symbol} /> : ''}
                            <span className="line-clamp-3">{item?.color}</span>,
                            <span className="line-clamp-3">
                              {value?.name_size}
                            </span>
                          </div>
                          {/* div giả */}
                          <div></div>
                          {/* price */}
                          <div>
                            <span className={`${data?.sale > 0 ? 'text-gray-500 line-through' : 'text-red-600'} line-clamp-1`}>
                              {value?.price_attribute?.toLocaleString("vi", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            {
                              data?.sale > 0 &&
                              <div className="flex items-center gap-x-3">
                                <span className="line-clamp-1 text-red-600">
                                  {(value?.price_attribute * (1 - data?.sale / 100))?.toLocaleString("vi", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </span>
                                {
                                  data?.sale > 0 &&
                                  <span className="text-sm font-normal text-gray-600 translate-y-[-10px]">-{data?.sale}%</span>
                                }
                              </div>
                            }
                          </div>
                          {/* quantity */}
                          <div>
                            {value?.stock_attribute > 0 ? (
                              <span className="line-clamp-2">
                                {value?.stock_attribute}
                              </span>
                            ) : (
                              <span className="line-clamp-2 text-red-500">
                                Hết hàng!
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                </details>
              )
            }
          </div >
        );
      })}
    </>
  );
}
