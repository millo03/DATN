/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Image,
  Input,
  Spin,
  Upload,
} from "antd";
import dayjs from "dayjs";
import ProfileHook from "../../../common/hooks/Settings/ProfileHook";
export type FieldType = {
  userName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  vehicle?: string;
};

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.user?.role;
  const {
    contextHolder,
    isChanged,
    isSaving,
    isLoading,
    isError,
    error,
    handleValuesChange,
    mutate,
    data,
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
    setPreviewImage,
  } = ProfileHook();

  const validateBirthDate = (_: any, value: any) => {
    if (!value) {
      return Promise.resolve(); // Không cần kiểm tra nếu người dùng không nhập ngày
    }

    const today = dayjs(); // Ngày hiện tại
    const birthDate = value; // Đối tượng Dayjs
    const age = today.diff(birthDate, "year"); // Tính tuổi
    if (age < 5) {
      return Promise.reject(new Error("Tuổi phải lớn hơn 5"));
    }

    if (age > 100) {
      return Promise.reject(new Error("Tuổi phải nhỏ hơn 100."));
    }

    return Promise.resolve();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values);

    const imageUrls = fileList
      .filter((file) => file.status === "done")
      .map((file) => file.response?.secure_url);
    let avatarUrl = imageUrls[imageUrls.length - 1] || "";

    if (!avatarUrl && data?.avatar) {
      avatarUrl = data.avatar;
    }

    mutate({ ...values, avatar: avatarUrl });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  if (isError) return <div>{error.message}</div>;

  return (
    <>
      {contextHolder}

      <div>
        <div className="border-b-2 mt-[18px]">
          <h2 className="text-xl">Hồ Sơ Của Tôi</h2>
          <p className="py-2 text-sm">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </div>
        <div className="py-8">
          <Form
            name="basic"
            onValuesChange={handleValuesChange}
            initialValues={
              data
                ? {
                    ...data,
                    birthDate: data.birthDate ? dayjs(data.birthDate) : null,
                  }
                : {}
            }
            onFinish={onFinish}
            autoComplete="off"
          >
            <div className="flex flex-row flex-wrap text-sm lg:flex-nowrap">
              <div className="order-2 basis-full lg:order-1 lg:basis-2/3">
                <Form.Item
                  name="userName"
                  label="Tên đăng nhập"
                  rules={[
                    {
                      required: true,
                      message: "Tên đăng nhập là bắt buộc!",
                    },
                  ]}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Họ và tên là bắt buộc!",
                    },
                    {
                      min: 3,
                      message: "Họ và tên phải lớn hơn 3 ký tự!",
                    },
                  ]}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                >
                  <Input placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  rules={[
                    {
                      required: true,
                      message: "Email là bắt buộc!",
                    },
                    { type: "email", message: "Không đúng định dạng Email" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Số điện thoại"
                  name="phone"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  rules={[
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>

                {role === "courier" && (
                  <Form.Item<FieldType>
                    label="Phương tiện"
                    name="vehicle"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                  >
                    <Input placeholder="Nhập phương tiện vận chuyển của bạn" />
                  </Form.Item>
                )}

                <Form.Item<FieldType>
                  label="Ngày sinh"
                  name="birthDate"
                  rules={[{ validator: validateBirthDate }]}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={data?.birthDate ? dayjs(data.birthDate) : null}
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                  <Button
                    className="bg-[#000000] text-[#ffffff] h-[50px]"
                    htmlType="submit"
                    disabled={!isChanged || isSaving}
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </Form.Item>
              </div>
              <div className="order-1 p-3 my-4 border-b basis-full lg:order-2 lg:border-b-0 lg:border-l-2 lg:basis-1/3">
                <Form.Item<FieldType>
                  name="avatar"
                  className="flex items-center justify-center w-full"
                >
                  <div className="flex flex-col items-center mb-4">
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center w-full bg-white bg-opacity-75 rounded-full h-44">
                        <Spin />
                      </div>
                    )}
                    <img
                      src={previewImage || data.avatar || ""}
                      className="rounded-full w-44 h-44"
                      alt="Avatar"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-black text-white w-[100px] h-[40px]"
                      type="button"
                      onClick={() =>
                        document.getElementById("hiddenUploadInput")?.click()
                      }
                    >
                      Chọn ảnh
                    </button>
                    <div style={{ display: "none" }}>
                      <Upload
                        id="hiddenUploadInput"
                        action={api}
                        data={{
                          upload_preset: PRESET_NAME,
                          folder: FOLDER_NAME,
                        }}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        showUploadList={false}
                        style={{ display: "none" }}
                        // multiple
                      >
                        <button
                          className="bg-black text-white w-[100px] h-[40px]"
                          type="button"
                        >
                          Chọn ảnh
                        </button>
                      </Upload>
                    </div>
                  </div>
                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: "none" }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Profile;
