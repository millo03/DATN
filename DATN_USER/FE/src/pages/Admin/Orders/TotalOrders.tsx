import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import instance from "../../../configs/axios";
import { LoadingOutlined } from "@ant-design/icons";

interface Order {
  _id: string;
  fullName: string;
  successfulOrders: number;
  failedOrders: number;
}

const TotalOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await instance.get("/orders/daily-order-summary");
        console.log(response.data);

        if (Array.isArray(response.data.shippers)) {
          setOrders(response.data.shippers);
        } else {
          setOrders([response.data]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columnsTotalOrders = [
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Tên Shipper
        </div>
      ),
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Đơn hàng thành công
        </div>
      ),
      dataIndex: "successfulOrders",
      key: "successfulOrders",
      align: "center",
      render: (successfulOrders: number) => (
        <div style={{ textAlign: "center" }}>{successfulOrders}</div>
      ),
    },
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Đơn hàng thất bại
        </div>
      ),
      dataIndex: "failedOrders",
      key: "failedOrders",
      align: "center",
      render: (failedOrders: number) => (
        <div style={{ textAlign: "center" }}>{failedOrders}</div>
      ),
    },
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Tổng số đơn hàng
        </div>
      ),
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
      render: (_: any, record: Order) => (
        <div style={{ textAlign: "center" }}>
          {record.successfulOrders + record.failedOrders}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="my-4"
      />
    );
  }

  return (
    <div className="m-6">
      <div className="flex items-center justify-between mt-20 mb-5">
        <h1 className="text-2xl font-semibold">Tổng số đơn hàng của shipper</h1>
      </div>
      <Table
        columns={columnsTotalOrders}
        dataSource={orders}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default TotalOrders;
