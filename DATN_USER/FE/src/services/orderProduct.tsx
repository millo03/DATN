import instance from "../configs/axios";
import { toast } from "react-toastify";
const baseUri = "http://localhost:2004/api/v1/orders";

// export const GetAllOrder = async (page: number, status: string = "") => {
//   try {
//     const { data } = await instance.get(`/orders?page=${page}&status=${status}`);
//     console.log(data);

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };
export async function get_order_client(
  page?: number,
  status?: string,
  role?: any,
  userId?: any
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
      console.warn("Kiem tra lai server hoac internet !");
    }
    const { data, totalDocs, totalPages } = await res.json();
    return { data: data.docs, totalDocs, totalPages };
  } catch (error) {
    console.log(error || "Loi server!");
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
    // if (error.response) {
    //   toast.error("Sản phẩm số lượng không còn đủ trong kho", {
    //     autoClose: 500,
    //   });
    // }
  }
};

export const Update_Status = async (id: any, cancellationReason: any) => {
  console.log(id);

  try {
    const { data } = await instance.patch(`/orders/${id}`, {
      status: "2",
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

// lấy các đơn hàng trong ngày
export const getOrderOfDay = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_of_to_day`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getOrderTemporary = async () => {
  try {
    const { data } = await instance.get(`/orders/all_order_temporary`);
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
