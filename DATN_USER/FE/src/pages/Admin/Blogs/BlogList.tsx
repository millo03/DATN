import React, { useState } from "react";
import { Blog } from "../../../common/interfaces/Blog";
import instance from "../../../configs/axios";
import {
  Button,
  Table,
  Popconfirm,
  message,
  Switch,
  Input,
  Checkbox,
  Space,
  Spin,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { useSearchBlogByName } from "../../../common/hooks/Blog/querry_blog";
import { AiOutlinePlus } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import { LoadingOutlined } from "@ant-design/icons";

const BlogList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchName, setSearchName] = useState("");
  const { data: searchData } = useSearchBlogByName(searchName);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await instance.get("/blogs");
      return response.data;
    },
  });
  const dataSource = (searchName ? searchData : data)?.map((blog: any) => ({
    key: blog._id,
    ...blog,
  }));
  const onHandleSearch = () => {
    setSearchName(searchName.trim());
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await instance.delete(`/blogs/${id}`);
      if (response.status === 200) {
        messageApi.success("Xóa thành công");
        refetch();
      } else {
        throw new Error("Xóa blog không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa blog:", error);
      messageApi.error(
        `Xóa blog không thành công. ${(error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    }
  };
  const mutation = useMutation({
    mutationFn: async (updatedBlog: Blog) => {
      const response = await instance.put(
        `/update_blog/${updatedBlog._id}`,
        updatedBlog
      );
      return response.data;
    },
    onSuccess: () => {
      messageApi.success("Cập nhật blog thành công");
      refetch();
    },
    onError: (error: unknown) => {
      console.error("Lỗi khi cập nhật blog:", error);
      messageApi.error(
        `Cập nhật blog không thành công. ${(error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    },
  });
  const handleTogglePublished = async (blog: Blog) => {
    try {
      const updatedBlog = { ...blog, published: !blog.published };
      const response = await instance.put(
        `/update_blog/${blog._id}`,
        updatedBlog
      );
      if (response.status === 200) {
        messageApi.success("Cập nhật trạng thái hiển thị thành công");
        refetch();
      } else {
        throw new Error("Cập nhật trạng thái hiển thị không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị:", error);
      messageApi.error(
        `Cập nhật trạng thái hiển thị không thành công. ${(error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    }
  };

  const renderContentSnippet = (content: string) => {
    const shortContent =
      content.length > 100 ? content.substring(0, 100) + "..." : content;
    return parse(shortContent);
  };

  const extractFirstImage = (content: string) => {
    // Tạo một DOM ảo để phân tích HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    // Tìm thẻ <img> đầu tiên
    const imgElement = doc.querySelector("img");
    return imgElement ? imgElement.src : null;
  };
  const extractH1Content = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const h1Element = doc.querySelector("h1");
    return h1Element ? h1Element.textContent : "Không có tiêu đề";
  };
  const columns = [
    {
      key: "checkbox",
      title: <Checkbox />,
      render: (_: any, cate: ICategory) => <Checkbox />,
    },
    {
      key: "imageUrl",
      title: "Ảnh Bài Viết",
      dataIndex: "content",
      render: (content: string) => {
        const imageUrl = extractFirstImage(content);
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Blog"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          <span>Không có ảnh</span>
        );
      },
    },
    {
      key: "title",
      title: "Tiêu Đề Bài Viết",
      dataIndex: "content",
      render: (content: string) => {
        return <div>{extractH1Content(content)}</div>;
      },
    },
    // {
    //   key: "createdAt",
    //   title: "Thời gian",
    //   dataIndex: "createdAt",
    //   render: (text: string) => new Date(text).toLocaleDateString()
    // },
    {
      key: "author",
      title: "Tác Giả",
      dataIndex: "author",
    },
    {
      key: "content",
      title: "Nội dung",
      dataIndex: "content",
      render: (content: string) => {
        return <div>{renderContentSnippet(content)}</div>;
      },
    },

    {
      key: "published",
      title: "Hiển Thị",
      dataIndex: "published",
      render: (published: boolean, record: Blog) => (
        <Switch
          checked={published}
          onChange={() => handleTogglePublished(record)}
        />
      ),
    },
    {
      key: "actions",
      title: "Thao Tác",
      render: (_: any, blogs: Blog) => (
        <>
          {/* <Popconfirm
            title="Xóa Blog"
            description="Bạn có chắc chắn muốn xóa blog này không?"
            onConfirm={() => handleDelete(blogs._id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger type="primary">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`${blogs._id}`}>
            <Button type="primary">Chỉnh sửa</Button>
          </Link> */}
          <Space>
            <Button type="primary">
              <Link to={`${blogs._id}`}>
                <FaEdit />
              </Link>
            </Button>
            <Popconfirm
              title="Xóa bài viết"
              description="Bạn có muốn xóa bài viết này không ?"
              onConfirm={() => handleDelete(blogs._id!)}
              // onCancel={cancel}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>
                <FaDeleteLeft />
              </Button>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>;
  }
  if (isError) return <div className="">{(error as any).message}</div>;

  return (
    <CheckAuths roles={["admin"]}>
      <div className="container ">
        {contextHolder}
        <div className="mx-6">
          {" "}
          <div className="">
            <div className="flex items-center justify-between mt-20 mb-5">
              <h1 className="text-2xl font-semibold">Quản Lý Bài Viết</h1>{" "}
              <Link to="add_blog">
                <Button className="px-[6px] h-[38px] text-[14px] font-semibold border-[#1976D2] text-[#1976D2]">
                  <AiOutlinePlus className="ml-[3px]" /> THÊM MỚI BÀI VIẾT
                </Button>
              </Link>
            </div>

            <div className="flex justify-between mb-2">
              <div className="space-x-5">
                {/* <Checkbox className="ml-4" />
              <Button>Chọn tất cả (7)</Button>
              <Popconfirm
                title="Xóa sản phẩm khỏi giỏ hàng?"
                description="Bạn có chắc chắn muốn xóa không?"
                // onConfirm={handleRemoveMultiple}
                okText="Có"
                cancelText="Không"
              >
                <Button danger>
                  <DeleteOutlined style={{ fontSize: "24px" }} />
                  Xóa sản phẩm đã chọn
                </Button>
              </Popconfirm> */}
              </div>
              <div className="flex space-x-5">
                <Input
                  className="w-[500px]"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="nhâp tên sản phẩm để tìm kiếm..."
                />
                <Button onClick={onHandleSearch} type="primary">
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </div>
          {data && data.length === 0 ? (
            <p>Không có blog nào.</p>
          ) : (
            <Table dataSource={dataSource} rowKey="_id" columns={columns} />
          )}
        </div>
      </div>
    </CheckAuths>
  );
};

export default BlogList;
