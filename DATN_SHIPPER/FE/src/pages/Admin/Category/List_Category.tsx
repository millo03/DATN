import {
  Button,
  Checkbox,
  Input,
  message,
  Pagination,
  Popconfirm,
  Space,
  Switch,
  Table
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { FaDeleteLeft } from "react-icons/fa6";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import {
  useCategoryQuery,
  useSearchCategoryByName
} from "../../../common/hooks/Category/useCategoryQuery";
import { ICategory } from "../../../common/interfaces/Category";
import Loading from "../../../components/base/Loading/Loading";
import instance from "../../../configs/axios";
import UpdateComponent from "./Create";
import CategoryUpdate from "./update";

const List_Category: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useCategoryQuery();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const { data: searchData } = useSearchCategoryByName(searchName);

  const pageSize = 4;

  const dataSource = Array.isArray(searchName && searchData ? searchData : data)
    ? (searchName && searchData ? searchData : data).map(
        (category: ICategory) => ({
          key: category._id,
          ...category
        })
      )
    : [];

  const onHandleSearch = () => {
    setSearchName(searchName);
  };

  const { mutate: deleteCategory } = useMutation({
    mutationFn: async (id: ICategory["_id"]) => {
      try {
        await instance.delete(`/category/${id}`);
      } catch (error) {
        throw new Error("Xóa danh mục thất bại");
      }
    },
    onSuccess: () => {
      messageApi.success("Xóa danh mục thành công");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["CATEGORY_KEY"] });
    },
    onError: (error) => {
      messageApi.error(error.message || "Xóa danh mục không thành công");
    }
  });

  const mutation = useMutation({
    mutationFn: async (category: ICategory) => {
      const response = await instance.put(
        `/category/${category._id}`,
        category
      );
      return response.data;
    },
    onSuccess: () => {
      messageApi.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["CATEGORY_KEY"] });
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi cập nhật danh mục:", error);
      messageApi.error(
        `Cập nhật danh mục không thành công. ${
          (error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    }
  });

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy");
  };

  const handleTogglePublished = (category: ICategory) => {
    mutation.mutate({ ...category, published: !category.published });
  };

  const handleViewProducts = (category: ICategory) => {
    navigate(`/admin/category/products/${category._id}`);
  };

  const createFilters = (categories: ICategory[]) => {
    return categories
      .map((category: ICategory) => category.name_category)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      )
      .map((name: string) => ({ text: name, value: name }));
  };

  const columns: ColumnsType<ICategory> = [
    {
      key: "checkbox",
      title: <Checkbox />,
      render: (_: any, cate: ICategory) => <Checkbox />
    },
    {
      key: "image_category",
      title: "Ảnh Danh Mục",
      render: (_: any, record: ICategory) => (
        <img
          src={record.image_category}
          alt={record.name_category}
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
      )
    },
    {
      key: "name_category",
      title: "Tên Danh Mục",
      dataIndex: "name_category",
      filterSearch: true,
      filters: data ? createFilters(data) : [],
      onFilter: (value: string | any, record: ICategory) => {
        const filterValue = value as string;
        return record.name_category.includes(filterValue);
      },
      sorter: (a: ICategory, b: ICategory) =>
        a.name_category.localeCompare(b.name_category),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ICategory) => (
        <a
          onClick={() => handleViewProducts(record)}
          style={{ fontSize: "16px", fontWeight: "inherit" }}
        >
          {text}
        </a>
      )
    },
    {
      key: "createdAt",
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      render: (_: any, product: ICategory) => formatDate(product.createdAt)
    },
    {
      key: "updatedAt",
      title: "Ngày Sửa",
      dataIndex: "updatedAt",
      render: (_: any, product: ICategory) => formatDate(product.updatedAt)
    },
    {
      key: "published",
      title: "Hiển Thị",
      dataIndex: "published",
      render: (published: boolean, record: ICategory) => (
        <Switch
          checked={published}
          onChange={() => handleTogglePublished(record)}
        />
      )
    },
    {
      key: "action",
      title: "Thao Tác",
      render: (_: any, category: ICategory) => {
        return (
          <Space>
            {contextHolder}
            <CategoryUpdate data={data} id={category._id} />
            <Popconfirm
              title="Xoá danh mục sản phẩm"
              description="Bạn có muốn xóa danh mục sản phẩm này không ?"
              onConfirm={() => deleteCategory(category._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>
                <FaDeleteLeft />
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const paginationProps = {
    current: currentPage,
    pageSize,
    total: dataSource.length,
    showSizeChanger: false,
    pageSizeOptions: [],
    showQuickJumper: true,
    itemRender: (
      page: number,
      type: string,
      originalElement: React.ReactNode
    ) => {
      if (type === "page") {
        return <a>{page}</a>;
      }
      if (type === "prev") {
        return <a>Trước</a>;
      }
      if (type === "next") {
        return <a>Kế tiếp</a>;
      }
      return originalElement;
    },
    onChange: onChangePage,
    showTotal: (total: number) => `Tổng ${total} mục`
  };

  return (
    <CheckAuths roles={["admin"]}>
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="m-6">
            <div className="flex items-center justify-between mt-20 mb-5">
              <h1 className="text-2xl font-semibold">Quản Lý Danh Mục</h1>
              <UpdateComponent />
            </div>
            <div className="flex justify-between mb-2">
              <div className="flex space-x-5">
                <Input
                  className="w-[500px]"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Nhập tên danh mục để tìm kiếm..."
                />
                <Button onClick={onHandleSearch} type="primary">
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <Table
              dataSource={dataSource.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              columns={columns}
              pagination={false}
            />
            <div className="flex items-center justify-between mt-4">
              <Pagination {...paginationProps} />
            </div>
          </div>
        )}
      </>
    </CheckAuths>
  );
};

export default List_Category;
