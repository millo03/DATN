import { Button, message, Spin } from "antd";
import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { AiFillBackward } from "react-icons/ai";
import LoadingOverlay from "react-loading-overlay-ts";
import { Link, useNavigate } from "react-router-dom";
import slugify from "react-slugify";
import {
  CheckAuths,
  getToken
} from "../../../common/hooks/Auth/useAuthorization";
import { LoadingOutlined } from "@ant-design/icons";
const BlogAdd = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const parser = new DOMParser();
  const [isLoading, setIsLoading] = useState(false);
  const doc = parser.parseFromString(content, "text/html");
  const navigate = useNavigate();
  const token = getToken();

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const images = doc.querySelectorAll("img");
      const CLOUD_NAME = "dwya9mxip";
      const PRESET_NAME = "upImgProduct";
      const FOLDER_NAME = "PRODUCTS";
      const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const uploadPromises = Array.from(images).map(async (file: any) => {
        const src = file.src;
        const res = await fetch(src);
        const fileBlob = await res.blob();
        const formData = new FormData();
        formData.append("file", fileBlob);
        formData.append("upload_preset", PRESET_NAME);
        formData.append("folder", FOLDER_NAME);

        const response = await axios.post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        // console.log(response.data.secure_url);
        return { originalSrc: src, newSrc: response.data.secure_url };
      });

      try {
        const h1Element = doc.querySelector("h1");
        if (h1Element === null || h1Element.textContent === "") {
          message.error("Tiêu đề không được để trống");
          return;
        }
        const uploadedUrls = await Promise.all(uploadPromises);
        let contentNew = content;
        uploadedUrls.forEach((img) => {
          contentNew = contentNew.replace(img.originalSrc, img.newSrc);
        });
        const { data } = await axios.post(
          `http://localhost:2004/api/v1/blogs/add_blog`,
          {
            content: contentNew,
            slug: slugify(h1Element.textContent),
            author: user.user.userName
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
        message.success("Tạo mới bài viết thành công");
        navigate("/admin/blogs");
        console.log(data);
      } catch (error) {
        console.error("Error uploading images:", error);
        throw new Error("Failed to upload images");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Viết Blog ...",
      uploader: {
        insertImageAsBase64URI: true
      }
    }),
    []
  );
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>;
  }
  return (
    <CheckAuths roles={["admin"]}>
      <>
        <div className="mx-6 ">
          <div className="flex items-center justify-between mt-20 mb-5">
            <h1 className="text-[26px] font-semibold">Thêm Mới Bài Viết</h1>
            <Link to="/admin/blogs">
              <Button type="primary">
                <AiFillBackward /> Quay lại
              </Button>
            </Link>
          </div>
          <LoadingOverlay
            active={isLoading}
            spinner
            text="Loading"
            styles={{
              overlay: (base) => ({
                ...base,
                position: "fixed",
                width: "100vw",
                height: "100vh",
                zIndex: 1000
              })
            }}
          >
            <JoditEditor
              className="!text-black"
              ref={editor}
              value={content}
              config={config}
              // tabIndex={1} // tabIndex of textarea
              // onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => {
                setContent(newContent);
              }}
            />
            <div>
              <Button
                type="primary"
                className="mt-5"
                onClick={() => {
                  onSubmit();
                }}
              >
                Tạo mới bài viết
              </Button>
            </div>
          </LoadingOverlay>
        </div>
      </>
    </CheckAuths>
  );
};
export default BlogAdd;
