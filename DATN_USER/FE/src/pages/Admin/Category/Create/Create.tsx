import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useCategoryMutation from "../../../../common/hooks/Category/useCategoryMutation";
import { ICategory } from "../../../../common/interfaces/Category";
import Message from "../../../../components/base/Message/Message";
import { Input } from "../../../../components/ui/Input";
import { UploadImage } from "../../../../systems/utils/uploadImage";
import { message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Loading from "../../../../components/base/Loading/Loading";
const CreateComponent = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ICategory>();
  const { onSubmit, isLoading } = useCategoryMutation({
    action: "CREATE",
    onSuccess: () => {
      setShowMessage(true); // Hiển thị Message sau khi thêm thành công
    },
  });

  const handleSubmitForm = async (data: ICategory | any) => {
    try {
      if (data.image_category && data.image_category[0]) {
        const imageFile = data.image_category[0];
        const imageUrl = await UploadImage(imageFile);

        const formData = {
          ...data,
          image_category: imageUrl,
        };

        await onSubmit(formData);
      }
    } catch (error: any) {
      message.error(error.message || "Đã xảy ra lỗi không xác định!");
    }
  };

  const imageCategory = watch("image_category");

  useEffect(() => {
    if (imageCategory && imageCategory[0]) {
      const file = imageCategory[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [imageCategory]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000); // Đóng thông báo sau 2 giây
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900 text-center">
                Thêm danh mục
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 justify-center">
                <div className="sm:col-span-6 flex justify-center">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-[16px] font-medium leading-6 text-gray-900"
                    >
                      Tên danh mục
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">
                        <Input
                          type="text"
                          placeholder="Nhập tên danh mục..."
                          {...register("name_category", { required: true })}
                        />
                      </div>
                      {errors.name_category && (
                        <p className="text-red-600">
                          Tên danh mục bắt buộc nhập!
                        </p>
                      )}
                    </div>
                    <label
                      htmlFor="image_category"
                      className="block text-[16px] font-medium leading-6 text-gray-900 mt-4"
                    >
                      Hình ảnh danh mục
                    </label>
                    <div className="mt-2 flex items-center">
                      <div className="relative flex items-center">
                        <div
                          className={`flex items-center justify-center w-32 h-32 border border-gray-300 rounded-lg bg-gray-100 mr-2`}
                        >
                          <span className="text-3xl text-gray-500">+</span>
                        </div>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Image Preview"
                            className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                          />
                        )}
                        <Input
                          type="file"
                          {...register("image_category", { required: true })}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-y-4">
            {showMessage && (
              <Message
                message="Thêm danh mục thành công!"
                type="success"
                timeout={2000} // Tự động tắt sau 2 giây
                openMessage={showMessage}
              />
            )}
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="submit"
            >
              {isLoading ? "Đang thêm" : "Xác nhận"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateComponent;
