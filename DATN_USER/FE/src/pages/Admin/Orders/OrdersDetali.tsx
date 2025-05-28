import {
  LeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Radio,
  Spin,
  Table,

} from "antd";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Mutation_Notification,
  Query_notification
} from "../../../_lib/React_Query/Notification/Query";
import { useOrderMutations } from "../../../common/hooks/Order/mutation_Order";
import { Query_Orders } from "../../../common/hooks/Order/querry_Order";
import { Mutation_Shipper } from "../../../common/hooks/Shipper/mutation_shipper";
import { useListAllShipper } from "../../../common/hooks/Shipper/querry_shipper";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import instance from "../../../configs/axios";
import Status_order from "./Status_order";
const OrdersDetali = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const role = user?.user?.role;
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const [selectedReason, setSelectedReason] = useState("");
  const { data, refetch, isLoading } = Query_Orders(id);
  console.log(data?.confirmationImage);

  const { data: notification } = Query_notification(userId, role);
  const { mutate } = useOrderMutations("CONFIRM_CANCEL");
  const dispathNotification = Mutation_Notification("Add");
  const { mutate: cancel } = useOrderMutations(
    "REQUEST_CANCEL_or_CANCEL_PRODUCT_or_COMPLETED_PRODUCT"
  );
  const { mutate: AddShipper } = Mutation_Shipper("ADD");
  const { data: shipperData } = useListAllShipper();
  const [selectedShipper, setSelectedShipper] = useState<string | null>(null);
  const [selectedShipperInfo, setSelectedShipperInfo] = useState<any>(null);
  const handleSelectShipper = (shipperId: string) => {
    setSelectedShipper(shipperId);
    setSelectedShipperInfo(shipperId)
    if (!id) return;
    AddShipper(
      { orderId: id, shipperId },
      {
        onSuccess: () => {
          messageApi.success("Thêm shipper cho đơn hàng thành công!");
          refetch();
        },
        onError: () => {
          messageApi.error("Thêm shipper thất bại!");
        }
      }
    );
  };
  const handleDeselectShipper = () => {
    setSelectedShipperInfo(null)
    messageApi.success("Đã bỏ chọn shipper.");
  };

  if (!shipperData || !shipperData.shippers || !shipperData.orders) {
    return <p>Shipper data is not available yet</p>;
  }
  const availableShippers = shipperData.shippers.filter((shipper: any) => {
    const shipperHasOngoingDelivery = shipperData.orders.some(
      (order: any) =>
        order?.shipperId?._id === shipper?._id && order.status === "3"
    );
    const isCurrentlySelected = selectedShipper === shipper._id;

    return !shipperHasOngoingDelivery && !isCurrentlySelected;
  });
  const calculateTotalProductPrice = () => {
    return data?.items.reduce((total: number, item: any) => {
      return total + item.price_item * item.quantity;
    }, 0);
  };
  function yeu_cau(dataBody: {
    id_item: string | number;
    comfirm?: any;
    numberOrder?: string | number;
    cancellationReason?: string;
    action?: string;
  }) {
    mutate(dataBody);
    dispathNotification?.mutate({
      userId: userId,
      receiver_id: data?.userId,
      message: `Người bán đã ${dataBody?.action === "xac_nhan"
        ? "xác nhận"
        : `Từ Chối:  ${dataBody?.cancellationReason}`
        } yêu cầu hủy đơn hàng ${dataBody?.numberOrder}`,
      different: dataBody?.id_item,
      id_different: dataBody?.numberOrder
    });
  }
  const reasons = ["Hết hàng", "Sai thông tin sản phẩm", "Giá nhập thay đổi"];
  function huy_don(dataBody: {
    id_item: string | number;
    numberOrder?: string | number;
    action?: string;
    cancellationReason?: string;
  }) {
    dispathNotification?.mutate({
      userId: userId,
      receiver_id: data?.userId,
      message: `Người bán đã hủy đơn ${dataBody?.numberOrder} với lí do ${dataBody?.cancellationReason}!`,
      different: dataBody?.id_item,
      id_different: dataBody?.numberOrder
    });
    cancel(dataBody);
  }

  const reason1 = [
    "Đơn hàng đã được giao cho đơn vị vận chuyển",
    "Chúng tôi không thể đồng ý với yêu cầu của bạn"
  ];
  const handleStatusUpdate = async (
    status: number | string,
    code_order?: string | number,
    id_order?: string | number
  ) => {
    if (!data) return;
    const message =
      status === 2
        ? `Người bán đã xác nhận đơn hàng ${code_order} `
        : status === 3
          ? `Người bán đã giao đơn hàng ${code_order} cho đơn vị vận chuyển!`
          : status === 4
            ? `Đã giao đơn hàng ${code_order} thành công!.Vui lòng ấn đã nhận hàng!`
            : status === 5
              ? `Người Giao hàng đã giao đơn hàng ${code_order} thất bại!`
              : status === 6
                ? `Đã giao đơn hàng ${code_order} thành công!`
                : `Người bán đã từ chối đơn hàng ${code_order}. Vui lòng chọn sản phẩm khác!`;

    dispathNotification?.mutate({
      userId: userId,
      receiver_id: data?.userId,
      message: message,
      different: id_order
    });
    try {
      const response = await instance.patch(`/orders/${id}`, {
        status: status
      });
      messageApi.open({
        type: "success",
        content:
          response.data.status === "6"
            ? "Đơn hàng đã được giao"
            : "Cập nhật trạng thái đơn hàng thành công!"
      });
      refetch();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Cập nhật trạng thái đơn hàng thất bại!"
      });
    }
  };
  const cancellationRequested = data?.cancellationRequested;
  const dataSort = data?.items?.map((item: any) => ({
    key: item._id,
    ...item
  }));
  const columns = [
    {
      title: "Ảnh Sản Phẩm",
      dataIndex: "image_product",
      key: "image_product",
      render: (_: any, item: any) => (
        <img
          src={item?.productId?.image_product}
          alt=""
          className="w-[80px] h-[80px] object-cover "
        />
      )
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name_product",
      key: "name_product",
      render: (_: any, item: any) => (
        console.log(item),

        <div>
          <Link to={`/admin/products/edit/${item?.productId?._id}`} className="text-lg font-medium w-[80%] text-black">
            {item?.productId?.name_product}
          </Link>
          <p className=" mt-1 font-medium text-[#0000008A]">
            Loại: {item?.color_item} - {item?.name_size}
          </p>
        </div>
      )
    },
    {
      title: "Giá Sản Phẩm",
      dataIndex: "price_product",
      key: "price_product",
      render: (_: any, item: any) => (
        <p className="">
          {item?.price_item.toLocaleString("vi", {
            style: "currency",
            currency: "VND"
          })}
        </p>
      )
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, item: any) => (
        <p className="text-center">{item?.quantity}</p>
      )
    },
    {
      title: "Tổng Tiền",
      dataIndex: "price_product",
      key: "price_product",
      render: (_: any, item: any) => (
        <p>
          {(item?.total_price_item).toLocaleString("vi", {
            style: "currency",
            currency: "VND"
          })}
        </p>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="mx-6">
        {" "}
        <div className="flex items-center justify-between mb-5 mt-20 relative">
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-[#1B7EE2]"
          >
            <LeftOutlined />
            <span>Quay lại</span>
          </Link>
          <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2">
            Chi Tiết Đơn Hàng
          </h1>
        </div>
        <div className="my-6 shadow  rounded">
          {data?.status === "2" && (
            <div className="bg-white p-4 rounded shadow">
              {selectedShipperInfo ? (
                <div>
                  <h2 className="text-center font-semibold mb-4">Thông tin người giao hàng</h2>
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedShipperInfo.avatar}
                      alt="Shipper Avatar"
                      className="w-14 h-14 rounded-lg object-cover mr-4"
                    />
                    <div className="flex-1">
                      <p className="text-lg text-gray-500">Tên: <strong className="text-black">{selectedShipperInfo.fullName}</strong></p>
                      <p className="text-sm text-gray-500 py-1"> SDT: {selectedShipperInfo.phone}</p>
                      <p className="text-sm text-gray-500 py-1">Phương tiện: {selectedShipperInfo.vehicle || "Chưa cập nhật"}</p>
                      <p className="text-sm text-gray-500 mt-1">Địa chỉ: {selectedShipperInfo.address || "Chưa cập nhật"}</p>
                    </div>
                    <Button
                      onClick={handleDeselectShipper}
                      className="!bg-red-500 !text-white px-4 py-5 rounded !border-none"
                    >
                      Bỏ chọn
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-center font-semibold mb-4">Người giao hàng</h2>
                  {availableShippers.length > 0 ? (
                    availableShippers.map((shipper: any) => (
                      <div key={shipper._id} className="my-4">
                        <div className="flex items-center">
                          <img
                            src={shipper.avatar}
                            alt="Shipper Avatar"
                            className="w-14 h-14 rounded-lg object-cover mr-4"
                          />
                          <div className="flex-1 w-40 ">
                            <p className="text-lg font-medium">{shipper.fullName}</p>
                            <p className="text-sm text-gray-500">
                              SDT: {shipper.phone} - Phương tiện:{" "}
                              {shipper.vehicle || "Chưa cập nhật"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Địa chỉ: {shipper.address || "Chưa cập nhật"}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleSelectShipper(shipper)}
                            className={`!bg-blue-500 !text-white px-4 py-5 rounded hover:bg-blue-600 ${selectedShipper === shipper._id ? "bg-green-500" : ""
                              }`}
                          >
                            Chọn
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-red-500">
                      Hiện shipper đang không đủ, vui lòng đợi!
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {data?.status == 3 || data?.status == 4 || data?.status == 6 || data?.status == 5 && (
            <div className="bg-white p-4 rounded shadow-md mt-4">
              <h2 className="text-center font-semibold mb-4">
                Thông tin người giao hàng
              </h2>
              <div className="flex items-center justify-center space-x-14">
                <div className="flex items-center space-x-3">
                  <img
                    src={data?.shipperId?.avatar}
                    alt="Shipper Avatar"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-medium">Tên: <strong>{data?.shipperId?.fullName}</strong></p>
                    <p className="text-sm text-gray-500">SDT: {data?.shipperId?.phone}</p>
                    <p className="text-sm text-gray-500 py-1">Phương tiện: {data?.shipperId?.vehicle || "Chưa cập nhật"}</p>
                    <p className="text-sm text-gray-500">
                      Địa chỉ: {data?.shipperId?.address || "Chưa cập nhật"}
                    </p>
                  </div>

                </div>
                <div>
                  <Image src={data?.confirmationImage} style={{ width: 100 }} alt="" />
                  {data?.confirmationImage === undefined ? (""
                  ) : (<p className="text-gray-500">Ảnh xác nhận</p>)}
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="my-6 shadow  rounded">


          <div className="shadow rounded bg-white ">
            <div className="p-4 text-center text-black font-semibold">
              Trạng thái đơn hàng
            </div>
            <Status_order data_Order={data} notification={notification} />
          </div>
        </div>
        <div className="overflow-x-auto my-6 shadow  rounded">
          <Table columns={columns} dataSource={dataSort} pagination={false} />
          <div className="bg-white divide-y divide-gray-200">
          </div>
        </div>
        <div className="bg-white overflow-x-auto my-6 shadow p-4 rounded">
          <div className=" flex items-center justify-between  gap-4  border-b pb-4">
            <div className="flex items-center space-x-4">
              <p className="text-black font-semibold">Phương thức thanh toán</p>
              <p className="w-auto p-3 border-2 border-[#1B7EE2] text-[#1B7EE2] rounded">
                {data?.customerInfo?.payment == "VNPAY" ? "Thanh toán qua VNPAY" : "Đã thanh toán khi nhận hàng"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-black font-semibold">Trạng thái thanh toán</p>
              <p className="w-auto p-3 border-2 border-[#1B7EE2] text-[#1B7EE2] rounded">
                {data?.status == 6 || data.customerInfo?.payment == "VNPAY"
                  ? "Thanh toán thành công" : data?.status == 5 ? "Thanh toán thất bại"
                    : "Chưa thanh toán"}
              </p>
            </div>
          </div>
          <div className="flex justify-between my-4">
            <div className="flex gap-6">
              <div className="flex-1">
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Tên khách hàng</span>
                  <span>:</span>
                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Số điện thoại</span>
                  <span>:</span>
                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Địa chỉ Email</span>
                  <span>:</span>
                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Địa chỉ khách hàng</span>
                  <span>:</span>
                </p>
              </div>

              <div className="flex-1">
                <p className="py-2 text-gray-800">
                  {data?.customerInfo?.userName}
                </p>
                <p className="py-2 text-gray-800">
                  {data?.customerInfo?.phone}
                </p>
                <p className="py-2 text-gray-800">
                  {data?.customerInfo?.email}
                </p>
                <p className="py-2 text-gray-800 w-[500px]">
                  {data?.customerInfo?.address}
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 ">
                <p className="flex w-[150px] justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Tổng tiền hàng</span>
                  <span>:</span>
                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Phí vận chuyển:</span>
                  <span>:</span>

                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Voucher giảm giá</span>
                  <span>:</span>
                </p>
                <p className="flex justify-between items-center space-x-2 py-2 text-gray-600">
                  <span className="font-semibold">Tổng thanh toán</span>
                  <span>:</span>
                </p>
              </div>
              <div className="flex-1">
                <p className="py-2 text-gray-800">
                  <p>
                    {calculateTotalProductPrice()?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND"
                    })}
                  </p>
                </p>
                <p className="py-2 text-gray-800 text-left">
                  {data?.delivery_fee?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND"
                  })}
                </p>
                <p className="py-2 text-gray-800 ">
                  {" "}
                  {data?.discountAmount
                    ? `- ${data?.discountAmount?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND"
                    })} `
                    : "0đ"}
                </p>

                <p className="py-2 text-[#ee4d2d] text-xl">
                  {data?.totalPrice?.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND"
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-5 justify-center mt-[60px]">
            {data?.status === "1" && (
              <>
                <Popconfirm
                  title="Xác nhận đơn hàng?"
                  description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                  onConfirm={() =>
                    handleStatusUpdate(2, data?.orderNumber, data._id)
                  }
                  okText="Xác nhận"
                  cancelText="Không"
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
                          onChange={(e) => setSelectedReason(e.target.value)}
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
                      id_item: data?._id,
                      action: "huy",
                      cancellationReason: selectedReason,
                      numberOrder: data?.orderNumber
                    });
                  }}
                  okText="Từ chối"
                  cancelText="Không"
                >
                  <button className="w-auto p-3 bg-red-500 rounded text-white">
                    Từ chối
                  </button>
                </Popconfirm>
              </>
            )}
            {data?.status === "2" && (
              <>
                {cancellationRequested ? (
                  <>
                    <Popconfirm
                      title="Xác nhận hủy đơn hàng?"
                      description="Bạn có chắc chắn muốn hủy đơn hàng này?"
                      onConfirm={() =>
                        yeu_cau({
                          id_item: data?._id,
                          confirm: true,
                          numberOrder: data?.orderNumber,
                          action: "xac_nhan"
                        })
                      }
                      okText="Xác nhận"
                      cancelText="Không"
                    >
                      <button className="w-auto p-3 bg-green-500 rounded text-white">
                        Xác nhận yêu cầu
                      </button>
                    </Popconfirm>
                    <Popconfirm
                      title="Từ chối hủy đơn hàng?"
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
                              {reason1.map((reason, index) => (
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
                          messageApi.warning("Vui lòng chọn lý do từ chối!");
                          return;
                        }
                        yeu_cau({
                          id_item: data?._id,
                          confirm: false,
                          cancellationReason: selectedReason,
                          numberOrder: data?.orderNumber,
                          action: "tu_choi"
                        });
                      }}
                      okText="Từ chối"
                      cancelText="Không"
                    >
                      <button className="w-auto p-3 bg-red-500 rounded text-white">
                        Từ chối yêu cầu
                      </button>
                    </Popconfirm>
                  </>
                ) : (
                  <Popconfirm
                    title="Xác nhận đơn hàng?"
                    description="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                    onConfirm={() => {
                      if (!selectedShipper) {
                        messageApi.error(
                          "Vui lòng chọn shipper trước khi xác nhận!"
                        );
                        return;
                      }
                      handleStatusUpdate(3, data?.orderNumber, data._id); // Xác nhận khi đã có shipper
                    }}
                    okText="Xác nhận"
                    cancelText="Không"
                  >
                    <button className="w-auto p-3 bg-[#1B7EE2] rounded text-white">
                      Xác nhận vận chuyển
                    </button>
                  </Popconfirm>
                )}
              </>
            )}
            {data?.status === "3" && (
              <>
                <Button
                  className="w-52 bg-blue-500 rounded text-white"
                  type="primary"
                  disabled>
                  Giao Hàng Thành Công
                </Button>
                <Button
                  className="w-52 bg-blue-500 rounded text-white"
                  disabled
                >
                  Giao Hàng Thất Bại
                </Button>
              </>
            )}
            {data?.status === "4" && (
              <button
                className="w-auto p-3 bg-gray-500 rounded text-white cursor-not-allowed"
                disabled
              >
                Giao hàng thành công
              </button>
            )}
            {data?.status === "5" && (
              <button
                className="w-auto p-3 bg-gray-500 rounded text-white cursor-not-allowed"
                disabled
              >
                Giao hàng thất bại
              </button>
            )}
            {data?.status === "6" && (
              <button
                className="w-auto p-3 bg-green-600 rounded text-white cursor-not-allowed"
                disabled
              >
                Đã hoàn thành
              </button>
            )}
            {data?.status === "7" && (
              <button
                className="w-auto p-3 bg-gray-500 rounded text-white cursor-not-allowed"
                disabled
              >
                Đơn hàng đã bị hủy
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default OrdersDetali;
