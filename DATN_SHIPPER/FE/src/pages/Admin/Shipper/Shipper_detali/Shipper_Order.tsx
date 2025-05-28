import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Radio,
    Spin,
    Upload,
    UploadFile,
} from "antd";
import Mapbox from "../Mapbox";
import { Query_Orders } from "../../../../common/hooks/Order/querry_Order";
import { Link, useParams } from "react-router-dom";
import Status_order from "../../Orders/Status_order";
import { Mutation_Notification } from "../../../../_lib/React_Query/Notification/Query";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import instance from "../../../../configs/axios";
import { useState } from "react";
import { UploadImage } from "../../../../systems/utils/uploadImage";
import {
    LeftOutlined,
    LoadingOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useOrderMutations } from "../../../../common/hooks/Order/mutation_Order";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader } from "lucide-react";
import Loading from "../../../../components/base/Loading/Loading";

const Shipper_Order = () => {
    const { id } = useParams();
    const [user] = useLocalStorage("user", {});
    const userId = user?.user?._id;
    const role = user?.user?.role;
    const [orderId, setOrderId] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const { data, refetch, isLoading } = Query_Orders(id);

    const [isDeliverFailModalVisible, setDeliverFailModalVisible] =
        useState(false);
    const [customReason, setCustomReason] = useState("");
    const [IsLoading, setIsLoading] = useState(false); // State kiểm tra trạng thái loading của toàn trang
    const dispathNotification = Mutation_Notification("Add");
    // const { mutate: failDelivery } = useOrderMutations("FAIL_DELIVERY");
    const [selectedReason, setSelectedReason] = useState("");
    const [isDeliverSuccessModalVisible, setDeliverSuccessModalVisible] =
        useState(false);
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleFileChange = ({ fileList }: { fileList: UploadFile<any>[] }) => {
        setFileList(fileList.slice(-1));
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const file = fileList[0].originFileObj as Blob;
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        } else {
            setPreviewImage(null);
        }
    };

    const defaultReasons = [
        "Người nhận không nghe máy",
        "Khách hàng hủy đơn",
        "Không tìm thấy địa chỉ giao hàng",
        "Đơn hàng quá 3 ngày",
    ];

    const handleFailDelivery = async () => {
        const reasonToSubmit =
            selectedReason === "Khác" ? customReason : selectedReason;
        if (!data?._id || !reasonToSubmit) return;

        setLoading(true);
        setIsLoading(true);

        try {
            await instance.post(`/orders/${data._id}/fail-delivery`, {
                failureReason: reasonToSubmit,
            });

            giao_hang_that_bai({
                id_item: data._id,
                numberOrder: data?.orderNumber,
                action: "fail-delivery",
                cancellationReason: reasonToSubmit,
                linkUri: `/orders/${data._id}`,
            });

            message.success("Đơn hàng đã được đánh dấu giao hàng thất bại.");

            setDeliverFailModalVisible(false);
            refetch();
        } catch (error) {
            const errorMessage =
                (error as any)?.response?.data?.message ||
                "Cập nhật giao hàng thất bại.";
            message.error(errorMessage);
        } finally {
            // Tắt trạng thái loading
            setIsLoading(false);
            setLoading(false);
        }
    };

    function giao_hang_that_bai(dataBody: any) {
        dispathNotification?.mutate({
            userId: userId,
            receiver_id: data?.userId,
            message: `Người giao hàng đã giao hàng đơn hàng ${dataBody?.numberOrder} thất bại với lí do ${dataBody?.cancellationReason}!`,
            different: dataBody?.id_item,
            id_different: dataBody?.numberOrder,
        });

        console.log(dataBody.cancellationReason);

        // Bạn có thể bổ sung thêm các logic khác nếu cần
    }
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
            different: id_order,
        });
        try {
            const response = await instance.patch(`/orders/${id}`, {
                status: status,
            });
            messageApi.open({
                type: "success",
                content:
                    response.data.status === "6"
                        ? "Đơn hàng đã được giao thành công!"
                        : "Cập nhật trạng thái đơn hàng thành công!",
            });
            refetch();
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Cập nhật trạng thái đơn hàng thất bại!",
            });
        }
    };
    const handleDeliverSuccess = async () => {
        if (fileList.length === 0) {
            message.error("Vui lòng chọn ảnh xác nhận!");
            return;
        }
        if (!orderId) {
            console.error("Order ID is missing");
            return;
        }
        setIsLoading(true);
        setLoading(true);
        const file = fileList.length > 0 ? fileList[0].originFileObj : null;
        try {
            let imageUrl = null;
            if (file) {
                imageUrl = await UploadImage(file);
            }
            await new Promise((resolve) => setTimeout(resolve, 4000));
            await instance.post("/deliver-success", {
                orderId,
                confirmationImage: imageUrl,
            });
            handleStatusUpdate(4, data?.orderNumber, data._id);
            refetch();
            // messageApi.success("Đơn hàng đã được đánh dấu là giao hàng thành công.");
            setDeliverSuccessModalVisible(false);
        } catch (error) {
            messageApi.error("Xác nhận thất bại. Vui lòng thử lại.");
            console.error("Failed to mark order as delivered", error);
        } finally {
            setIsLoading(false); // Tắt loading toàn trang sau khi xử lý xong
            setLoading(false);
        }
    };
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }

    return (
        <div className="mt-28 mx-5">
            {contextHolder}
            {isLoading ? (
                <Loading />
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-5 mt-20 relative">
                        <Link
                            to="/courier/orders"
                            className="flex items-center gap-2 text-[#1B7EE2]"
                        >
                            <LeftOutlined />
                            <span>Quay lại</span>
                        </Link>
                        <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2">
                            Chi Tiết Đơn Hàng
                        </h1>
                    </div>
                    <div className="flex space-x-6">
                        <div className="w-[63%] h-96">
                            <Mapbox id={id} />
                        </div>
                        <div className="w-[29%]">
                            <Card title="Trạng thái" className="shadow-md mb-5">
                                <Status_order data_Order={data} />
                            </Card>

                            <Card title="Thông tin giao hàng" className="shadow-md mb-5">
                                <div className="text-sm">
                                    <p>
                                        <strong>Tên người mua:</strong>{" "}
                                        {data?.customerInfo?.userName}
                                    </p>
                                    <p>
                                        <strong>SĐT:</strong> {data?.customerInfo?.phone}
                                    </p>
                                    <p>
                                        <strong>Địa chỉ:</strong> {data?.customerInfo?.address}
                                    </p>
                                    {/* <p><strong>Thời gian dự kiến</strong>60 phút</p> */}
                                    <p>
                                        <strong>Quãng đường giao:</strong> {data?.deliveryDistance}
                                    </p>
                                    <p>
                                        <strong>Phí vận chuyển:</strong>{" "}
                                        {data?.delivery_fee?.toLocaleString("vi", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                            </Card>
                            <Divider className="my-5" />
                            <Card title="Đơn Hàng" className="shadow-md">
                                <div className="text-sm">
                                    <p>
                                        <strong>Mã đơn hàng:</strong> {data?.orderNumber}
                                    </p>
                                    <div>
                                        <strong>Sản phẩm:</strong>
                                        <div>
                                            {data?.items?.map((item: any) => {
                                                return (
                                                    <div className="flex items-center gap-4 py-2 border-b border-gray-200 hover:bg-gray-50 ">
                                                        <img
                                                            src={item?.productId?.image_product}
                                                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                            alt={item?.productId?.name_product}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {item?.productId?.name_product}
                                                            </p>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-600">
                                                                    Số lượng: {item?.quantity}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Giá:{" "}
                                                                    {item?.price_item.toLocaleString("vi", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="text-right pt-5">
                                        <strong>Tổng giá trị:</strong>{" "}
                                        {data?.totalPrice?.toLocaleString("vi", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                            </Card>
                            <Card title="" className="shadow-md mt-5">
                                <div className="flex space-x-2">
                                    <>
                                        {data?.status == "4" || data?.status == "6" ? (
                                            <Button
                                                className="w-full bg-green-500 rounded text-white"
                                                type="primary"
                                                disabled
                                            >
                                                Giao thành công
                                            </Button>
                                        ) : data.status === "5" ? (
                                            <Button
                                                className="w-full bg-green-500 rounded text-white"
                                                type="primary"
                                                disabled
                                            >
                                                Giao hàng thất bại
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    className="w-full bg-blue-500 rounded text-white"
                                                    type="primary"
                                                    onClick={() => {
                                                        setOrderId(data._id);
                                                        setDeliverSuccessModalVisible(true);
                                                    }}
                                                    disabled={role !== "courier"}
                                                >
                                                    Hoàn Thành
                                                </Button>
                                                <button
                                                    className={`w-full rounded text-white ${role !== "courier"
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-500"
                                                        }`}
                                                    onClick={() => setDeliverFailModalVisible(true)}
                                                    disabled={role !== "courier"}
                                                >
                                                    Thất Bại
                                                </button>
                                            </>
                                        )}
                                    </>
                                </div>
                            </Card>
                            <div>
                                {IsLoading && (
                                    <div
                                        style={{
                                            position: "fixed",
                                            top: 0,
                                            left: 0,
                                            width: "100vw",
                                            height: "100vh",
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <Loading />
                                    </div>
                                )}
                                <div>
                                    <Modal
                                        title="Xác Nhận Giao Hàng Thành Công"
                                        visible={isDeliverSuccessModalVisible}
                                        onOk={handleDeliverSuccess}
                                        onCancel={() => setDeliverSuccessModalVisible(false)}
                                        okButtonProps={{
                                            loading: IsLoading, // Hiển thị loading cho nút OK
                                        }}
                                    >
                                        <Form.Item
                                            name="confirmationImage"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn ảnh xác nhận",
                                                },
                                            ]}
                                        >
                                            <div className="px-5 py-3">
                                                {/* Tiêu đề */}
                                                <p className="mb-4 font-medium text-lg">
                                                    Ảnh Xác Nhận:
                                                </p>

                                                {/* Khu vực tải lên và xem trước */}
                                                <div className="flex items-center space-x-5">
                                                    {/* Nút upload */}
                                                    <Upload
                                                        listType="picture"
                                                        beforeUpload={() => false}
                                                        onChange={handleFileChange}
                                                        fileList={fileList}
                                                        maxCount={1}
                                                        accept="image/*"
                                                        showUploadList={false}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="w-36 h-36 rounded-lg border border-dashed border-gray-400 flex items-center justify-center bg-gray-50 hover:border-gray-500 transition"
                                                        >
                                                            <PlusOutlined className="text-gray-400 text-3xl" />
                                                        </button>
                                                    </Upload>

                                                    {/* Hiển thị ảnh preview */}
                                                    {previewImage && (
                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                src={previewImage}
                                                                alt="Ảnh Xác Nhận"
                                                                className="rounded-lg border border-gray-400"
                                                                style={{
                                                                    width: 120,
                                                                    height: 120,
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                Ảnh đã chọn
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Form.Item>
                                    </Modal>

                                    <Modal
                                        title="Lý Do Giao Hàng Thất Bại"
                                        visible={isDeliverFailModalVisible}
                                        onCancel={() => setDeliverFailModalVisible(false)}
                                        okButtonProps={{
                                            loading: IsLoading, // Hiển thị loading cho nút OK
                                        }}
                                        footer={[
                                            <Button
                                                key="cancel"
                                                onClick={() => setDeliverFailModalVisible(false)}
                                            >
                                                Hủy
                                            </Button>,
                                            <Button
                                                key="submit"
                                                type="primary"
                                                onClick={handleFailDelivery}
                                                disabled={!selectedReason && !customReason}
                                            >
                                                Xác Nhận
                                            </Button>,
                                        ]}
                                    >
                                        <Form>
                                            <Form.Item label="Lý do giao hàng thất bại">
                                                <Radio.Group
                                                    onChange={(e) => setSelectedReason(e.target.value)}
                                                    value={selectedReason}
                                                >
                                                    {defaultReasons.map((reason) => (
                                                        <div className="flex-row">
                                                            <Radio key={reason} value={reason}>
                                                                {reason}
                                                            </Radio>
                                                        </div>
                                                    ))}
                                                    <Radio value="Khác">Khác</Radio>
                                                </Radio.Group>
                                            </Form.Item>

                                            {selectedReason === "Khác" && (
                                                <Form.Item label="Nhập lý do khác">
                                                    <Input.TextArea
                                                        value={customReason}
                                                        onChange={(e) => setCustomReason(e.target.value)}
                                                        rows={3}
                                                        placeholder="Vui lòng nhập lý do khác"
                                                    />
                                                </Form.Item>
                                            )}
                                        </Form>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shipper_Order;