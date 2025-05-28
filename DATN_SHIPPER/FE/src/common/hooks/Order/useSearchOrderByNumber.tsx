import { useState } from "react";
import axios from "axios";
import instance from "../../../configs/axios";

interface Order {
  status: string;
  _id: string;
  orderNumber: string;
}

interface Error {
  message: string;
}

const useSearchOrderByNumber = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchOrderByNumber = async (orderNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `/orders/FilterNumber/${orderNumber}`
      );
      console.log(response);

      setOrder(response.data.order);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({ message: err.response?.data?.message || "Lỗi máy chủ!" });
      } else {
        setError({ message: "Đã xảy ra lỗi không xác định!" });
      }
    } finally {
      setLoading(false);
    }
  };

  return { order, error, loading, searchOrderByNumber };
};

export default useSearchOrderByNumber;
