import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  message,
  Popconfirm,
} from "antd";
import instance from "../../../../configs/axios";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
type FieldType = {
  userId: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  addressDetails: string;
  checked: boolean;
  newAddress: string;
};
// export const Add_Address = ({ handleAddress }: any) => {
//   const [user] = useLocalStorage("user", {});
//   const userId = user?.user?._id;
//   const querryClient = useQueryClient();
//   const [form] = Form.useForm();
//   const [messageApi, contextHolder] = message.useMessage();

//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [villages, setVillages] = useState([]);

//   const [selectedProvince, setSelectedProvince] = useState(null);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedWard, setSelectedWard] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       // Fetch data for provinces
//       const provincesData = await instance.get("/api/provinces");
//       setProvinces(provincesData.data);

//       // Initially empty districts, wards, and villages
//       setDistricts([]);
//       setWards([]);
//       setVillages([]);
//     }

//     fetchData();
//   }, []);

//   const handleProvinceChange = async (provinceId: string) => {
//     setSelectedProvince(provinceId);
//     setSelectedDistrict(null);
//     setSelectedWard(null);

//     // Fetch districts based on selected province
//     const districtsData = await instance.get(
//       `/api/districts?province=${provinceId}`
//     );
//     setDistricts(districtsData.data);

//     // Reset wards and villages
//     setWards([]);
//     setVillages([]);
//   };

//   const handleDistrictChange = async (districtId: string) => {
//     setSelectedDistrict(districtId);
//     setSelectedWard(null);

//     // Fetch wards based on selected district
//     const wardsData = await instance.get(`/api/wards?district=${districtId}`);
//     setWards(wardsData.data);

//     // Reset villages
//     setVillages([]);
//   };

//   const handleWardChange = async (wardId: string) => {
//     setSelectedWard(wardId);

//     // Fetch villages based on selected ward
//     const villagesData = await instance.get(`/api/villages?ward=${wardId}`);
//     setVillages(villagesData.data);
//   };

//   const { mutate } = useMutation({
//     mutationFn: async (formData) => {
//       const { data } = await instance.post(`/auth/add_address`, formData);
//       form.resetFields();
//       return data;
//     },
//     onSuccess: () => {
//       querryClient.invalidateQueries({
//         queryKey: ["AUTH_KEY"],
//       });
//       messageApi.open({
//         type: "success",
//         content: "Thêm địa chỉ thành công",
//       });
//     },
//     onError: () => {
//       messageApi.open({
//         type: "error",
//         content: "Thêm địa chỉ thất bại!",
//       });
//     },
//   });

//   const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
//     const data_form: any = {
//       userId: userId,
//       newAddress: values,
//       setDefault: values.checked, // Gửi thông tin về việc thiết lập địa chỉ làm mặc định
//     };
//     mutate(data_form);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//       <div className="bg-white p-5 border rounded relative w-[400px] lg:w-[500px]">
//         <h1 className="py-3 font-medium text-center">Địa chỉ mới</h1>
//         {contextHolder}
//         <Form
//           form={form}
//           name="basic"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           autoComplete="off"
//         >
//           <Form.Item
//             name="fullName"
//             className="w-full my-3"
//             rules={[
//               { required: true, message: "Vui lòng nhập họ và tên!" },
//               { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
//             ]}
//           >
//             <Input
//               className="w-full px-2 py-2 border rounded focus:ring-0"
//               placeholder="Họ và tên"
//             />
//           </Form.Item>

