import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Typography, message, Card } from "antd";
import axios from "axios";

const { Title } = Typography;

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [isChanged, setIsChanged] = useState(false);
  const onValuesChange = (changedValues: any) => {
    // Nếu có sự thay đổi nào trong form
    setIsChanged(true);
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const onSubmit = async (data: ChangePasswordForm) => {
    const token = localStorage.getItem("token");

    if (data.newPassword !== data.confirmPassword) {
      message.error("Mật khẩu mới và mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2024/api/v1/change-password",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Đổi mật khẩu thành công");
        reset();
      } else {
        message.error(response.data.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error((error as any).response?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <div className="mt-[80px]">
      <Card
        title={
          <Title className="mt-[8px]" level={3}>
            Đổi mật khẩu
          </Title>
        }
        className="max-w-[600px] h-[500px] mx-auto "
      >
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          onChange={onValuesChange}
        >
          <Form.Item
            label="Mật khẩu cũ"
            validateStatus={errors.oldPassword ? "error" : undefined}
            help={errors.oldPassword ? "Mật khẩu cũ là bắt buộc" : undefined}
          >
            <Controller
              name="oldPassword"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Nhập mật khẩu cũ"
                  className="h-[50px]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            validateStatus={errors.newPassword ? "error" : undefined}
            help={errors.newPassword ? "Mật khẩu mới là bắt buộc" : undefined}
          >
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Nhập mật khẩu mới"
                  className="h-[50px]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            validateStatus={errors.confirmPassword ? "error" : undefined}
            help={
              errors.confirmPassword ? "Cần xác nhận mật khẩu mới" : undefined
            }
          >
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Xác nhận mật khẩu mới"
                  className="h-[50px]"
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "50px" }}
              disabled={!isChanged}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
