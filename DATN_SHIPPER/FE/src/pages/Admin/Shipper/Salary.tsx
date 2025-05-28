import React from "react";
import { Card, Table, Row, Col, Divider } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";

const Salary = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const currentMonth = new Date().getMonth() + 1;

  // Thay đổi queryFn để trả về dữ liệu từ `response.data`
  const { data: salary_month } = useQuery({
    queryKey: ["Salary_shipper_month"],
    queryFn: async () => {
      const response = await instance.get(
        `/shippers/${userId}/salary/calculate`
      );
      return response.data; // Truy cập vào `data` của response
    },
  });
  console.log(salary_month);

  const { data: salary_daily } = useQuery({
    queryKey: ["Salary_shipper_daily"],
    queryFn: async () => {
      const response = await instance.get("/orders_daily");
      return response.data; // Truy cập vào `data` của response
    },
  });
  console.log(salary_daily);

  // Convert dữ liệu từ salary_daily thành mảng cho bảng
  const dailyData = salary_daily
    ? Object.entries(salary_daily.dailyStats).map(([date, stats]) => ({
        date,
        orderCount: stats.orderCount,
        totalDistance: stats.totalDistance,
      }))
    : [];

  // Các cột của bảng
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tổng số đơn",
      dataIndex: "orderCount",
      key: "orderCount",
      align: "center",
    },
    {
      title: "Số kilomet",
      dataIndex: "totalDistance",
      key: "totalDistance",
      align: "center",
    },
  ];

  return (
    <div className="mt-[100px]">
      <Card
        title={`Bảng tính lương và thưởng tháng ${currentMonth}`}
        className="mt-[20px]"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Tổng quan">
              <p>
                <strong>Tổng đơn hàng đã giao:</strong>{" "}
                {salary_month?.salaryData?.totalOrders} ĐƠN
              </p>
              <p>
                <strong>Tổng số km:</strong>{" "}
                {salary_month?.salaryData?.totalDistance} KM
              </p>
              <p>
                <strong>Thưởng tháng:</strong>{" "}
                {salary_month?.salaryData?.monthlyBonus} VND
              </p>
              <p>
                <strong>Tổng lương:</strong>{" "}
                {salary_month?.salaryData?.totalPayment} VND
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Thành tích thưởng">
              <p>
                Hoàn thành 150km/tháng:{" "}
                {salary_month?.salaryData?.totalDistance >= 150
                  ? "Đã đạt"
                  : "Chưa đạt"}
              </p>
            </Card>
          </Col>
        </Row>

        <Divider />

        <div>
          <Card
            title="Bảng thống kê đơn hàng và quãng đường hàng ngày"
            className="mt-[20px]"
          >
            <Table
              dataSource={dailyData}
              columns={columns}
              pagination={false}
              rowKey="date"
            />
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Salary;
