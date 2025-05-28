import React from "react";
import { Col, Divider, Drawer, Row } from "antd";
import instance from "../../../configs/axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
interface ShipperDetailProps {
  shipperId: string | null;
  open: boolean;
  onClose: () => void;
}

const Shipper_Detail: React.FC<ShipperDetailProps> = ({
  shipperId,
  open,
  onClose,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [`shippers`, shipperId],
    queryFn: () => instance.get(`/shippers/${shipperId}`),
  });
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  if (isLoading) return <div>Loading...</div>;

  const shipperData = data?.data || {};

  return (
    <Drawer width={450} placement="right" onClose={onClose} open={open}>
      <p className="mb-6 text-3xl site-description-item-profile-p">
        Thông tin người giao hàng
      </p>

      <Row justify="center" style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          className="w-40 h-40 rounded-full"
          src={data?.data.avatar}
          alt=""
        />
      </Row>

      <Row className="gap-1">
        <Col span={24}>
          <p>
            <strong>Họ và Tên:</strong> {shipperData.fullName}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Số điện thoại:</strong> {shipperData.phone}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Email:</strong> {shipperData.email}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Phương tiện:</strong> {shipperData.vehicle}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {shipperData.status === "Available"
              ? "Sẵn sàng"
              : "Không hoạt động"}
          </p>
        </Col>
        <Col span={24}>
          <p>
            <strong>Ngày sinh: </strong>
            {formatDate(shipperData.birthDate)}
          </p>
        </Col>
      </Row>
      <Divider />
    </Drawer>
  );
};

export default Shipper_Detail;
