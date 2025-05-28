import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, FormProps, Input, message, Spin } from "antd";
import instance from "../../../configs/axios";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";
import { useNavigate } from "react-router-dom";
import { List_Auth } from "../../../common/hooks/Auth/querry_Auth";
import { useEffect } from "react";

const InforShipper = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const { data, isError, isLoading, error } = List_Auth(userId);

  // Nếu có dữ liệu shipper, điều hướng đến '/courier/orders'
  useEffect(() => {
    if (
      data &&
      data.fullName &&
      data.number_citizen &&
      data.phone &&
      data.vehicle &&
      data.address &&
      data.bankAccountNumber &&
      data.bankAccountName
    ) {
      navigate("/courier/orders");
    }
  }, [data, navigate]);

  const [form] = Form.useForm();
  type FieldType = {
    fullName?: string;
    number_citizen?: string;
    phone?: string;
    vehicle?: string;
    address?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
  };

  const mutation = useMutation({
    mutationFn: async (values: FieldType) => {
      const { data } = await instance.put(`/shippers/${userId}`, values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY", userId],
      });
      message.success("Cập nhật thông tin thành công");
      navigate("/courier/orders");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutation.mutate(values);
  };

  return (
    <div>
      {/* Section Đăng nhập */}
      <div
        id="login-section"
        className="container flex flex-col mx-auto h-auto mt-5 bg-white rounded-lg bg-[#DBC5A4]"
      >
        {/* Nội dung đăng nhập */}
        <div className="flex justify-center w-full h-auto my-auto lg:justify-normal">
          <div className="flex ml-[30px] mt-[30px] mb-[30px] w-full">
            <div className="flex items-center xl:p-7">
              <div className="flex flex-col w-[400px] h-full p-6 text-center bg-white border shadow-lg rounded-3xl">
                <h3 className="mb-3 text-4xl font-extrabold text-gray-900">
                  Thông tin shipper
                </h3>

                {isLoading ? (
                  <Spin />
                ) : (
                  <Form
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    className="space-y-4"
                    initialValues={{
                      fullName: data?.fullName || "",
                      address: data?.address || "",
                      phone: data?.phone || "",
                      number_citizen: data?.number_citizen || "",
                      vehicle: data?.vehicle || "",
                      email: data?.email || "",
                      bankAccountNumber: data?.bankAccountNumber || "",
                      bankAccountName: data?.bankAccountName || "",
                    }}
                  >
                    <Form.Item<FieldType>
                      label="Họ và tên"
                      name="fullName"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Thành phố"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item<FieldType>
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="Số CCCD"
                      name="number_citizen"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item
                      name="vehicle"
                      label="Phương tiện di chuyển"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item
                      name="bankAccountName"
                      label="Tên ngân hàng nhận lương(Kèm tên tài khoản)"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item
                      name="bankAccountNumber"
                      label="Số tài khoản ngân hàng"
                      rules={[
                        { required: true, message: "Vui lòng nhập thông tin!" },
                      ]}
                    >
                      <Input className="h-[50px]" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-[100px] h-[40px]"
                      >
                        Hoàn tất
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                {isError && <div>{error.message}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InforShipper;
