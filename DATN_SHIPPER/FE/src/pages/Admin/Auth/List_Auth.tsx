import { LoadingOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Image, Input, Modal, Skeleton, Spin, Table } from "antd";
import { useState } from "react";
import { list_Auth } from "../../../_lib/Auth/Auth";
import { useSearchUserByUsername } from "../../../common/hooks/Auth/querry_Auth";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
interface UpdateField {
  field: string;
  value: string;
  time: string;
}

const List_Auth = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [searchName, setSearchName] = useState("");
  const { data: searchData } = useSearchUserByUsername(searchName);
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["LIST_AUTH"],
    queryFn: async () => {
      const data = await list_Auth();
      return data;
    }
  });

  const onHandleSearch = () => {
    setSearchName(searchName.trim());
  };

  const dataSource = (searchName ? searchData : initialData?.data)?.map(
    (auth: any) => {
      return {
        key: auth._id,
        ...auth
      };
    }
  );

  const columns = [
    {
      title: "Ảnh Người Dùng",
      dataIndex: "avatar",
      key: "avatar",
      render: (_: any, auth: any) =>
        isLoading ? (
          <Skeleton.Avatar active size="large" shape="square" />
        ) : (
          <Image
            src={auth.avatar}
            alt=""
            width={80}
            height={80}
            className="object-cover"
          />
        )
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "userName",
      key: "userName",
      render: (_: any, auth: any) =>
        isLoading ? (
          <Skeleton.Input style={{ width: 150 }} active size="small" />
        ) : (
          auth.userName
        )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_: any, auth: any) =>
        isLoading ? (
          <Skeleton.Input style={{ width: 200 }} active size="small" />
        ) : (
          auth.email
        )
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      render: (_: any, auth: any) =>
        isLoading ? (
          <Skeleton.Input style={{ width: 100 }} active size="small" />
        ) : (
          auth.role
        )
    },
    {
      title: "Cập Nhật Gần Đây",
      dataIndex: "updatedFields",
      key: "updatedFields",
      render: (updatedFields) => {
        if (updatedFields && updatedFields.length > 0) {
          const latestUpdate = updatedFields[updatedFields.length - 1].time;
          return new Date(latestUpdate).toLocaleString(); // Chuyển đổi sang định dạng ngày giờ
        }
        return "Chưa có cập nhật";
      }
    },
    {
      title: "Nội Dung Cập Nhật",
      dataIndex: "updatedFields",
      key: "updatedFields",
      render: (updatedFields: any) => {
        if (updatedFields && updatedFields.length > 0) {
          return (
            <Button
              onClick={() => showModal(updatedFields)}
              className="p-3 text-white bg-blue-600 border-gray-300 rounded-lg hover:bg-blue-500 focus:outline-none"
            >
              Xem chi tiết
            </Button>
          );
        } else {
          return <p className="text-red-500">Chưa có cập nhật</p>;
        }
      }
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      render: (_: any, auth: any) =>
        isLoading ? (
          <Skeleton.Input style={{ width: 100 }} active size="small" />
        ) : (
          auth.role
        )
    }
  ];

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(); // Chỉ lấy ngày, tháng, năm
  };

  const getLatestUpdateDetails = (updatedFields: UpdateField[]) => {
    if (!updatedFields || updatedFields.length === 0) {
      return "Không có thông tin cập nhật";
    }

    const latestUpdate = updatedFields[updatedFields.length - 1];
    const date = new Date(latestUpdate.time).toLocaleDateString();
    const time = new Date(latestUpdate.time).toLocaleTimeString();

    let fieldValue = latestUpdate.value;
    if (latestUpdate.field === "birthDate") {
      fieldValue = formatDate(fieldValue);
    }

    return `Ngày cập nhật: ${date}\n\nNội dung cập nhật:\n${latestUpdate.field}: ${fieldValue} (${time})`;
  };

  const showModal = (updatedFields: any) => {
    if (updatedFields && updatedFields.length > 0) {
      setSelectedUpdate(updatedFields);
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <CheckAuths roles={["admin"]}>
      <>
        <div className="mx-6">
          {" "}
          <div className="flex items-center justify-between mt-20 mb-5">
            <h1 className="text-2xl font-semibold">Quản Lý Người Dùng</h1>{" "}
          </div>
          <div className="flex justify-between mb-2">
            <div className="space-x-5">
              {/* <Select
              // value={statusFilter}
              // onChange={handleStatusChange}
              className="w-[200px] h-[40px]"
              placeholder="Lọc quyền người dùng"
            ></Select> */}
            </div>
            <div className="flex space-x-5">
              <Input
                className="w-[500px]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="nhâp tên sản phẩm để tìm kiếm..."
              />
              <Button onSubmit={() => onHandleSearch} type="primary">
                Tìm kiếm
              </Button>
            </div>
          </div>
          <Spin
            spinning={isLoading}
            indicator={<LoadingOutlined spin />}
            size="large"
          >
            <Table columns={columns} dataSource={dataSource} />
          </Spin>
          <Modal
            title="Chi tiết cập nhật"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {selectedUpdate ? (
              <Form style={{ maxWidth: 500 }}>
                <Form.Item>
                  <Input.TextArea
                    value={getLatestUpdateDetails(selectedUpdate)}
                    readOnly
                    rows={15}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Form>
            ) : (
              <p>Không có thông tin cập nhật</p>
            )}
          </Modal>
        </div>
      </>
    </CheckAuths>
  );
};

export default List_Auth;
