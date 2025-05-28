import { useNavigate } from "react-router-dom";
import {
  useContacts,
  useSearchContactByNameOrEmail,
} from "../../../common/hooks/Contact/useContacts";
import { format } from "date-fns";
import { IContact } from "../../../common/interfaces/Contact";
import { Button, Input, Spin, Table } from "antd";
import { useState } from "react";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import { LoadingOutlined } from "@ant-design/icons";

const ListContact = () => {
  const { contacts, isLoading, error, isError } = useContacts();

  const navigate = useNavigate();
  const [searchContact, setSearchContact] = useState("");
  const { data: searchData } = useSearchContactByNameOrEmail(searchContact);
  const dataSource = (searchContact ? searchData : contacts)?.map(
    (contact: IContact) => ({
      key: contact?._id,
      ...contact,
    })
  );
  const onHandleSearch = () => {
    setSearchContact(searchContact.trim());
  };
  const columns = [
    {
      title: "Tên Liên Hệ",
      dataIndex: "name",
      key: "name",
      render: (_: any, contact: IContact) => (
        <>
          <button
            onClick={() => handleViewDetail(contact?._id!)}
            className="text-blue-600 hover:underline"
          >
            {contact.name}
          </button>
        </>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: " Tin Nhắn",
      dataIndex: "content",
      key: "content",
      render: (_: any, contact: IContact) => (
        <p className="text-red-600">{contact?.content}</p>
      ),
    },
    {
      title: "  Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, contact: IContact) => (
        <>{formatDate(contact?.createdAt)}</>
      ),
    },
    {
      title: "    Thao Tác",
      dataIndex: "content",
      key: "content",
      render: (_: any, contact: IContact) => (
        <>
          {" "}
          <Button
            onClick={() => handleResponse(contact._id!)}
            className="p-3 text-white bg-blue-600 border-gray-300 rounded-lg hover:bg-blue-500 focus:outline-none"
          >
            Phản hồi
          </Button>
        </>
      ),
    },
  ];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy");
  };

  const handleViewDetail = (id: string) => {
    navigate(`/admin/contact/${id}`);
  };
  const handleResponse = (id: string) => {
    navigate(`/admin/feedback/${id}`);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (isError) {
    return <div>Đã xảy ra lỗi khi lấy dữ liệu: {error?.message}</div>;
  }

  return (
    <CheckAuths roles={["admin"]}>
      <div className="mx-6">
        <div className="flex items-center justify-between mt-20 mb-5">
          <h1 className="text-2xl font-semibold">Quản Lý Liên Hệ</h1>{" "}
        </div>

        <div className="flex justify-between mb-2">
          <div className="space-x-5">
            {/* <Select
            // value={statusFilter}
            // onChange={handleStatusChange}
            className="w-[200px] h-[40px]"
            placeholder="Lọc thời gian tạo"
          ></Select> */}
          </div>
          <div className="flex space-x-5">
            <Input
              className="w-[500px]"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              placeholder="nhâp tên hoặc email của khách hàng liên hệ ..."
            />
            <Button type="primary" onClick={onHandleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>

        {contacts.length > 0 ? (
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
          <tr>
            <td
              colSpan={6}
              className="px-4 py-4 text-sm text-center text-gray-500"
            >
              Không có dữ liệu
            </td>
          </tr>
        )}
      </div>
    </CheckAuths>
  );
};

export default ListContact;
