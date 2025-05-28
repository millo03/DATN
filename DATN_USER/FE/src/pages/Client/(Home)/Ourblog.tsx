/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import { Link } from "react-router-dom";
import ScrollTop from "../../../common/hooks/Customers/ScrollTop";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Ourblog = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["BLOGS"],
    queryFn: async () => {
      const { data } = await instance.get("/blogs");
      return data;
    },
  });

  const filterPublishedBlogs = (blogs: any) => {
    return blogs.filter((blog: any) => blog.published);
  };

  // Lọc bài viết đã xuất bản
  const publishedBlogs = filterPublishedBlogs(data || []);

  // Chọn 3 bài viết nổi bật
  const featuredBlogs = publishedBlogs
  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>;
  }
  return (
    <div className="max-w-[1440px] w-[95vw] mx-auto">
      <div className="lg:mt-[40px] mt-[60px]">
        <div className="container mx-auto pt-[20px] text-center">
          <h1 className="text-[32px] capitalize font-medium ">Tin tức mới nhất</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <>
            <div className="container  mx-auto grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 pt-[20px]">
              {featuredBlogs.map((blog: any) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(blog.content, "text/html");
                const title = doc.querySelector("h1");
                const image = doc.querySelector("img");
                const content = doc.querySelector("p");

                return (
                  <div
                    key={blog._id}
                    className="relative pb-6 overflow-hidden transition-shadow duration-300 rounded-lg shadow-lg hover:shadow-xl"
                  >
                    <Link onClick={ScrollTop} to={`/blogs/${blog.slug}`}>
                      <div className="wrapper-image max-w-full max-h-[250px] overflow-hidden object-cover ">
                        <img
                          src={image?.src}
                          alt={title?.textContent || "Blog image"}
                          className="object-cover w-full h-full transition-transform duration-300 image_blog hover:scale-105"
                        />
                      </div>
                      {/* <div className="view_blog bg-[#1C1C1C] py-[15px] text-center">
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-white text-[20px] font-semibold"
                  >
                    View full details
                  </Link>
                </div> */}
                      <div className="py-4 px-7">
                        <h2 className=" text-[20px] font-semibold text-gray-900 transition-colors duration-300 hover:text-blue-600 line-clamp-2">
                          {title?.textContent}
                        </h2>
                        <div className="flex text-[#7D7D7D] space-x-4 my-2 ">
                          <p className="line-clamp-3">{content?.textContent}</p>
                        </div>
                        <div className="flex text-[#7D7D7D] text-[14px] space-x-4  absolute bottom-4">
                          <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <Link
              to={`/blogs`}
              onClick={ScrollTop}
              className="my-12 flex items-center justify-center mx-auto py-2 w-[130px] rounded hover:bg-gray-100 duration-200 hover:text-black border border-black  bg-black cursor-pointer text-white"
            >
              <span className="text-[15px]">Xem tất cả</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Ourblog;
