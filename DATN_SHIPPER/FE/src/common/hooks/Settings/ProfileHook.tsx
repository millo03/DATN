import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { GetProp, UploadFile, UploadProps, message } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
export type FieldType = {
  userName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  vehicle?: string;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ProfileHook = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const userRole = user?.user?.role;
  const [initialValues, setInitialValues] = useState<FieldType>({});
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // Trạng thái lưu
  const CLOUD_NAME = "dwya9mxip";
  const PRESET_NAME = "upImgProduct";
  const FOLDER_NAME = "PRODUCTS";
  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["AUTH_KEY", userId],
    queryFn: async () => {
      const { data } = await instance.get(`/auth/${userId}`);
      if (data.birthDate) {
        data.birthDate = dayjs(data.birthDate).format("YYYY-MM-DD"); // Chuyển đổi ngày tháng thành định dạng YYYY-MM-DD
      }
      return data;
    }
  });

  const { mutate } = useMutation({
    mutationFn: async (newUser) => {
      setIsSaving(true); // Bắt đầu lưu
      if (userRole === "courier") {
        const { data } = await instance.put(`/shippers/${userId}`, newUser);
        return data;
      } else {
        const { data } = await instance.put(`/auth/${userId}`, newUser);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY"]
      });
      messageApi.open({
        type: "success",
        content: "Cập nhật thông tin thành công"
      });
      setIsSaving(false); // Kết thúc lưu
      setIsChanged(false); // Đặt lại trạng thái thay đổi
    },
    onError: () => {
      setIsSaving(false); // Kết thúc lưu nếu có lỗi
    }
  });

  const handleValuesChange = (changedValues: FieldType) => {
    setIsChanged(
      JSON.stringify(changedValues) !== JSON.stringify(initialValues)
    );
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file
  }) => {
    // const newFile = newFileList[0] || {};

    if (file.status === "done") {
      const url = file.response?.secure_url;
      if (url) {
        setPreviewImage(url);
      }
    } else if (file.status === "error") {
      message.error("Upload ảnh thất bại"); // Hiển thị toast khi upload thất bại
      console.error("Upload failed:", file.response?.error || file.error);
    }

    setFileList(newFileList);
    setIsChanged(newFileList.length > 0);
    const allUploaded = newFileList.every((file) => file.status === "done");
    setUploading(newFileList.some((file) => file.status === "uploading"));
    setIsChanged(allUploaded);
  };

  return {
    contextHolder,
    setIsChanged,
    setInitialValues,
    isChanged,
    isSaving,
    isLoading,
    isPending,
    isError,
    error,
    handleValuesChange,
    mutate,
    data,
    userId,
    PRESET_NAME,
    FOLDER_NAME,
    api,
    previewImage,
    fileList,
    previewOpen,
    uploading,
    handlePreview,
    handleChange,
    setPreviewOpen,
    setPreviewImage
  };
};

export default ProfileHook;
