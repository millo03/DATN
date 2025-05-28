import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Spin, Alert, Button } from "antd";
import instance from "../../../configs/axios";
import { IContact } from "../../../common/interfaces/Contact";
import { format } from "date-fns";
import { BackwardFilled, LoadingOutlined } from "@ant-design/icons";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";

const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState<IContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await instance.get(`/contact/${id}`);
        setContact(data.data);
        setIsLoading(false);
      } catch (err) {
        setError("Lỗi khi lấy thông tin liên hệ");
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => format(new Date(text), "HH:mm dd/MM/yyyy"),
    },
    {
      title: "Nội dung phản hồi",
      dataIndex: "response_content",
      key: "response_content",
    },
    {
      title: "Email phản hồi",
      dataIndex: "responder_email",
      key: "responder_email",
    },
    {
      title: "Ngày phản hồi",
      dataIndex: "response_date",
      key: "response_date",
      render: (text: string) =>
        text ? format(new Date(text), "HH:mm dd/MM/yyyy") : "Chưa phản hồi",
    },
  ];

  const dataSource = contact
    ? [
      {
        key: contact._id,
        name: contact.name,
        email: contact.email,
        content: contact.content,
        createdAt: contact.createdAt,
        response_content: contact.response_content || "Chưa phản hồi",
        responder_email: contact.responder_email || "Chưa phản hồi",
        response_date: contact.response_date || "",
      },
    ]
    : [];

  return (
    <CheckAuths roles={["admin"]}>
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-between mt-10 mb-10">
          <h1 className="text-2xl font-semibold">Chi Tiết</h1>
          <Button type="primary">
            <Link to={"/admin/contact"}>
              <BackwardFilled />
              Quay lại
            </Link>
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          title={() => "Chi tiết liên hệ"}
        />
      </div>
    </CheckAuths>
  );
};

export default ContactDetail;
