import { useQuery } from "@tanstack/react-query";
import {
  get_detai_items_dashboard,
  get_detail_items,
  get_items_client,
  get_items_dashboard,
  get_limit_items,
  getDeletedProducts,
  getProductsByName,
} from "../../../_lib/Items/Products";
// import { reduce } from "lodash";

export const Query_Products = (id?: string | number, page?: number) => {
  const key = id ? ["Product_Key", id] : ["Product_Key"];
  const { data, ...rest } = useQuery({
    queryKey: key,
    queryFn: async () => {
      return id ? await get_detail_items(id) : await get_items_client(page);
    },
  });
  return { data, ...rest };
};

export function Query_Products_Dashboard(page: number) {
  const { data, ...rest } = useQuery({
    queryKey: ["Product_Key", page],
    queryFn: () => get_items_dashboard(page),
  });
  return { data, ...rest };
}

export const Query_Detail_Products_Dashboard = (id: string | number) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Product_Key", id],
    queryFn: () => get_detai_items_dashboard(id),
    enabled: !!id,
  });
  return { data, ...rest };
};

export const Query_Limit_Items = (limit: number) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Product_Key", limit],
    queryFn: async () => await get_limit_items(limit),
  });
  console.log(data);

  return { data, ...rest };
};

export function Query_Trash_Item() {
  const { data, ...rest } = useQuery({
    queryKey: ["Product_Key"],
    queryFn: () => getDeletedProducts(),
  });
  return { data, ...rest };
}
export const useQueryProductsSearch = (searchName: any) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_Products", searchName],
    queryFn: () => getProductsByName(searchName),
    enabled: !!searchName,
  });
  return { data, ...rest };
};
