import React, { useEffect, useState } from "react";
import { message, Card, Typography, Table, Tag } from "antd";
import instance from "../../../../configs/axios";

const { Text } = Typography;

interface Order {
  userName: string; // Tên người mua
  quantity: number; // Số lượng
  status: number; // Trạng thái
  deliveredAt: string; // Ngày giao hàng
}

const OrderStats = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get("/orders/order_shipper_to_day");
        console.log(response.data); // In ra dữ liệu để kiểm tra
        setOrders(
          response.data.orders.map((order: any) => ({
            userName: order.customerInfo.userName, // Lấy tên người mua
            quantity: order.quantity || 1, // Giả sử số lượng là 1 nếu không có thông tin
            status: order.status,
            deliveredAt: order.deliveredAt,
          }))
        );
        setDate(response.data.date);
        setTotalOrders(response.data.totalOrders);
      } catch (error) {
        message.error("Không thể lấy thông tin đơn hàng.");
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Tên người mua",
      dataIndex: "userName", // Cập nhật trường này để lấy tên người mua
      key: "userName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string | number) => {
        const numericStatus = Number(status);
        return numericStatus === 6 ? (
          <Tag color="green">Thành công</Tag>
        ) : numericStatus === 5 ? (
          <Tag color="red">Thất bại</Tag>
        ) : (
          <Tag color="blue">Trạng thái khác</Tag>
        );
      },
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "deliveredAt",
      key: "deliveredAt",
      render: (deliveredAt: string) =>
        new Date(deliveredAt).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <Card className="border border-gray-200 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-5 -mt-5">
        Thống kê đơn hàng hôm nay
      </h2>
      <div className="flex justify-between mb-10">
        <Text className="font-medium">Ngày: {date}</Text>
        <Text className="font-medium">
          Tổng số đơn hàng ship trong ngày: {totalOrders}
        </Text>
      </div>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey={(record) => record.userName} // Thay đổi key nếu cần
        pagination={{ pageSize: 5 }}
        className="bg-white rounded-lg border border-gray-300"
      />
    </Card>
  );
};

export default OrderStats;
