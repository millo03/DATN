import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import useSignIn from "../../../common/hooks/Auth/useSignIn";
import { Button, Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Criteria from "./Criteria";
import Procedure from "./Procedure";
import { signInSchema } from "../../../common/validations/auth/SignIn";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginRef = useRef<HTMLDivElement | null>(null);
  const criteriaRef = useRef<HTMLDivElement | null>(null);
  const procedureRef = useRef<HTMLDivElement | null>(null);

  const {
    onSubmit,
    formErrors,
    setFormErrors,
    validateForm,
    isPending,
    status_api,
  } = useSignIn();

  useEffect(() => {
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (location.hash) {
      const section = location.hash.slice(1);
      const ref =
        section === "login"
          ? loginRef
          : section === "criteria"
            ? criteriaRef
            : procedureRef;

      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const onFinish = (values: { email?: string; password?: string }) => {
    const email = values.email || "";
    const password = values.password || "";

    const { error } = signInSchema.validate(values, { abortEarly: false });
    if (error) {
      const errors = error.details.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {}
      );
      setFormErrors(errors);
    } else {
      setFormErrors({});
      onSubmit({ email, password });
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div>
      <div
        id="login-section"
        ref={loginRef}
        className="flex items-center justify-center w-full h-screen bg-gray-100"
      >
        <div className="flex flex-col w-[400px] h-[400px] p-6 text-center bg-white border shadow-lg rounded-3xl">
          <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
            Đăng nhập
          </h3>
          <Form
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              label="Email"
              name="email"
              validateStatus={formErrors.email ? "error" : ""}
              help={formErrors.email}
            >
              <Input
                className="h-[50px]"
                onChange={(e) => validateForm("email", e.target.value)}
              />
            </Form.Item>
            <Form.Item
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
              <span className="text-red-500">
                Sai thông tin tài khoản!
              </span>
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
          </Form>
          <p className="text-sm text-gray-600">
            <span
              onClick={handleForgotPassword}
              className="font-bold text-blue-600 cursor-pointer hover:underline"
            >
              Quên mật khẩu?
            </span>
          </p>
        </div>
      </div>

      <div id="criteria-section" ref={criteriaRef}>
        <Criteria />
      </div>

      <div id="procedure-section" ref={procedureRef}>
        <Procedure />
      </div>
    </div>
  );
};

export default Login;