//           <Form.Item
//             name="phoneNumber"
//             className="w-full my-3"
//             rules={[
//               { required: true, message: "Vui lòng nhập số điện thoại!" },
//               {
//                 pattern: /^[0-9]{10,11}$/,
//                 message: "Số điện thoại không hợp lệ!",
//               },
//             ]}
//           >
//             <Input
//               className="w-full px-2 py-2 border rounded focus:ring-0"
//               placeholder="Số điện thoại"
//             />
//           </Form.Item>
//           <Form.Item
//             name="province"
//             className="w-full my-3"
//             rules={[{ required: true, message: "Vui lòng chọn thành phố!" }]}
//           >
//             <Select
//               placeholder="Chọn thành phố"
//               onChange={handleProvinceChange}
//               className="w-full"
//             >
//               {provinces.map((province) => (
//                 <Option key={province.id} value={province.id}>
//                   {province.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="district"
//             className="w-full my-3"
//             rules={[{ required: true, message: "Vui lòng chọn huyện!" }]}
//           >
//             <Select
//               placeholder="Chọn huyện"
//               onChange={handleDistrictChange}
//               disabled={!selectedProvince}
//               className="w-full"
//             >
//               {districts.map((district) => (
//                 <Option key={district.id} value={district.id}>
//                   {district.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="ward"
//             className="w-full my-3"
//             rules={[{ required: true, message: "Vui lòng chọn xã!" }]}
//           >
//             <Select
//               placeholder="Chọn xã"
//               onChange={handleWardChange}
//               disabled={!selectedDistrict}
//               className="w-full"
//             >
//               {wards.map((ward) => (
//                 <Option key={ward.id} value={ward.id}>
//                   {ward.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="village"
//             className="w-full my-3"
//             rules={[{ required: true, message: "Vui lòng chọn thôn!" }]}
//           >
//             <Select
//               placeholder="Chọn thôn"
//               disabled={!selectedWard}
//               className="w-full"
//             >
//               {villages.map((village) => (
//                 <Option key={village.id} value={village.id}>
//                   {village.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="addressDetails"
//             className="w-full my-3"
//             rules={[
//               { required: true, message: "Vui lòng nhập địa chỉ cụ thể!" },
//             ]}
//           >
//             <Input
//               className="w-full px-2 py-2 border rounded focus:ring-0"
//               placeholder="Địa chỉ cụ thể"
//             />
//           </Form.Item>

//           <Form.Item
//             className="flex items-center w-full gap-3 my-3"
//             name="checked"
//             valuePropName="checked"
//           >
//             <Checkbox>Đặt làm mặc định</Checkbox>
//           </Form.Item>

//           <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//             <Button htmlType="submit" className="h-10 text-white bg-black">
//               Hoàn Thành
//             </Button>
//           </Form.Item>
//         </Form>
//         <Button
//           onClick={handleAddress}
//           className="absolute w-8 h-8 px-2 py-2 border-0 rounded hover:bg-slate-100 hover:rounded-full hover:border-2 top-5 right-5"
//         >
//           <CloseOutlined />
//         </Button>
//       </div>
//     </div>
//   );
// };

