/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import instance from "../../configs/axios";
import { getToken } from "../../common/hooks/Auth/useAuthorization";

const token = getToken();
const baseUri = "http://localhost:2004/api/v1/products";

export async function get_items_client(page?: number) {
  try {
    let uri = baseUri;
    if (page) {
      uri += `?_page=${page}`;
    }
    const res = await fetch(`${uri}`);
    if (!res.ok) {
      console.warn("Kiem tra lai server hoac internet !");
    }
    const { data } = await res.json();
    return data.docs;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function get_all_items_client() {
  try {
    const res = await fetch(`http://localhost:2004/api/v1/products_all`);
    if (!res.ok) {
      console.warn("Kiem tra lai server hoac internet !");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function get_items_dashboard(page?: number) {
  try {
    let uri = `${baseUri}/dashboard`;

    if (page) {
      uri += `?_page=${page}`;
    }
    const res = await fetch(`${uri}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn("Kiem tra lai server hoac internet !");
      return res.status;
    }
    const { data } = await res.json();

    return data;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function get_detai_items_dashboard(id: number | string) {
  try {
    const uri = `${baseUri}/dashboard/${id}`;
    const res = await fetch(`${uri}`);
    if (!res.ok) {
      console.warn("Kiem tra lai server hoac internet !");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function get_limit_items(limit: number) {
  try {
    const uri = `/products?&_limit=${limit}`;
    const { data } = await instance.get(uri);
    return data?.data?.docs;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function get_detail_items(id: number | string) {
  try {
    if (!id) {
      throw new Error("Thiếu tham số ID");
    }

    const res = await fetch(`${baseUri}/${id}`);
    console.log(res);
    if (!res.ok) {
      console.warn("Server trả về trạng thái không thành công:", res.status);
      throw new Error("Không thể lấy sản phẩm");
    }
    const data = await res.json();
    if (!data) {
      throw new Error("Không có dữ liệu sản phẩm");
    }
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    return null;
  }
}

export async function add_items_client(items: any) {
  try {
    const res = await fetch(`${baseUri}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(items.dataBody),
    });
    if (!res.ok) {
      toast.error("Tạo sản phẩm thất bại!! vui lòng kiểm tra lại", {
        autoClose: 500,
      });
      return res;
    } else {
      toast.success("Tạo sản phẩm thành công.", { autoClose: 500 });
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}

export async function edit_items_client(product: any) {
  try {
    const res = await fetch(`${baseUri}/${product.id_item}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product.dataBody),
    });

    if (!res.ok) {
      toast.error(
        `Cập nhật sản phẩm mã ${product.id_item} thất bại!! vui lòng kiểm tra lại`,
        { autoClose: 500 }
      );
      console.warn("Kiem tra lai server hoac internet !");
      throw new Error("Request failed with status " + res.status);
    } else {
      toast.success(`Cập nhật sản phẩm mã ${product.id_item} thành công.`, {
        autoClose: 500,
      });
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error || "Loi server!");
    throw error;
  }
}

export async function remove_items(dataBody: any) {
  try {
    const res = await fetch(`${baseUri}/${dataBody.id_item}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      toast.error(`Không thể xóa sản phẩm ${dataBody.id_item}`, {
        autoClose: 500,
      });
      return res;
    }
    return res;
  } catch (error) {
    console.log(error || "Loi server!");
  }
}
export const remove_multiple_products = async (data: {
  productIds: string[];
}) => {
  try {
    const response = await instance.post("/products/remove", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error || "Loi server!");
  }
};
export const destroy_delete_Product = async (id: string) => {
  try {
    const response = await fetch(
      `http://localhost:2004/api/v1/products/destroy/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      toast.error(`Không thể xóa sản phẩm ${id}`, { autoClose: 500 });
      return response;
    }
    await response.json();
    return response;
  } catch (error) {
    console.log(error || "Loi server!");
  }
};

export const restoreProduct = async (item: any) => {
  try {
    const response = await fetch(`${baseUri}/recycle/${item.id_item}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      toast.error(`Không thể khôi phục sản phẩm ${item.id_item}`, {
        autoClose: 500,
      });
      return response;
    }
    await response.json();
    return response;
  } catch (error) {
    console.log(error || "Loi server!");
  }
};

export async function getDeletedProducts() {
  try {
    const response = await fetch(`${baseUri}/adminstration/dashboard/trash`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách sản phẩm đã xóa");
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm đã xóa mềm:", error);
    throw error;
  }
}
export const getProductsByName = async (searchName: any) => {
  try {
    const { data } = await instance.post("/products/search", { searchName });
    return data;
  } catch (error) {
    console.log(error);
  }
};
