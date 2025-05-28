import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import instance from "../../../configs/axios";

// Custom hook to fetch active vouchers
export const useVouchersQuery = () => {
  return useQuery({
    queryKey: ["Vouchers"], // Query key for caching
    queryFn: async () => {
      try {
        const response = await instance.get("/voucher");
        console.log("API Response:", response.data); // Kiểm tra phản hồi
        if (!response?.data?.vouchers) {
          throw new Error("Không tìm thấy vouchers trong phản hồi");
        }
        return response.data.vouchers.filter(
          (voucher: any) => voucher.isActive === true
        );
      } catch (error: any) {
        console.error("API Error:", error.response || error.message); // Log lỗi chi tiết
        toast.error("Không thể tải danh sách voucher", { autoClose: 1200 });
        throw error;
      }
    },
  });
};
