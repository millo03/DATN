/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Sửa lại thành jwtDecode từ jwt-decode
import { Result, Button, Spin } from "antd"; // Thêm các thành phần Ant Design
import { Link } from "react-router-dom"; // Thêm Link từ react-router-dom

export const getToken = (): string | null => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.token || null; // Ensure it returns null if token is undefined
};
export const useAuthorization = (requiredRoles: string | string[]) => {
  const [authStatus, setAuthStatus] = useState({
    isAuthorized: false,
    isLoggedIn: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthorization = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        setAuthStatus({
          isAuthorized: false,
          isLoggedIn: false,
          isLoading: false,
        });
        return;
      }

      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;

      if (!token) {
        setAuthStatus({
          isAuthorized: false,
          isLoggedIn: false,
          isLoading: false,
        });
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const isAuthorized = Array.isArray(requiredRoles)
          ? requiredRoles.includes(decoded?.role)
          : decoded.role === requiredRoles;

        setAuthStatus({
          isAuthorized,
          isLoggedIn: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Lỗi khi phân tích token:", error);
        localStorage.removeItem("user");
        setAuthStatus({
          isAuthorized: false,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    };

    checkAuthorization();
  }, [requiredRoles]);

  return authStatus;
};
export const CheckAuths = ({ roles, children }: any) => {
  const { isAuthorized, isLoggedIn, isLoading } = useAuthorization(roles);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Result
        status="warning"
        title="Bạn chưa đăng nhập"
        subTitle="Vui lòng đăng nhập để tiếp tục hành động"
        extra={
          <Button type="primary">
            <Link to="/">Đăng nhập</Link>
          </Button>
        }
      />
    );
  }

  if (!isAuthorized) {
    return (
      <Result
        className="mt-10"
        status="403"
        title="Xin lỗi, bạn không có quyền truy cập vào trang này"
        subTitle="Đăng nhập bằng tài khoản phù hợp để truy cập trang này"
        extra={[
          <Button key="home">
            <Link to="/">Trở lại trang chủ</Link>
          </Button>,
          <Button type="primary" key="login">
            <Link to="">Đăng nhập</Link>
          </Button>,
        ]}
      />
    );
  }

  return <>{children}</>;
};
