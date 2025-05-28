import express from "express";
import {
  GetAllBlogs,
  getBlogsById,
  createBlog,
  updateBlogById,
  deleteBlogById,
  relactedBlog,
  getBlogsBySlug,
  GetBlogsByName,
} from "../controllers/Blog/blog.js";
const Routes_blog = express.Router();
Routes_blog.get("/blogs/:blogId", getBlogsById);
Routes_blog.get("/blogs/detail/:slug", getBlogsBySlug);
Routes_blog.post("/blogs/search", GetBlogsByName);

Routes_blog.get("/blogs", GetAllBlogs);
Routes_blog.post("/blogs/add_blog", createBlog);
Routes_blog.put("/update_blog/:blogId", updateBlogById);
Routes_blog.delete("/blogs/:blogId", deleteBlogById);
Routes_blog.get("/relacted", relactedBlog);
export default Routes_blog;
