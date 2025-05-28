import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { message, Card, Typography } from "antd";
import instance from "../../../../configs/axios";
import { Chart, registerables } from "chart.js";

// Đăng ký các thành phần của Chart.js
Chart.register(...registerables);

const { Text } = Typography;

const OrderStatsMonth = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [successfulOrders, setSuccessfulOrders] = useState(
    new Array(5).fill(0)
  );
  const [failedOrders, setFailedOrders] = useState(new Array(5).fill(0));
  const [monthStart, setMonthStart] = useState("");
  const [monthEnd, setMonthEnd] = useState("");

  useEffect(() => {
    const fetchOrdersThisMonth = async () => {
      try {
        const response = await instance.get("/orders/order_shipper_month");
        console.log("Dữ liệu trả về từ API:", response.data);

        if (
          response.data &&
          response.data.totalOrders !== undefined &&
          Array.isArray(response.data.weeksOrders)
        ) {
          const { totalOrders, weeksOrders, monthStart, monthEnd } =
            response.data;

          setTotalOrders(totalOrders);
          // Trích xuất giá trị count cho đơn hàng thành công và thất bại từ weeksOrders
          const successfulCounts = weeksOrders.map(
            (week:any) => week.successfulCount
          );
          const failedCounts = weeksOrders.map((week:any) => week.failedCount);

          setSuccessfulOrders(successfulCounts);
          setFailedOrders(failedCounts);
          setMonthStart(monthStart);
          setMonthEnd(monthEnd);
        } else {
          message.warning("Dữ liệu không hợp lệ.");
        }
      } catch (error) {
        message.error("Không thể lấy thông tin đơn hàng.");
        console.error("Error fetching orders this month:", error);
      }
    };

    fetchOrdersThisMonth();
  }, []);

  // Dữ liệu cho biểu đồ
  const data = {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Tuần 5"],
    datasets: [
      {
        label: "Đơn hàng thành công",
        data: successfulOrders,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Đơn hàng thất bại",
        data: failedOrders,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Màu sắc cho đơn hàng thất bại
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-lg rounded-lg p-0 mx-auto my-0 w-full h-full">
      <h1 className="text-xl font-bold mb-4 text-center p-4">
        Tổng số đơn hàng trong tháng này: {totalOrders}
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
                  padding: 20, // Thêm padding cho tiêu đề y
                },
                ticks: {
                  color: "#555", // Màu sắc cho ticks
                },
              },
              x: {
                ticks: {
                  color: "#555", // Màu sắc cho ticks
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "#333", // Màu sắc cho nhãn legend
                },
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

export default OrderStatsMonth;
