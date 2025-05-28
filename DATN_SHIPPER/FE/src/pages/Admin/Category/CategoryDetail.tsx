import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProductsByCategory } from "../../../common/hooks/Category/useProductsByCategory";
import { Table, Spin, Alert, Button, Popconfirm, message } from "antd";
import { BackwardFilled, LoadingOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useCategoryQuery } from "../../../common/hooks/Category/useCategoryQuery";
import { IProduct } from "../../../common/interfaces/Product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";

const CategoryDetail: React.FC = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams<{ id: string }>();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsByCategory(id || "");
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoryQuery();
  const [categoryName, setCategoryName] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: async (id: IProduct) => {
      try {
        return await instance.delete(`/products/${id}`);
      } catch (error) {
        throw new Error("Xóa sản phẩm thất bại");
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Xóa Sản phẩm thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error.message,
      });
      throw error;
    },
  });
  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (categories) {
      const category = categories.find((cat: any) => cat._id === id);
      setCategoryName(
        category ? category.name_category : "Danh mục không tìm thấy"
      );
    }
  }, [categories, id]);

  if (productsLoading || categoriesLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin indicator={loadingIcon} />
      </div>
    );
  }

  if (productsError || categoriesError) {
    const errorMessage =
      (productsError && (productsError as Error).message) ||
      (categoriesError && (categoriesError as Error).message) ||
      "Có lỗi xảy ra";

    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert message="Error" description={errorMessage} type="error" />
      </div>
    );
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image_product",
      key: "image_product",
      render: (text: string) => (
        <img
          src={text}
          alt="Product"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name_product",
      key: "name_product",
      render: (text: string) => (
        <span className="line-clamp-2 max-w-[200px]">{text}</span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price_product",
      key: "price_product",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => formatDate(text),
    },
    {
      key: "action",
      render: (_: any, product: any) => {
        return (
          <>
            <div className="flex space-x-3">
              {contextHolder}
              <Popconfirm
                title="Xóa sản phẩm"
                description="Bạn có muốn xóa ko?"
                onConfirm={() => mutate(product._id!)}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <CheckAuths roles={["admin"]}>
      <div style={{ padding: 20 }}>
        <div className="flex items-center justify-between mt-10 mb-10">
          <h1 className="text-2xl font-semibold">
            Sản phẩm trong danh mục: {categoryName}
          </h1>
          <Button type="primary">
            <Link to={"/admin/category"}>
              <BackwardFilled />
              Quay lại
            </Link>
          </Button>
        </div>
        {products && products.length > 0 ? (
          <Table
            dataSource={products}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
          />
        ) : (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </CheckAuths>
  );
};

export default CategoryDetail;
