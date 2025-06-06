/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Shipper } from "../../../common/interfaces/Shipper";
import instance from "../../../configs/axios";
import { Button, Table, Popconfirm, message, Input, Space, Empty } from "antd";
import { useQuery } from "@tanstack/react-query";
import { AiOutlinePlus } from "react-icons/ai";
import { FaDeleteLeft } from "react-icons/fa6";
import { Loader } from "lucide-react";
import AddShipperForm from "./Add_Shipper";
import Shipper_Detail from "./Shipper_Detail";
import { GrView } from "react-icons/gr";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
const ShipperList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchName, setSearchName] = useState("");
  const [open, setOpen] = useState(false);
  const [ShipperId, setShipperId] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["shippers"],
    queryFn: () => instance.get("/shippers"),
  });

  const { data: searchData } = useQuery({
    queryKey: ["shippers", searchName],
    queryFn: async () => {
      if (searchName) {
        const response = await instance.post(`/shippers/search`, {
          fullName: searchName,
        });
        return response.data;
      }
      return [];
    },
    enabled: !!searchName,
  });
  const dataSource = (searchName ? searchData : data?.data.shippers)?.map(
    (shipper: any) => ({
      key: shipper._id,
      ...shipper,
    })
  );

  const onHandleSearch = () => {
    setSearchName(searchName.trim());
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await instance.delete(`/shippers/${id}`);
      if (response.status === 200) {
        messageApi.success("Xóa thành công");
        refetch();
      } else {
        throw new Error("Xóa shipper không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa shipper:", error);
      messageApi.error(
        `Xóa shipper không thành công. ${
          (error as any).response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    }
  };
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const showDrawer = (id: string) => {
    setShipperId(id);
    setOpenDrawer(true);
  };
  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: any) => <p>{index + 1}</p>,
    },
    {
      key: "avatar",
      title: "Ảnh",
      render: (shipper: any) => (
        <img
          src={shipper.avatar}
          alt="Shipper"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      key: "fullName",
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      key: "vehicle",
      title: "Phương tiện vận chuyển",
      dataIndex: "vehicle",
    },
    {
      key: "phone",
      title: "Số Điện Thoại",
      dataIndex: "phone",
    },

    {
      key: "status",
      title: "Trạng Thái",
      dataIndex: "status",
      render: (status: string) => (
        <span style={{ color: status === "Available" ? "green" : "red" }}>
          {status === "Available" ? "Sẵn sàng" : "Không hoạt động"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Thao Tác",
      render: (_: any, shipper: Shipper) => (
        <Space>
          <Button type="default" onClick={() => showDrawer(shipper._id)}>
            <GrView />
          </Button>
          <Popconfirm
            title="Xóa người giao hàng"
            description="Bạn có muốn xóa người giao hàng này không?"
            onConfirm={() => handleDelete(shipper._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>
              <FaDeleteLeft />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // if (isLoading)
  //   return (
  //     <div className="fixed z-[10] bg-[#17182177] w-screen h-screen top-0 right-0 grid place-items-center">
  //       <div className="animate-spin">
  //         <Loader />
  //       </div>
  //     </div>
  //   );
  if (isError) return <div>{(error as any).message}</div>;

  return (
   
    <CheckAuths roles={["admin"]}>
      <div className="container">
        {contextHolder}
        <Shipper_Detail
          shipperId={ShipperId}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
        <AddShipperForm open={open} onClose={handleCancel} />

        <div className="mx-6">
          <div className="flex items-center justify-between mt-20 mb-5">
            <h1 className="text-2xl font-semibold">Quản Lý Người Giao Hàng</h1>

            <Button
              onClick={showModal}
              className="px-[6px] h-[38px] text-[14px] font-semibold border-[#1976D2] text-[#1976D2]"
            >
              <AiOutlinePlus className="ml-[3px]" /> THÊM MỚI SHIPPER
            </Button>
          </div>
          <div className="flex justify-between mb-2">
            <div className="flex space-x-5">
              <Input
                className="w-[500px]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nhập tên người giao hàng để tìm kiếm..."
              />
              <Button onClick={onHandleSearch} type="primary">
                Tìm kiếm
              </Button>
            </div>
          </div>
          {data && data?.data.shippers.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Table dataSource={dataSource} rowKey="_id" columns={columns} />
          )}
        </div>
      </div>
    </CheckAuths>
  );
};

export default ShipperList;
