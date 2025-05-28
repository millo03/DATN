import { useState, useEffect } from "react";
import axios from "axios";
import instance from "../../../configs/axios";

interface UseAttributesResult {
  sizes: string[]; // Mảng tên của các size có sản phẩm
  loading: boolean;
  error: string | null;
}

const useAttributes = (): UseAttributesResult => {
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        // Gửi request đến API backend để lấy danh sách các size có sản phẩm
        const response = await instance.get(
          "/thuoc_tinh/lay_tat_ca_thuoc_tinh"
        );

        // Dữ liệu trả về đã được lọc để chỉ chứa size có sản phẩm
        setSizes(response.data.sizes); // Lưu danh sách size vào state
        setLoading(false);
      } catch (err) {
        // Xử lý lỗi nếu có
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    // Gọi hàm fetchAttributes khi component mount
    fetchAttributes();
  }, []);

  return { sizes, loading, error };
};

export default useAttributes;
