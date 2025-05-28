import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import instance from "../../../../configs/axios";

// Khai báo kiểu cho dữ liệu biểu đồ
interface OrderStat {
  name: string;
  value: number; // Giá trị của đơn hàng thành công hoặc thất bại
}

const OrderSuccessFailure = () => {
  const [data, setData] = useState<OrderStat[]>([]); // Khai báo kiểu cho state data
  const [loading, setLoading] = useState<boolean>(true); // Khai báo kiểu cho state loading

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await instance.get(
          "/orders/order_success_failure_stats"
        ); // Đường dẫn API của bạn
        const { successCount, failureCount } = response.data;

        // Chuyển đổi dữ liệu thành định dạng cho biểu đồ
        setData([
          { name: "Đơn hàng thành công", value: successCount },
          { name: "Đơn hàng thất bại", value: failureCount },
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border border-gray-200 bg-white p-5 shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-center">
        Thống kê đơn hàng Thành công - Thất bại
      </h2>
      <PieChart width={400} height={350}>
        <Pie
          data={data}
          cx={200}
          cy={130}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? "#82ca9d" : "#ff7300"}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default OrderSuccessFailure;
