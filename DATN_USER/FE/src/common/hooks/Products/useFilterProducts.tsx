import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ProductResponse } from "../../../common/interfaces/Product";
import instance from "../../../configs/axios";
import React from "react";

const fetchFilteredProducts = async (
  query: string,
  cate_id: string[],
  price_ranges: { min: number; max: number }[],
  color: string[],
  name_size: string[],
  page: number = 1,
  limit: number = 20,
  sortOption: string = ""
) => {
  const endpoint = "/products/filter/Product";
  const params: { [key: string]: any } = {
    _search: query || undefined,
    cate_id: cate_id.length > 0 ? cate_id.join(",") : undefined,
    price_ranges:
      price_ranges.length > 0 ? JSON.stringify(price_ranges) : undefined,
    color: color.length > 0 ? color.join(",") : undefined,
    name_size: name_size.length > 0 ? name_size.join(",") : undefined,
    _page: page,
    _limit: limit,
    _sort: sortOption,
  };

  // Xóa các giá trị undefined khỏi params
  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  try {
    const response = await instance.get<ProductResponse>(endpoint, { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || "An error occurred";
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const useFilteredProducts = (
  query: string,
  cate_id: string[],
  price_ranges: { min: number; max: number }[],
  color: string[],
  name_size: string[],
  page: number = 1,
  limit: number = 20,
  sortOption: string = ""
) => {
  const navigate = useNavigate(); // Khai báo useNavigate

  // Tạo queryKey để caching
  const queryKey = [
    "products",
    query,
    cate_id,
    JSON.stringify(price_ranges),
    color,
    name_size,
    page,
    limit,
    sortOption,
  ];

  // // Cập nhật URL với tham số lọc
  // const updateURL = () => {
  //   const urlParams = new URLSearchParams();

  //   if (query) urlParams.set("keyword", query);
  //   urlParams.set("page", page.toString());
  //   if (sortOption) urlParams.set("sort", sortOption);
  //   if (cate_id.length) urlParams.set("cate_id", cate_id.join(","));
  //   if (price_ranges.length)
  //     urlParams.set("price_ranges", JSON.stringify(price_ranges));

  //   // Kiểm tra nếu color có giá trị, nếu không thì xóa
  //   if (color.length > 0) {
  //     urlParams.set("color", color.join(","));
  //   } else {
  //     urlParams.delete("color"); // Xóa color khỏi URL nếu không có màu
  //   }

  //   if (name_size.length) urlParams.set("name_size", name_size.join(","));

  //   // Cập nhật URL mới
  //   navigate({ search: urlParams.toString() });
  // };

  // // Gọi hàm updateURL mỗi khi các tham số lọc thay đổi
  // React.useEffect(() => {
  //   updateURL();
  // }, [query, cate_id, price_ranges, color, name_size, page, limit, sortOption]);

  // Sử dụng React Query để gọi API và lưu trữ kết quả
  const { data, error, isLoading, isError } = useQuery<
    ProductResponse,
    AxiosError
  >({
    queryKey,
    queryFn: () =>
      fetchFilteredProducts(
        query,
        cate_id,
        price_ranges,
        color,
        name_size,
        page,
        limit,
        sortOption
      ),
  });

  return { data, error, isLoading, isError };
};
