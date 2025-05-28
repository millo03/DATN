import { message, Popconfirm, Radio, Table, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { Ellipsis_horizontal } from "../../../components/common/Client/_component/Icons";
import { IOrder } from "../../../common/interfaces/Orders";
import { ColumnType, SortOrder } from "antd/es/table/interface";
import { Mutation_Notification } from "../../../_lib/React_Query/Notification/Query";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { useState } from "react";
import { useOrderMutations } from "../../../common/hooks/Order/mutation_Order";

const OrderTable = ({ orders, currentPage, goToPage, totalPages }: any) => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const dispathNotification = Mutation_Notification("Add");
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedReason, setSelectedReason] = useState("");
  const { mutate: xac_nhan, isLoading: isConfirming } =
    useOrderMutations("UPDATE");
  const { mutate: cancel, isLoading: isCancelling } = useOrderMutations(
    "REQUEST_CANCEL_or_CANCEL_PRODUCT_or_COMPLETED_PRODUCT"
  );
  const formatDate = (createdAt: any) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleDateString();
  };
  let order_1: any;
  orders?.map((order: any) => {
    order_1 = order;
  });
  const dataSort = orders?.map((order: any) => ({
    key: order._id,
    ...order
  }));

  const handleStatusUpdate = async (dataBody: any) => {
    if (!dataBody.id_item) return;
    const message =
      dataBody.status === 2
        ? `Người bán đã xác nhận đơn hàng ${dataBody.code_order}`
        : `Người bán đã từ chối đơn hàng ${dataBody.code_order}. Vui lòng chọn sản phẩm khác!`;
    dispathNotification?.mutate({
      userId: userId,
      receiver_id: order_1?.userId,
      message: message,
      different: dataBody.id_order
    });

    try {
      await xac_nhan(dataBody);

      messageApi.open({
        type: "success",
        content: `Xác nhận đơn hàng thành công!`
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Có lỗi xảy ra khi hủy đơn hàng!"
      });
    }
  };

  const reasons = ["Hết hàng", "Sai thông tin sản phẩm", "Giá nhập thay đổi"];
  function huy_don(dataBody: {
    id_item: string | number;
    numberOrder?: string | number;
    action?: string;
    cancellationReason?: string;
  }) {
    dispathNotification?.mutate({
      userId: userId,
      receiver_id: order_1?.userId,
      message: `Người bán đã hủy đơn ${dataBody?.numberOrder} với lí do ${dataBody?.cancellationReason}!`,
      different: dataBody?.id_item,
      id_different: dataBody?.numberOrder
    });
    cancel(dataBody, {
      onSuccess: () => {
        messageApi.open({
          type: "success",
          content: `Đơn hàng ${dataBody?.numberOrder} đã được hủy thành công!`
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Có lỗi xảy ra khi hủy đơn hàng!"
        });
      }
    });
  }
  const createFilters = (order: IOrder[]) => {
    return order
      .map((order: IOrder) => order.orderNumber)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      )
      .map((orderNumber: string) => ({
        text: orderNumber,
        value: orderNumber
      }));
  };

  // const onHandelExport = (orderId: number) => {
  //   console.log("Xuất hóa đơn cho đơn hàng:", orderId);
  // };
  const columns: ColumnType<IOrder>[] = [
    {
      title: "Mã đơn",
      dataIndex: "orderNumber",
      key: "orderNumber",
      filterSearch: true,
      filters: orders ? createFilters(orders) : [],
      onFilter: (value: string | any, record: IOrder) => {
        const filterValue = value as string;
        return record.orderNumber.includes(filterValue);
      },
      sorter: (a: IOrder, b: IOrder) =>
        a.orderNumber.localeCompare(b.orderNumber),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      render: (_: any, orders: any) => (
        <Link to={`/admin/orders/${orders._id}`}>
          <p className="font-bold">{orders?.orderNumber}</p>
        </Link>
      )
    },
    {
      title: "Người Mua",
      dataIndex: "userName",
      key: "userName",
      render: (_: any, order: any) => <p>{order?.customerInfo?.userName}</p>
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, order: any) => <p>{order?.customerInfo?.phone}</p>
    },
    {
      title: "Ngày Đặt",
      dataIndex: "datetime",
      key: "datetime",
      render: (_: any, order: any) => <p>{formatDate(order?.createdAt)}</p>
    },
    {
      title: "Hình Thức",
      dataIndex: "payment",
      key: "payment",
      render: (_: any, order: any) => <p>{order?.customerInfo?.payment}</p>
    },
    {
      title: "Thanh toán",
      dataIndex: "thanhtoan",
      key: "thanhtoan",
      render: (_: any, order: any) =>
        order.status === "6"
          ? "Thanh toán thành công"
          : order.status === "5"
            ? "Thanh toán thất bại"
            : "Chưa thanh toán"
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, order: any) => {
        return (
          <>
            {order?.cancellationRequested ? (
              order?.cancelledByAdmin ? (
                <p className="text-blue-700">Đã xác nhận yêu cầu</p>
              ) : (
                <p className="text-yellow-600">Yêu cầu gửi lên</p>
              )
            ) : order?.status == 1 ? (
              <p className="text-gray-500">Chờ xác nhận</p>
            ) : order?.status == 2 ? (
              <p className="text-yellow-500">Đang chuẩn bị hàng</p>
            ) : order?.status == 3 ? (
              <p className="text-blue-500">Đang vận chuyển</p>
            ) : order?.status == 6 ? (
              <p className="text-green-600">Hoàn thành</p>
            ) : order?.status == 4 ? (
              <p className="text-green-600">Giao hàng thành công</p>
            ) : order?.status == 5 ? (
              <p className="text-red-600">Giao hàng thất bại</p>
            ) : (
              <p className="text-red-600">Đã hủy</p>
            )}
          </>
        );
      }
    },
    // {
    //   dataIndex: "action",
    //   key: "action",
    //   title: "Thao Tác",
    //   render: (_: any, orders: any) => {
    //     return (
    //       <>
    //         <Tooltip
    //           placement="left"
    //           title={
    //             <div className="flex flex-col space-y-2 m-2">
    //               <Link to={`/admin/orders/${orders._id}`}>
    //                 <button className="w-auto p-3 bg-[#1B7EE2] rounded text-white">
    //                   Xem chi tiết
    //                 </button>
    //               </Link>
    //               {orders.status === "1" && (
    //                 <>
    //                   <Popconfirm
    //                     title="Xác nhận đơn hàng?"
    //                     description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
    //                     onConfirm={() =>
    //                       handleStatusUpdate({
    //                         status: 2,
    //                         code_order: orders?.orderNumber,
    //                         id_item: orders?._id
    //                       })
    //                     }
    //                     okText="Xác nhận"
    //                     cancelText="Không"
    //                     okButtonProps={{
    //                       loading: isConfirming
    //                     }}
    //                   >
    //                     <button className="w-auto p-3 bg-[#1B7EE2] rounded text-white">
    //                       Xác nhận
    //                     </button>
    //                   </Popconfirm>
    //                   <Popconfirm
    //                     title="Từ chối xác nhận?"
    //                     description={
    //                       <div>
    //                         <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
    //                         <div>
    //                           <p>Chọn lý do hủy:</p>
    //                           <Radio.Group
    //                             className="flex flex-col gap-2"
    //                             onChange={(e) =>
    //                               setSelectedReason(e.target.value)
    //                             }
    //                           >
    //                             {reasons.map((reason, index) => (
    //                               <Radio key={index} value={reason}>
    //                                 {reason}
    //                               </Radio>
    //                             ))}
    //                           </Radio.Group>
    //                         </div>
    //                       </div>
    //                     }
    //                     onConfirm={() => {
    //                       if (!selectedReason) {
    //                         messageApi.warning("Vui lòng chọn lý do hủy!");
    //                         return;
    //                       }
    //                       huy_don({
    //                         id_item: orders?._id,
    //                         action: "huy",
    //                         cancellationReason: selectedReason,
    //                         numberOrder: orders?.orderNumber
    //                       });
    //                     }}
    //                     okText="Từ chối"
    //                     cancelText="Không"
    //                     okButtonProps={{
    //                       loading: isCancelling
    //                     }}
    //                   >
    //                     <button className="w-auto p-3 bg-red-500 rounded text-white">
    //                       Từ chối
    //                     </button>
    //                   </Popconfirm>
    //                 </>
    //               )}
    //             </div>
    //           }
    //         >
    //           <span className="flex justify-center cursor-pointer">
    //             <Ellipsis_horizontal />
    //           </span>
    //         </Tooltip>
    //       </>
    //     );
    //   }
    // },
    {
      dataIndex: "action",
      key: "action",
      title: "Thao Tác",
      render: (_: any, orders: any) => {
        return (
          <>
            <Tooltip
              placement="left"
              title={
                <div className="flex flex-col space-y-2 m-2 w-50">
                  <Link to={`/admin/orders/${orders._id}`}>
                    <button className="w-auto p-3 bg-[#1B7EE2] rounded text-white">
                      Xem chi tiết
                    </button>
                  </Link>
                  {orders.status === "1" && (
                    <>
                      <Popconfirm
                        title="Xác nhận đơn hàng?"
                        description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                        onConfirm={() =>
                          handleStatusUpdate({
                            status: 2,
                            code_order: orders?.orderNumber,
                            id_item: orders?._id
                          })
                        }
                        okText="Xác nhận"
                        cancelText="Không"
                        okButtonProps={{
                          loading: isConfirming
                        }}
                      >
                        <button className="w-auto p-3 bg-[#1B7EE2] rounded text-white">
                          Xác nhận
                        </button>
                      </Popconfirm>
                      <Popconfirm
                        title="Từ chối xác nhận?"
                        description={
                          <div>
                            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                            <div>
                              <p>Chọn lý do hủy:</p>
                              <Radio.Group
                                className="flex flex-col gap-2"
                                onChange={(e) =>
                                  setSelectedReason(e.target.value)
                                }
                              >
                                {reasons.map((reason, index) => (
                                  <Radio key={index} value={reason}>
                                    {reason}
                                  </Radio>
                                ))}
                              </Radio.Group>
                            </div>
                          </div>
                        }
                        onConfirm={() => {
                          if (!selectedReason) {
                            messageApi.warning("Vui lòng chọn lý do hủy!");
                            return;
                          }
                          huy_don({
                            id_item: orders?._id,
                            action: "huy",
                            cancellationReason: selectedReason,
                            numberOrder: orders?.orderNumber
                          });
                        }}
                        okText="Từ chối"
                        cancelText="Không"
                        okButtonProps={{
                          loading: isCancelling
                        }}
                      >
                        <button className="w-auto p-3 bg-red-500 rounded text-white">
                          Từ chối
                        </button>
                      </Popconfirm>
                    </>
                  )}
                  {/* {orders.status === "6" && (
                    <>
                      {" "}
                      <Popconfirm
                        title="Xuất hóa đơn "
                        description="Bạn có chắc chắn muốn xuất hóa đơn ra file pdf không ? "
                        onConfirm={() => {
                          onHandelExport(orders.orderNumber);
                        }}
                        // onCancel={cancel}
                        okText="Có "
                        cancelText="Không"
                      >
                        <button className="w-auto p-3 bg-green-500 rounded text-white">
                          Xuất hóa đơn
                        </button>
                      </Popconfirm>
                    </>
                  )} */}
                </div>
              }
            >
              <span className="flex justify-center cursor-pointer">
                <Ellipsis_horizontal />
              </span>
            </Tooltip>
          </>
        );
      }
    }
  ];

  return (
    <div className="">
      {contextHolder}
      <Table columns={columns} dataSource={dataSort} pagination={{
        current: currentPage,
        pageSize: 10,
        total: totalPages * 10,
        onChange: goToPage,
        showSizeChanger: false,
        style: { display: 'flex', justifyContent: 'center' }
      }} />
    </div>
  );
};

export default OrderTable;
