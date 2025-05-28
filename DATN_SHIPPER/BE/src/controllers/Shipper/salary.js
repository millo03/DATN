// controllers/salaryController.js
import Salary from "../../models/Shipper/salary";
import Order from "../../models/Orders/orders.js";
import Shipper from "../../models/Shipper/shipper.js";

// Tính lương cho shipper
export const calculateSalary = async (shipperId, month) => {
  const orders = await Order.find({ shipperId }); // Lấy tất cả đơn hàng của shipper
  let totalDistance = 0;
  let totalSalary = 0;
  let weeklyBonus = 0;
  let monthlyBonus = 0;

  const dailyRecords = {}; // Sử dụng object để ghi nhận số km theo ngày

  orders.forEach((order) => {
    const distance = order.deliveryDistance || 0; // Giả sử bạn đã lưu khoảng cách giao hàng
    totalDistance += distance;

    // Tính lương theo khoảng cách
    let ratePerKm = 0;
    if (distance < 5) {
      ratePerKm = 15000;
    } else if (distance >= 5 && distance <= 15) {
      ratePerKm = 20000;
    } else {
      ratePerKm = 25000;
    }

    // Tính lương cho đơn hàng
    const dailyEarnings = ratePerKm * distance;
    totalSalary += dailyEarnings;

    // Ghi nhận khoảng cách giao hàng theo ngày
    const date = order.createdAt.toISOString().split("T")[0]; // Lấy ngày
    if (!dailyRecords[date]) {
      dailyRecords[date] = {
        date: new Date(date),
        totalDistance: 0,
        dailyEarnings: 0,
      };
    }
    dailyRecords[date].totalDistance += distance;
    dailyRecords[date].dailyEarnings += dailyEarnings;
  });

  // Tính thưởng tuần và tháng
  const totalWeeklyDistance = Object.values(dailyRecords).reduce(
    (acc, record) => acc + record.totalDistance,
    0
  );
  if (totalWeeklyDistance >= 100) {
    weeklyBonus = 100000; // Thưởng cho tuần
  }

  if (totalDistance >= 250) {
    monthlyBonus = 300000; // Thưởng cho tháng
  }

  totalSalary += weeklyBonus + monthlyBonus;

  // Lưu lương vào database
  const salaryRecord = await Salary.findOneAndUpdate(
    { shipperId, month },
    {
      totalDistance,
      baseSalary: totalSalary,
      weeklyBonus,
      monthlyBonus,
      totalSalary,
      dailyRecords: Object.values(dailyRecords),
    },
    { new: true, upsert: true } // Nếu không có, tạo mới
  );

  return salaryRecord;
};
