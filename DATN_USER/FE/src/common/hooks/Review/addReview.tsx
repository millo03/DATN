import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetProp, message, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import instance from "../../../configs/axios";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const addReviewHook = () => {
  const queryClient = useQueryClient();
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const [openReviewOrderId, setOpenReviewOrderId] = useState<string | null>(
    null
  );
  const [openReview, setOpenReview] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [reviewedOrders, setReviewedOrders] = useState<{
    [orderId: string]: Set<string>;
  }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [initialContent, setInitialContent] = useState("");

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </button>
  );

  const CLOUD_NAME = "dwya9mxip";
  const PRESET_NAME = "upImgProduct";
  const FOLDER_NAME = "PRODUCTS";
  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const { data: dataReviewById } = useQuery({
    queryKey: ["Review_Key", currentReviewId],
    queryFn: async () => {
      if (currentReviewId) {
        const { data } = await instance.get(`/reviews/${currentReviewId}`);
        return data;
      }
      return null;
    },
    enabled: !!currentReviewId,
  });

  const { mutate: addReview } = useMutation(
    async (reviewData: {
      contentReview: string;
      productId: string;
      orderId: string;
      rating_review: number;
      image_review: string[];
    }) => {
      const { data } = await instance.post(`/review/${userId}`, reviewData);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["Order_Key"]);
        message.success("Gửi đánh giá thành công");
        setReviewedOrders((prev) => ({
          ...prev,
          [openReviewOrderId!]: new Set([
            ...Array.from(prev[openReviewOrderId!] || []),
            currentProductId!,
          ]),
        }));
      },
      onError: () => {
        message.error("Gửi đánh giá thất bại");
      },
    }
  );

  useEffect(() => {
    if (dataReviewById) {
      setInitialContent(dataReviewById.review?.contentReview || "");
    }
  }, [dataReviewById]);

  const handleOpenReview = (
    orderId: string,
    productId: string,
    reviewId: string | null
  ) => {
    if (openReviewOrderId === orderId && openReview) {
      setOpenReview(false);
    } else {
      setOpenReview(true);
      setOpenReviewOrderId(orderId);
      setCurrentProductId(productId);
      setCurrentReviewId(reviewId);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return {
    handlePreview,
    dataReviewById,
    addReview,
    handleOpenReview,
    CLOUD_NAME,
    PRESET_NAME,
    FOLDER_NAME,
    api,
    initialContent,
    rating,
    setRating,
    uploadButton,
    fileList,
    previewImage,
    previewOpen,
    reviewedOrders,
  };
};

export default addReviewHook;
