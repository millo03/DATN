/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import useSignIn from "../../../common/hooks/Auth/useSignIn";
import type { FormProps } from "antd";
import { Button, Form, Input, Spin } from "antd";
import { signInSchema } from "../../../common/validations/auth/SignIn";
import { LoadingOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    onSubmit,
    formErrors,
    setFormErrors,
    validateForm,
    isLoading,
    isError,
    error,
    status_api,
  } = useSignIn();

  type FieldType = {
    email?: string;
    password?: string;
    token?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const email: string = values.email || "";
    const password: string = values.password || "";

    const { error } = signInSchema.validate(values, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {}
      );
      setFormErrors(errors);
      console.log(error);
    } else {
      setFormErrors({});
      onSubmit({ email, password });
    }
  };
  const handleGoogleLogin = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    try {
      const response = await axios.post(
        "http://localhost:2004/api/v1/auth/google",
        {
          token,
        }
      );

      const { token: jwtToken, user } = response.data;
      const user_data = {
        user,
      };
      console.log(user_data);
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(user_data));

      toast.success("Đăng nhập thành công!");

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại!");
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Lỗi khi đăng nhập Google. Vui lòng thử lại!");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  // if (isError && error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div>Error: {error.message}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="container flex flex-col mx-auto mt-5 bg-white rounded-lg">
      <div className="flex justify-center w-full h-full my-auto lg:justify-normal draggable">
        <div className="flex items-center justify-center w-full ">
          <div className="flex items-center xl:p-7">
            <div className="flex flex-col w-full h-full p-6 text-center bg-white border shadow-lg rounded-3xl">
              <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
                Đăng nhập
              </h3>
              <p className="mb-4 text-gray-600">
                Nhập email và mật khẩu của bạn
              </p>
              <div className="flex items-center mb-3">
                <hr className="flex-grow border-gray-300" />
              </div>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  validateStatus={formErrors.email ? "error" : ""}
                  help={formErrors.email}
                  className="w-[400px]"
                >
                  <Input
                    className="h-[50px]"
                    onChange={(e) => validateForm("email", e.target.value)}
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Mật khẩu"
                  name="password"
                  validateStatus={formErrors.password ? "error" : ""}
                  help={formErrors.password}
                >
                  <Input.Password
                    className="h-[50px]"
                    onChange={(e) => validateForm("password", e.target.value)}
                  />
                </Form.Item>
                {status_api && (
                  <span className="text-red-500">Sai thông tin tài khoản!</span>
                )}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-[100px] h-[50px]"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
                <p className="text-sm text-gray-600">
                  <span
                    onClick={handleForgotPassword}
                    className="font-bold text-blue-600 cursor-pointer hover:underline"
                  >
                    Quên mật khẩu?
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/login/register"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Đăng ký tài khoản
                  </Link>
                </p>
              </Form>
              <div className="flex items-center justify-center mt-6">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleLoginError}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-10" />
    </div>
  );
};

export default Login;
