import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import instance from "../../../configs/axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Blogs = () => {
  const { data, isLoading
  } = useQuery({
    queryKey: ["BLOGS"],
    queryFn: async () => {
      const { data } = await instance.get("/blogs");
      return data;
    }
  });

  // Hàm lọc bài viết đã xuất bản
  const filterPublishedBlogs = (blogs: any) => {
    return blogs.filter((blog: any) => blog.published);
  };

  const publishedBlogs = filterPublishedBlogs(data || []);
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>;
  }
  return (
    <div className="max-w-[1440px] w-[95vw] mx-auto">
      <div className="lg:mt-[40px] my-[40px]">
        <div className="text-sm py-6 bg-[#F3F3F3] font-medium px-[2.5%] rounded">
          <Link to={`/`} className="text-gray-500 hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-1 text-gray-500">&#10148;</span>
          Bài viết
        </div>
        <div className="container mx-auto pt-[20px] text-center">
          <h1 className="text-[30px] font-bold">Tin tức nổi bật</h1>
        </div>
        <div className="container mx-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 pt-[20px]">
          {publishedBlogs.map((blog: any) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(blog.content, "text/html");
            const title = doc.querySelector("h1");
            const image = doc.querySelector("img");
            const content = doc.querySelector("p");
            return (
              <div
                key={blog._id}
                className="overflow-hidden transition-shadow duration-300 border rounded-2xl shadow-lg hover:shadow-2xl"
              >
                <div className="wrapper-image max-w-full max-h-[250px] overflow-hidden object-cover">
                  <img
                    src={image?.src}
                    className="object-cover w-full h-full transition-transform duration-300 image_blog hover:scale-105"
                  />
                </div>
                <div className="px-4 py-4">
                  <h2 className="py-[10px] text-[20px] font-semibold line-clamp-2">
                    <Link
                      onClick={ScrollTop}
                      to={`/blogs/${blog.slug}`}
                      className="text-gray-900 transition-colors duration-300 hover:text-blue-600"
                    >
                      {title?.innerText}
                    </Link>
                  </h2>
                  <div className="flex text-[#7D7D7D] text-sm space-x-4 mb-2">
                    <p className="text-ellipsis overflow-hidden whitespace-nowrap">{new Date(blog.createdAt).toLocaleDateString()}</p>
                    <p className="text-ellipsis overflow-hidden whitespace-nowrap">{blog.author}</p>
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-4">
                    {String(content?.innerHTML).substring(0, 100)}...
                  </p>
                  <div className="mt-4 text-center">
                    <Link
                      onClick={ScrollTop}
                      to={`/blogs/${blog.slug}`}
                      className="font-semibold text-blue-500 hover:text-blue-700"
                    >
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blogs;