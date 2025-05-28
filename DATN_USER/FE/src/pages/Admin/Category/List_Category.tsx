import {
  Button,
  Checkbox,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
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
  useSearchCategoryByName,
} from "../../../common/hooks/Category/useCategoryQuery";
import { ICategory } from "../../../common/interfaces/Category";
import Loading from "../../../components/base/Loading/Loading";
import instance from "../../../configs/axios";
import UpdateComponent from "./Create";
import CategoryUpdate from "./update";
import { LoadingOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List_Category: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useCategoryQuery();
  const [searchName, setSearchName] = useState("");
  const { data: searchData } = useSearchCategoryByName(searchName);
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const dataSource = Array.isArray(searchName && searchData ? searchData : data)
    ? (searchName && searchData ? searchData : data).map(
        (category: ICategory) => ({
          key: category._id,
          ...category,
        })
      )
    : [];

  const onHandleSearch = () => {
    setSearchName(searchName);
    toast.info(`Đang tìm kiếm danh mục với tên: ${searchName}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
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
      // Lấy tổng số mục sau khi xóa
      const remainingItems = dataSource.length - 1;
      const totalPages = Math.ceil(remainingItems / pageSize);

      // Nếu không còn mục nào trên trang hiện tại và không phải trang đầu tiên, chuyển về trang trước đó
      if (remainingItems <= (currentPage - 1) * pageSize && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }

      // Hiển thị thông báo
      toast.success("Xóa danh mục thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // Làm mới dữ liệu
      refetch();
      queryClient.invalidateQueries({ queryKey: ["CATEGORY_KEY"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa danh mục không thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
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
      toast.success("Cập nhật danh mục thành công", {
        position: "top-right",
        autoClose: 300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey: ["CATEGORY_KEY"] });
    },
    onError: (error: unknown) => {
      toast.error(
        `Cập nhật danh mục không thành công. ${
          (error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`,
        {
          position: "top-right",
          autoClose: 300,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        }
      );
    },
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
      key: "image_category",
      title: "Ảnh Danh Mục",
      render: (_: any, record: ICategory) => (
        <img
          src={record.image_category}
          alt={record.name_category}
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
      ),
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
    },
    {
      key: "product_count",
      title: "Số Lượng Sản Phẩm",
      dataIndex: "product_count",
      render: (text: string, record: ICategory) => (
        <a
          onClick={() => handleViewProducts(record)}
          style={{
            fontSize: "16px",
            fontWeight: "inherit",
            textAlign: "center",
            display: "inline-block",
            width: "100%",
          }}
        >
          {text}
        </a>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      render: (_: any, product: ICategory) => formatDate(product.createdAt),
    },
    {
      key: "updatedAt",
      title: "Ngày Sửa",
      dataIndex: "updatedAt",
      render: (_: any, product: ICategory) => formatDate(product.updatedAt),
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
      ),
    },
    {
      key: "action",
      title: "Thao Tác",
      render: (_: any, category: ICategory) => {
        const isUncategorized = category.name_category === "Uncategorized";

        return (
          <Space>
            {/* Nút Cập nhật */}
            <CategoryUpdate
              data={data}
              id={category._id}
              disabled={isUncategorized} // Disable nếu là "Uncategorized"
            />

            {/* Nút Xóa */}
            <Popconfirm
              title={`Danh mục đang có ${category.product_count} sản phẩm. Bạn có muốn xóa không?`}
              onConfirm={() => {
                deleteCategory(category._id);
              }}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                disabled={isUncategorized} // Disable nếu là "Uncategorized"
              >
                <FaDeleteLeft />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
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
    showQuickJumper: false, // Đặt false để ẩn "Go to Page"
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
    showTotal: (total: number) => `Tổng ${total} mục`,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
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
            {/* <ToastContainer /> */}
          </div>
        )}
      </>
    </CheckAuths>
  );
};

export default List_Category;
