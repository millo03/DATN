import { useQuery } from "@tanstack/react-query";
import instance from "../../../configs/axios";

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["products", categoryId], 
    queryFn: async () => {
      const { data } = await instance.get(
        `/category/products/${categoryId}`
      );
      return data;
    },
    enabled: !!categoryId, 
  });
};
