import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, FormProps, Input, message, Spin } from "antd";
import { Link } from "react-router-dom";
import useSignUp from "../../../common/hooks/Auth/useSignUp";

type FieldType = {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isLoading, status_api } = useSignUp();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    try {
      mutate(values);
    } catch (error) {
      messageApi.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="container flex flex-col mx-auto mt-5 bg-white rounded-lg">
        <div className="flex justify-center w-full h-full my-auto lg:justify-normal draggable">
          <div className="flex items-center justify-center w-full ">
            <div className="flex items-center xl:p-7">
              <div className="flex flex-col w-full h-full p-6 text-center bg-white border shadow-lg rounded-3xl">
                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
                  Đăng ký
                </h3>
                <p className="mb-4 text-gray-600">Nhập thông tin của bạn</p>
                <div className="flex items-center mb-3">
                  <hr className="flex-grow border-gray-300" />
                </div>
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  autoComplete="off"
                  form={form}
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item<FieldType>
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Tên đăng nhập không được để trống!"
                      },
                      { min: 3, message: "UserName phải có ít nhất 3 ký tự" },
                      {
                        max: 30,
                        message: "UserName không được vượt quá 30 ký tự"
                      }
                    ]}
                    className="w-full"
                  >
                    <Input className="h-[50px]" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Email không được để trống!" },
                      { type: "email", message: "Email không đúng định dạng" },
                      () => ({
                        validator(_, value) {
                          if (!value || /^[^\u00C0-\u1EF9]+$/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Email không được chứa ký tự có dấu!")
                          );
                        }
                      })
                    ]}
                    className="w-[400px]"
                  >
                    <Input className="h-[50px]" />
                  </Form.Item>
                  {status_api && (
                    <span className="text-red-500">Email đã tồn tại!</span>
                  )}

                  <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu không được để trống!!"
                      },
                      { min: 6, message: "Mật khẩuphải có ít nhất 6 ký tự" },
                      () => ({
                        validator(_, value) {
                          if (!value || !/\s/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu không được chứa dấu cách!")
                          );
                        }
                      })
                    ]}
                    className="w-[400px]"
                  >
                    <Input.Password className="h-[50px]" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Bạn phải xác nhận lại mật khẩu"
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Mật khẩu xác nhận không khớp!")
                          );
                        }
                      })
                    ]}
                  >
                    <Input.Password className="h-[50px]" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      className="w-[100px] h-[50px]"
                    >
                      Đăng ký
                    </Button>
                  </Form.Item>

                  <p className="text-sm text-gray-600">
                    Bạn đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-10" />
      </div>
    </>
  );
};

export default Register;
