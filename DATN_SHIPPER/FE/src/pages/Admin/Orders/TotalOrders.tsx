import React, { useState, useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import instance from "../../../configs/axios";

interface Order {
  _id: string;
  fullName: string;
  totalOrders: number;
  ordersByDate: {
    date: string;
    addresses: string[];
  }[];
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
          Tổng số đơn hàng
        </div>
      ),
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
      render: (totalOrders: number) => (
        <div style={{ textAlign: "center" }}>{totalOrders}</div>
      ),
    },
  ];

  const columnsAddresses = [
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
      render: (text: string) => <div>{text}</div>,
    },

    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Số lượng đơn hàng
        </div>
      ),
      dataIndex: "ordersByDate",
      key: "orderCount",
      align: "center",
      render: (ordersByDate: { date: string; count: number }[]) => (
        <ul>
          {ordersByDate.map((detail, index) => (
            <li
              key={index}
              style={{
                padding: "8px 0",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              Số đơn hàng: {detail.count}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Ngày giao hàng
        </div>
      ),
      dataIndex: "ordersByDate",
      key: "ordersByDate",
      align: "center",
      render: (ordersByDate: { date: string; addresses: string[] }[]) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {ordersByDate.map((detail, index) => (
            <li
              key={index}
              style={{
                padding: "8px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Ngày: {detail.date}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: (
        <div
          style={{ fontSize: "15px", fontWeight: "bold", textAlign: "center" }}
        >
          Địa chỉ giao hàng
        </div>
      ),
      dataIndex: "ordersByDate",
      key: "orderAddress",
      align: "center",
      render: (ordersByDate: { date: string; addresses: string[] }[]) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {ordersByDate.map((detail, index) => (
            <li
              key={index}
              style={{
                padding: "8px 0",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {detail.addresses.map((address, addrIndex) => (
                <div key={addrIndex} style={{ padding: "4px 0" }}>
                  Địa chỉ: {address}
                </div>
              ))}
            </li>
          ))}
        </ul>
      ),
    },
  ];
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spin size="large" /> {/* Loading spinner */}
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
      <div className="flex items-center justify-between mt-20 mb-5">
        <h1 className="text-2xl font-semibold">
          Tổng số đơn hàng của shipper theo từng ngày
        </h1>
      </div>
      <Table
        columns={columnsAddresses}
        dataSource={orders}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default TotalOrders;
