import { useQuery } from "@tanstack/react-query";
import {
  get_order_client,
  getOneOrderUser,
  getOrderByDayOfWeek,
  getOrderById,
  getOrderByMonthOfYear,
  getOrderOfDay,
  getOrderOfMonth,
  getOrderOfWeek,
  getOrderTemporary,
  getTop10ProductSale
} from "../../../services/orderProduct";
import {
  GetAllOrdersSuccess,
  GetNew10OrderInDay,
  GetOrderBuyNumberOrNumberPhone
} from "../../../_lib/Orders/order";

export function List_One_Order_User(userId: string) {
  const { data, ...rest } = useQuery({
    queryKey: ["Order_key", userId],
    queryFn: async () => {
      return await getOneOrderUser(userId);
    }
  });

  return { data, ...rest };
}
export const Query_Orders = (
  id?: string,
  page?: number,
  status?: string,
  role?: string,
  userId?: string
) => {
  // Tạo key cho cache dựa trên id, page, và status
  const key = id ? ["Order_Key", id] : ["Order_Key"];

  const { data, ...rest } = useQuery({
    queryKey: [...key, page, status, role, userId], // Cache key cho query
    queryFn: async () => {
      // Nếu có id, gọi hàm lấy đơn hàng theo id
      return id
        ? getOrderById(id)
        : get_order_client(page, status, role, userId);
    }
    // Optional: Cấu hình thêm nếu cần
  });

  // Trả về dữ liệu và các thông tin khác từ hook
  return { data: data?.data || data, totalPages: data?.totalPages, ...rest };
  // console.log(data);
};
export const useOrdersOfDay = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderOfDay"],
    queryFn: async () => {
      try {
        return await getOrderOfDay();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useOrdersTemporary = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderTemporary"],
    queryFn: async () => {
      try {
        return await getOrderTemporary();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useOrdersOfWeek = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderOfWeek"],
    queryFn: async () => {
      try {
        return await getOrderOfWeek();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useOrdersByDayOfWeek = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderByDayOfWeek"],
    queryFn: async () => {
      try {
        return await getOrderByDayOfWeek();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useOrdersOfMonth = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderOfMonth"],
    queryFn: async () => {
      try {
        return await getOrderOfMonth();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useOrdersByMonthOfYear = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["orderByMonthOfYear"],
    queryFn: async () => {
      try {
        return await getOrderByMonthOfYear();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useTop10ProductBestSale = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["top10ProductBestSale"],
    queryFn: async () => {
      try {
        return await getTop10ProductSale();
      } catch (error) {
        throw new Error((error as any).message);
      }
    }
  });
  return { data, ...rest };
};
export const useSearchOrdersByNumberOrNumberPhone = (searchOrder: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["Search_Order", searchOrder],
    queryFn: () => GetOrderBuyNumberOrNumberPhone(searchOrder),
    enabled: !!searchOrder
  });
  return { data, ...rest };
};
export const use10NewOrderInDay = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["Order_Key"],
    queryFn: () => GetNew10OrderInDay()
  });
  return { data, ...rest };
};

export const useAllOrderSuccess = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["AllOrdersSuccess"],
    queryFn: () => GetAllOrdersSuccess()
  });
  return { data, ...rest };
};