export const Add_Address = ({ handleAddress }: any) => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const userRole = user?.user?.role;
  const querryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      if (userRole === "courier") {
        const { data } = await instance.post(`/shippers/add_address`, formData);
        form.resetFields();
        return data;
      } else {
        const { data } = await instance.post(`/auth/add_address`, formData);
        form.resetFields();
        return data;
      }
    },
    onSuccess: () => {
      querryClient.invalidateQueries({
        queryKey: ["AUTH_KEY"],
      });
      messageApi.open({
        type: "success",
        content: "Thêm địa chỉ thành công",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Thêm địa chỉ thất bại!",
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const data_form: any = {
      userId: userId,
      newAddress: values,
      setDefault: values.checked,
    };

    mutate(data_form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-5 border rounded relative w-[400px] lg:w-[500px]">
        <h1 className="py-3 font-medium text-center">Địa chỉ mới</h1>
        {contextHolder}
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="fullName"
            className="w-full my-3"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            className="w-full my-3"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="address"
            className="w-full my-3"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
            />
          </Form.Item>

          <Form.Item name="addressDetails" className="w-full my-3"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Địa chỉ cụ thể"
            />
          </Form.Item>

          <Form.Item
            className="flex items-center w-full gap-3 my-3"
            name="checked"
            valuePropName="checked"
          >
            <Checkbox>Đặt làm mặc định</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit" className="h-10 text-white bg-black">
              Hoàn Thành
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={handleAddress}
          className="absolute w-8 h-8 px-2 py-2 border-0 rounded hover:bg-slate-100 hover:rounded-full hover:border-2 top-5 right-5"
        >
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};

export const Update_Address = ({ addressId, setIsOpenUpdate }: any) => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const userRole = user?.user?.role;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const closeOpenUpdate = () => {
    setIsOpenUpdate(false);
  };

  // Lấy thông tin địa chỉ người dùng
  const { data, isSuccess } = useQuery({
    queryKey: ["AUTH_KEY", addressId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/auth/address/${userId}/${addressId}`
      );
      return data;
    },
  });

  // Cập nhật giá trị của form khi dữ liệu đã được tải
  useEffect(() => {
    if (isSuccess && data?.address) {
      form.setFieldsValue(data.address);
    }
  }, [isSuccess, data, form]);

  // Mutation để cập nhật địa chỉ
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      if (userRole === "courier") {
        const { data } = await instance.put(
          `/shippers/${userId}/${addressId}`,
          formData
        );

        return data;
      } else {
        const { data } = await instance.put(
          `/auth/${userId}/${addressId}`,
          formData
        );
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AUTH_KEY", userId],
      });
      messageApi.open({
        type: "success",
        content: "Chỉnh sửa địa chỉ thành công",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Chỉnh sửa địa chỉ thất bại!",
      });
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values: any) => {
    mutate(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-5 border rounded relative w-[400px] lg:w-[500px]">
        <h1 className="py-3 font-medium text-center">Chỉnh sửa địa chỉ</h1>
        {contextHolder}
        <Form
          form={form}
          name="basic"
          // initialValues={{ ...data?.address }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="fullName"
            className="w-full my-3"
            rules={[
              { required: true, message: "Họ và Tên không được để trống!" },
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            className="w-full my-3"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="address"
            className="w-full my-3"
            rules={[
              { required: true, message: "Địa chỉ không được để trống!" },
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
            />
          </Form.Item>

          <Form.Item name="addressDetails" className="w-full my-3">
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Địa chỉ cụ thể"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit" className="h-10 text-white bg-black">
              Hoàn Thành
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={closeOpenUpdate}
          className="absolute w-8 h-8 px-2 py-2 border-0 rounded hover:bg-slate-100 hover:rounded-full hover:border-2 top-5 right-5"
        >
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};

export const List_Address = ({
  auth,
  handleTAdd,
  handleAddressSelect,
  handleAddress,
  selectedAddress,
}: any) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-5 border rounded relative w-[400px] lg:w-[600px] max-h-[600px] overflow-auto hidden_scroll_x">
        <h1 className="py-3 text-xl font-medium text-center">
          Địa chỉ của tôi
        </h1>
        <div>
          <div className="px-5 py-4">
            <div className="flex justify-between">
              <h2 className="py-2">Địa chỉ</h2>
              <Button className="w-9 h-9" onClick={handleTAdd}>
                <PlusOutlined />
              </Button>
            </div>

            {auth?.map((item: any, index: number) => (
              <div
                className="flex items-center justify-between pb-6 my-5 border-b"
                key={index}
              >
                <div className="flex items-start gap-4 py-1">
                  <div>
                    <h1>
                      <span className="font-bold">{item.fullName}</span>
                      <span className="px-2 text-gray-400">|</span>
                      <span className="text-gray-400">{item.phoneNumber}</span>
                    </h1>
                    <p className="py-2 text-gray-400">{item.addressDetails}</p>
                    <p className="text-gray-400">{item.address}</p>
                    <div className="flex gap-3 mt-3">
                      {item.checked && (
                        <Button className="py-5">Mặc định</Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="hidden lg:block">
                    <div className="flex flex-col gap-2 py-2 text-blue-400">
                      <Button className="w-9 h-9">
                        <EditOutlined />
                      </Button>
                      <Popconfirm
                        title="Địa chỉ nhận hàng"
                        description="Bạn có muốn chọn làm địa chỉ nhận hàng không?"
                        onConfirm={() => handleAddressSelect(item)}
                        okText="Có"
                        cancelText="Không"
                      >
                        {selectedAddress === item ? (
                          <Button
                            className="w-9 h-9 !bg-slate-100 cursor-not-allowed"
                            disabled
                          >
                            <CheckOutlined />
                          </Button>
                        ) : (
                          <Button className="w-9 h-9">
                            <CheckOutlined />
                          </Button>
                        )}
                      </Popconfirm>
                    </div>
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
        <Button
          onClick={handleAddress}
          className="absolute w-8 h-8 px-2 py-2 border-0 rounded hover:bg-slate-100 hover:rounded-full hover:border-2 top-5 right-5"
        >
          <CloseOutlined />
        </Button>
      </div>
    </div>
  );
};
