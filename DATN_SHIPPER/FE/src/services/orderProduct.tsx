import instance from "../configs/axios";
import { toast } from "react-toastify";
const baseUri = "http://localhost:2024/api/v1/orders";

export async function get_order_client(
  page?: number,
  status?: number,
  role?: string,
  userId?: string
) {
  try {
    let uri = baseUri;
    const params = [];
    if (page) {
      params.push(`_page=${page}`);
    }
    if (status) {
      params.push(`_status=${status}`);
    }
    if (role === "courier" && userId) {
      params.push(`_shipperId=${userId}`);
    }
    if (params.length > 0) {
      uri += `?${params.join("&")}`;
    }
    const token = localStorage.getItem("token");
    const res = await fetch(uri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn("Kiểm tra lại server hoặc kết nối internet!");
      return; // Dừng xử lý nếu phản hồi không thành công
    }

    const jsonResponse = await res.json();
    if (jsonResponse && jsonResponse.data && jsonResponse.data.docs) {
      const { data, totalDocs, totalPages } = jsonResponse;
      return { data: data.docs, totalDocs, totalPages };
    } else {
      console.error("Phản hồi từ API không hợp lệ hoặc không có dữ liệu!");
      return { data: [], totalDocs: 0, totalPages: 0 }; // Trả về giá trị mặc định để tránh lỗi undefined
    }
  } catch (error) {
    console.error("Lỗi server:", error);
  }
}

export const getOrderById = async (id: string) => {
  try {
    const { data } = await instance.get(`/orders/${id}`);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getOneOrderUser = async (userId: string) => {
  try {
    const { data } = await instance.get(`/orders/get_order_user/${userId}`);

    return data?.docs;
  } catch (error) {
    console.log(error);
  }
};

export const Add_Order = async (order: any) => {
  try {
    const data = await instance.post(`/orders`, order);
    if (data?.status === 201) {
      sessionStorage.removeItem("item_order");
      toast.success("Đặt hàng thành công", { autoClose: 500 });
    } else {
      toast.error("Đặt hàng không thành công", { autoClose: 500 });
    }

    return data;
  } catch (error: any) {
    if (error.response) {
      toast.error("Sản phẩm số lượng không còn đủ trong kho", {
        autoClose: 500,
      });
    }
  }
};
export const Update_Status = async (items: any) => {
  console.log(items);
  try {
    const { data } = await instance.patch(`orders/${items.id}`, items.status);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// lấy các đơn hàng trong ngày
export const getOrderOfDay = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_of_to_day`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
// lấy các đơn hàng trong tuần
export const getOrderOfWeek = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_week`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
// lấy các đơn hàng theo các thứ trong tuần
export const getOrderByDayOfWeek = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_by_day_of_week`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
// lấy các đơn hàng trong tháng
export const getOrderOfMonth = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_month`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getOrderByMonthOfYear = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_by_month_of_year`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getTop10ProductSale = async () => {
  try {
    const { data } = await instance.get(`/orders/top_10_products_best_sale`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const Cancel_Order = async (id: any, cancellationReason: any) => {
  try {
    const { data } = await instance.post(`/orders/${id}/cancel`, {
      cancellationReason,
    });
    const message = "yeu_cau_huy";
    const res = {
      data,
      message,
    };
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const failDelivery = async (id_item: any, failureReason: any) => {
  try {
    const response = await instance.post(`/orders/${id_item}/fail-delivery`, {
      failureReason, // Chỉ gửi lý do thất bại
    });
    return response.data;
  } catch (error) {
    throw new Error("Ghi nhận giao hàng thất bại thất bại");
  }
};

export const confirmCancelOrder = async ({ id_item, confirm }: any) => {
  try {
    const { data } = await instance.post(`/orders/${id_item}/cancel/confirm`, {
      confirm,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const cancel_product = async (id: any, cancellationReason: any) => {
  try {
    const { data } = await instance.patch(`/orders/${id}`, {
      status: "7",
      cancellationReason,
    });
    const message = "huy";
    const res = {
      data,
      message,
    };
    console.log(data);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const complete_product = async (id: any) => {
  console.log(id);

  try {
    const { data } = await instance.patch(`/orders/${id}`, { status: "6" });
    return data;
  } catch (error) {
    console.log(error);
  }
};
// export const updateOrderStatus = async (id: any, currentStatus: string) => {
//   const statusOrder: any = {
//     "1": "2",
//     "2": "3",
//     "3": "4",
//   };
//   if (currentStatus === "5") {
//     return;
//   }
//   const nextStatus = statusOrder[currentStatus] || "4";

//   try {
//     const { data } = await instance.patch(`/orders/${id}`, { status: nextStatus });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
