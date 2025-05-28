import { Button, message, Spin } from "antd";
import axios from "axios";
import JoditEditor from "jodit-react";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckAuths,
  getToken
} from "../../../common/hooks/Auth/useAuthorization";
import { LoadingOutlined } from "@ant-design/icons";

const BlogEdit = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialContentState, setInitialContentState] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    // Fetch blog content by ID and set it to state
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:2004/api/v1/blogs/${id}`
        );
        setContent(data.content);
        setInitialContentState(data.content); // Set initial content state
      } catch (error) {
        console.error("Failed to fetch blog content:", error);
        message.error("Không thể tải nội dung bài viết");
      }
    };
    fetchBlog();
  }, [id]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
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
        return { originalSrc: src, newSrc: response.data.secure_url };
      });

      const h1Element = doc.querySelector("h1");
      if (h1Element === null || h1Element.textContent === "") {
        message.error("Tiêu đề không được để trống");
        setIsLoading(false);
        return;
      }

      const uploadedUrls = await Promise.all(uploadPromises);
      let contentNew = content;
      uploadedUrls.forEach((img) => {
        contentNew = contentNew.replace(img.originalSrc, img.newSrc);
      });

      await axios.put(
        `http://localhost:2004/api/v1/update_blog/${id}`,
        {
          content: contentNew,
          author: user.user.userName
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      message.success("Cập nhật blog thành công");
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      message.error("Có lỗi xảy ra khi cập nhật bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      toolbarAdaptive: false,
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_only_text",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "ul",
        "ol",
        "outdent",
        "indent",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "image",
        "link",
        "align",
        "undo",
        "redo"
      ],
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
          className="!text-black mt-20"
          ref={editor}
          value={content}
          config={config}
          onChange={(newContent) => {
            setContent(newContent);
          }}
        />
        <div>
          <Button
            type="primary"
            onClick={onSubmit}
            disabled={content === initialContentState}
          >
            Cập nhật bài viết
          </Button>
        </div>
      </LoadingOverlay>
    </CheckAuths>
  );
};

export default BlogEdit;
