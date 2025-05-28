import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import slugify from "react-slugify";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [toc, setToc] = useState<any[]>([]); // State for table of contents
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2004/api/v1/blogs/detail/${slug}`
        );
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data.content, "text/html");
        setTitle(doc.querySelector("h1")?.innerText ?? "Không có tiêu đề");
        const h1Tag = doc.querySelector("h1");
        if (h1Tag) {
          h1Tag.remove();
        }
        setBlog({
          content: doc.body.innerHTML,
          createdAt: response.data.createdAt,
          author: response.data.author,
          published: response.data.published,
        });
        // Generate TOC
        const tocItems = Array.from(doc.querySelectorAll("h1, h2, h3")).map(
          (heading: any) => ({
            id: heading.id || slugify(heading.innerText),
            text: heading.innerText,
            level: heading.tagName.toLowerCase(),
          })
        );
        setToc(tocItems);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setDeleted(true); // Nếu bài viết không tồn tại, đặt trạng thái xóa
        }
      }
    };

    const fetchRelatedBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2004/api/v1/relacted"
        );
        const filteredBlogs = response.data.filter((b: any) => b.slug !== slug);
        setRelatedBlogs(filteredBlogs);
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    fetchBlog();
    fetchRelatedBlogs();

    const intervalId = setInterval(async () => {
      try {
        await axios.get(`http://localhost:2004/api/v1/blogs/detail/${slug}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setDeleted(true); // Bài viết bị xóa
          clearInterval(intervalId); // Ngừng polling
        }
      }
    }, 2000); // Kiểm tra mỗi 5 giây

    return () => clearInterval(intervalId);
  }, [slug]);

  useEffect(() => {
    console.log("Updated Related Blogs State:", relatedBlogs);
  }, [relatedBlogs]);

  if (deleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">
          Bài viết này không hiển thị hoặc đã bị xoá bởi quản trị viên.
        </h1>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex justify-center items-center h-screen">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="container flex gap-8 px-4 py-10 mx-auto lg:px-20 justify-between">
      {/* Main content */}
      {blog.published === true ? (
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-bold text-black">{title}</h1>
          <p className="mb-6 text-sm text-gray-600">
            {new Date(blog.createdAt).toLocaleDateString()} - {blog.author}
          </p>
          <div className="mx-auto prose text-justify max-w-none">
            {parse(blog.content)}
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-black">
          Bài viết này không hiển thị
        </h1>
      )}
      {/* Sidebar */}
      <div className="flex flex-col w-1/3 gap-8">
        {/* Table of Contents */}
        <aside className="bg-[#f0f0f0] text-gray-900 p-4 rounded-md border border-gray-300 shadow-md h-fit sticky top-16">
          <h2 className="mb-4 text-xl font-semibold">Mục lục</h2>
          <ul>
            {toc.length > 0 ? (
              toc.map((item) => (
                <li
                  key={item.id}
                  className={`ml-${
                    item.level === "h2" ? 4 : item.level === "h3" ? 8 : 0
                  }`}
                >
                  <a
                    href={`#${item.id}`}
                    className="font-medium text-gray-700 transition-colors duration-200 hover:text-black hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))
            ) : (
              <li>Không có mục lục</li>
            )}
          </ul>
        </aside>

        {/* Related Blogs */}
        <aside className="sticky p-4 bg-gray-100 rounded-lg shadow-md top-16">
          <h2 className="mb-4 text-xl font-semibold">Tất cả bài viết</h2>
          <ul>
            {relatedBlogs.length > 0 ? (
              relatedBlogs.map((relatedBlog) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                  relatedBlog.content,
                  "text/html"
                );
                const titleElement = doc.querySelector("h1");
                const imageElement = doc.querySelector("img");

                const title = titleElement
                  ? titleElement.textContent
                  : "Không có tiêu đề";
                const image = imageElement ? imageElement.src : "";

                return (
                  <li key={relatedBlog.slug} className="flex items-center mb-2">
                    {image && (
                      <img
                        src={image}
                        alt={title ?? ""}
                        className="object-cover w-16 h-16 mr-4 rounded"
                      />
                    )}
                    <Link
                      to={`/blogs/${relatedBlog.slug}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {title}
                    </Link>
                  </li>
                );
              })
            ) : (
              <li>Không có bài viết liên quan</li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
