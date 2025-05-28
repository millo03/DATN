import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { message, Card, Typography } from "antd";
import instance from "../../../../configs/axios";
import { Chart, registerables } from "chart.js";

// Đăng ký các thành phần của Chart.js
Chart.register(...registerables);

const { Text } = Typography;

const OrderStatsWeek = () => {
  const [totalSuccessfulOrders, setTotalSuccessfulOrders] = useState(0);
  const [totalFailedOrders, setTotalFailedOrders] = useState(0);
  const [successfulOrdersPerDay, setSuccessfulOrdersPerDay] = useState(
    new Array(7).fill(0)
  );
  const [failedOrdersPerDay, setFailedOrdersPerDay] = useState(
    new Array(7).fill(0)
  );
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  useEffect(() => {
    const fetchOrdersThisWeek = async () => {
      try {
        const response = await instance.get("/orders/order_shipper_week");

        if (
          response.data &&
          response.data.totalSuccessfulOrders !== undefined &&
          response.data.totalFailedOrders !== undefined &&
          response.data.successfulOrdersPerDay &&
          response.data.failedOrdersPerDay
        ) {
          const {
            totalSuccessfulOrders,
            totalFailedOrders,
            successfulOrdersPerDay,
            failedOrdersPerDay,
            weekStart,
            weekEnd,
          } = response.data;
          setTotalSuccessfulOrders(totalSuccessfulOrders);
          setTotalFailedOrders(totalFailedOrders);
          setSuccessfulOrdersPerDay(
            successfulOrdersPerDay.length > 0
              ? successfulOrdersPerDay
              : new Array(7).fill(0)
          );
          setFailedOrdersPerDay(
            failedOrdersPerDay.length > 0
              ? failedOrdersPerDay
              : new Array(7).fill(0)
          );
          setWeekStart(weekStart);
          setWeekEnd(weekEnd);
        } else {
          message.warning("Dữ liệu không hợp lệ.");
        }
      } catch (error) {
        message.error("Không thể lấy thông tin đơn hàng.");
        console.error("Error fetching orders this week:", error);
      }
    };

    fetchOrdersThisWeek();
  }, []);

  // Dữ liệu cho biểu đồ
  const data = {
    labels: [
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
      "Chủ Nhật",
    ],
    datasets: [
      {
        label: "Đơn hàng thành công",
        data: successfulOrdersPerDay,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Màu nền cho đơn hàng thành công
        borderColor: "rgba(75, 192, 192, 1)", // Màu viền cho đơn hàng thành công
        borderWidth: 2, // Độ dày viền
        barPercentage: 0.6, // Độ rộng cột
      },
      {
        label: "Đơn hàng thất bại",
        data: failedOrdersPerDay,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Màu nền cho đơn hàng thất bại
        borderColor: "rgba(255, 99, 132, 1)", // Màu viền cho đơn hàng thất bại
        borderWidth: 2, // Độ dày viền
        barPercentage: 0.6, // Độ rộng cột
      },
    ],
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-lg rounded-lg p-0 mx-auto my-0 w-full h-full">
      <h1 className="text-lg font-semibold text-center p-4">
        Tổng số đơn hàng thành công: {totalSuccessfulOrders} | Tổng số đơn hàng
        thất bại: {totalFailedOrders}
      </h1>
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Để biểu đồ chiếm toàn bộ chiều cao
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Số lượng đơn hàng",
                },
                ticks: {
                  stepSize: 1, // Bước nhảy trên trục y
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Ngày trong tuần",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
};

export default OrderStatsWeek;
