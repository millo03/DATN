import { LoadingOutlined } from "@ant-design/icons";
import { Button, Result, Spin, message } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import instance from "../../configs/axios";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await instance.get(`/verify?token=${token}`);
      setResult("success");
      message.success(response.data.message);
    } catch (error: any) {
      setResult("error");
      message.error(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="my-20 text-center">
      {loading && <Spin indicator={antIcon} />}
      {!loading && !result && (
        <div>
          <h2 className="mb-4 text-3xl">Xác thực tài khoản của bạn</h2>
          <Button type="primary" onClick={handleVerify}>
            Xác nhận
          </Button>
        </div>
      )}
      {result === "success" && (
        <Result
          status="success"
          title="Xác thực tài khoản thành công!"
          subTitle="Hãy kiểm tra email của bạn để nhận thông tin đăng nhập"
          // extra={[
          //   <Button type="primary" key="console">
          //     Go Console
          //   </Button>,
          //   <Button key="buy">Buy Again</Button>,
          // ]}
        />
      )}
      {result === "error" && (
        <Result
          status="error"
          title="Xác thực thất bại!"
          subTitle="Vui lòng liên hệ lại với chúng tôi"
          //   extra={[
          //     <Button type="primary" key="retry" onClick={handleVerify}>
          //       Retry
          //     </Button>,
          //     <Button key="contact">Contact Support</Button>,
          //   ]}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
