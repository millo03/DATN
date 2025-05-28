import { useQuery } from "@tanstack/react-query";
import { getAllProduct, getProductById } from "./../../../services/product";

const useProductQuery = (id?: string) => {
  const queryKey = id ? ["PRODUCT_KEY", id] : ["PRODUCT_KEY"];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let result;
        if (id) {
          result = await getProductById(id);
        } else {
          result = await getAllProduct();
        }
        return result || []; // Trả về result hoặc một giá trị mặc định là một mảng rỗng
      } catch (error) {
        console.error("Error fetching product data:", error);
        throw new Error("Failed to fetch product data"); // Ném một lỗi để xử lý trong React Query
      }
    }
  });

  return { data, ...rest };
};

export default useProductQuery;
