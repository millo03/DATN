import { useQuery } from "@tanstack/react-query";
import { getAllShipper } from "../../../_lib/Shipper/shipper";

export const useListAllShipper = () => {
  return useQuery({
    queryKey: ["List_shipper"],
    queryFn: async () => {
      const response = await getAllShipper();
      return response;
    },
  });
};
