import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Spin } from "antd";
import { useState } from "react";
import { List_Auth } from "../../../common/hooks/Auth/querry_Auth";
import ProfileHook from "../../../common/hooks/Settings/ProfileHook";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import {
  Add_Address,
  Update_Address
} from "../../../components/common/Client/_component/Address";
import instance from "../../../configs/axios";
import { LoadingOutlined } from "@ant-design/icons";

const Address = () => {
  const { isLoading, isError, error } = ProfileHook();
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const userRole = user?.user?.role;
  const { data } = List_Auth(userId);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  const handleUpdateAddress = () => {
    setIsOpenUpdate(true);
  };

  const handleAddress = () => {
    setIsOpen(!isOpen);
    if (addressId) setAddressId(null);
  };

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      if (userRole === "courier") {
        const { data } = await instance.delete(`/shippers/${userId}/${id}`);
        return data;
      } else {
        const { data } = await instance.delete(
          `/auth/remove_address/${userId}/${id}`
        );
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY"]
      });
      message.success("Xóa địa chỉ thành công");
    },
    onError: () => {
      message.error("Xóa địa chỉ thất bại");
    }
  });

  const handleDeleteAddress = (id: string, isDefault: boolean) => {
    if (isDefault) {
      message.error("Không thể xóa địa chỉ mặc định");
      return;
    }
    mutate(id);
  };

  const { mutate: setDefaultAddress } = useMutation({
    mutationFn: async (addressId: string) => {
      if (userRole === "courier") {
        await instance.patch(`/shippers/${userId}/${addressId}/default`);
      } else {
        await instance.patch(`/auth/${userId}/${addressId}/default`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AUTH_KEY"] });
      message.success("Đã thiết lập địa chỉ mặc định thành công");
    },
    onError: () => {
      message.error("Thiết lập địa chỉ mặc định thất bại");
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  if (isError) return <div>{error.message as any}</div>;

  // Sắp xếp địa chỉ mặc định lên đầu tiên
  const sortedAddresses = data?.address?.sort(
    (a: any, b: any) => b.checked - a.checked
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h1>Địa chỉ của tôi</h1>
          <button
            className="flex items-center gap-2 p-2 text-sm text-white bg-black rounded"
            onClick={handleAddress}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="hidden lg:block">Thêm địa chỉ mới</span>
          </button>
        </div>
        <div className="px-5 py-4">
          <h2 className="py-2">Địa chỉ</h2>
          {sortedAddresses?.map((address: any) => (
            <div
              key={address?._id}
              className="flex items-center justify-between pb-6 my-5 border-b"
            >
              <div className="py-1">
                <h1>
                  {address.fullName}{" "}
                  <span className="px-2 text-gray-400">|</span>{" "}
                  <span className="text-gray-400">{address?.phoneNumber}</span>
                </h1>
                <div className="flex text-gray-400">
                  <span>{address.detailedAddress}</span>
                  <span>-</span>
                  <span>{address.address}</span>
                </div>
                {address?.checked && (
                  <div className="flex gap-3 mt-3">
                    <button className="border border-stone-300 bg-[#000000] text-white px-4 py-2 rounded text-sm">
                      Mặc định
                    </button>
                  </div>
                )}
              </div>
              <div>
                <div className="hidden lg:block">
                  <div className="flex justify-end gap-2 py-2 text-blue-400">
                    <a
                      href="#"
                      onClick={() => {
                        handleUpdateAddress(), setAddressId(address?._id);
                      }}
                    >
                      Cập nhật
                    </a>
                    <Popconfirm
                      title="Xóa địa chỉ"
                      description="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                      onConfirm={() =>
                        handleDeleteAddress(address?._id!, address?.checked)
                      }
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <button>Xóa</button>
                    </Popconfirm>
                  </div>
                  {!address?.checked && (
                    <Button onClick={() => setDefaultAddress(address?._id)}>
                      Thiết lập mặc định
                    </Button>
                  )}
                </div>
                <div className="block lg:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <Add_Address
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          handleAddress={handleAddress}
        />
      )}
      {isOpenUpdate && (
        <Update_Address
          isOpenUpdate={isOpenUpdate}
          setIsOpenUpdate={setIsOpenUpdate}
          handleUpdateAddress={handleUpdateAddress}
          addressId={addressId}
        />
      )}
    </>
  );
};

export default Address;
