import { useQuery } from "@tanstack/react-query";
import instance from "../../../../configs/axios";

const useDataVoucher = () => {
  const {
    data: auth,
    isLoading: authLoading,
    error: authError,
  } = useQuery({
    queryKey: ["auths"],
    queryFn: () => instance.get(`/auths`),
  });

  const {
    data: shippers,
    isLoading: shippersLoading,
    error: shippersError,
  } = useQuery({
    queryKey: ["shippers"],
    queryFn: () => instance.get(`/shippers`),
  });

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await instance.get(`/products`);
        return response?.data.data.docs;
      } catch (error) {
        throw new Error("Failed to fetch products");
      }
    },
  });

  // Tổng hợp trạng thái loading
  const isLoading = authLoading || shippersLoading || productsLoading;

  // Tổng hợp các lỗi
  const errors = {
    auth: authError,
    shippers: shippersError,
    products: productsError,
  };

  return {
    auth,
    shippers,
    products,
    isLoading,
    errors,
  };
};

export default useDataVoucher;
