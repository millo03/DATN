/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined
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
  Select
} from "antd";
import "mapbox-gl/dist/mapbox-gl.css";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import instance from "../../../../configs/axios";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFkdWMiLCJhIjoiY200MmNkdnU1Mmo5dTJscXQ0cWFtNGJqeCJ9.3pBGjdx-XHSvKR3BIg-e0Q";
type FieldType = {
  userId: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  addressDetails: string;
  checked: boolean;
  newAddress: string;
};

const { Option } = Select;

export const Update_Address = ({ addressId, setIsOpenUpdate }: any) => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const userRole = user?.user?.role;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const closeOpenUpdate = () => setIsOpenUpdate(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({
    province: { name: "" },
    district: { name: "" },
    ward: { name: "" }
  });
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const { data, isSuccess } = useQuery({
    queryKey: ["AUTH_KEY", addressId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/auth/address/${userId}/${addressId}`
      );
      return data;
    }
  });

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch {
      message.error("Lỗi khi tải danh sách tỉnh/thành phố.");
    }
  };

  useEffect(() => {
    if (isSuccess && data?.address) {
      form.setFieldsValue({
        fullName: data.address.fullName,
        phoneNumber: data.address.phoneNumber,
        province: data.address.addressName[2],
        district: data.address.addressName[1],
        ward: data.address.addressName[0],
        detailedAddress: data.address.detailedAddress,
        checked: data.address.checked
      });

      const addressNames = data.address.addressName || [];

      const provinceCode = addressNames[0];
      const districtCode = addressNames[1];
      const wardCode = addressNames[2];
      selectedLocation.ward.name = addressNames[0];
      selectedLocation.district.name = addressNames[1];
      selectedLocation.province.name = addressNames[2];

      const selectedProvince = provinces.find(
        (item) => item.code === provinceCode
      );
      if (selectedProvince) {
        setSelectedLocation((prev) => ({
          ...prev,
          province: selectedProvince
        }));
        fetchDetailProvinces(provinceCode);
      }

      if (districtCode) {
        const selectedDistrict = districts.find(
          (item) => item.code === districtCode
        );
        if (selectedDistrict) {
          setSelectedLocation((prev) => ({
            ...prev,
            district: selectedDistrict
          }));
          setWards(selectedDistrict.wards || []);
        }
      }

      if (wardCode) {
        const selectedWard = wards.find((item) => item.code === wardCode);
        if (selectedWard) {
          setSelectedLocation((prev) => ({
            ...prev,
            ward: selectedWard
          }));
        }
      }

      setCoordinates({
        lat: data.address.coordinates.lat,
        lng: data.address.coordinates.lng
      });

      fetchProvinces();
    }
  }, [isSuccess, data, form]);

  const fetchDetailProvinces = async (provinceCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch {
      message.error("Lỗi khi tải danh sách quận/huyện.");
    }
  };

  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinces.find((item) => item.code === value);
    if (selectedProvince) {
      setSelectedLocation({
        province: selectedProvince,
        district: { name: "" },
        ward: { name: "" }
      });
      setDistricts([]);
      setWards([]);
      fetchDetailProvinces(value);
    }
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((item) => item.code === value);
    if (selectedDistrict) {
      setSelectedLocation((prev) => ({
        ...prev,
        district: selectedDistrict,
        ward: { name: "" }
      }));
      setWards(selectedDistrict.wards || []);
    }
  };

  const handleWardChange = (value: string) => {
    const selectedWard = wards.find((item) => item.code === value);
    if (selectedWard) {
      setSelectedLocation((prev) => ({
        ...prev,
        ward: selectedWard
      }));
      const fullAddress = `${selectedWard.name}, ${selectedLocation.district.name}, ${selectedLocation.province.name}`;
      fetchCoordinates(fullAddress);
    }
  };

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features?.length) {
        const [lng, lat] = data.features[0].center;
        setCoordinates({ lat, lng });
      } else {
        message.error("Không thể tìm thấy tọa độ.");
      }
    } catch {
      message.error("Lỗi khi tìm tọa độ.");
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapContainerRef.current || !coordinates.lat || !coordinates.lng)
      return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 12
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map);

    map.on("click", (e) => {
      const newCoordinates = e.lngLat;
      setCoordinates({
        lat: newCoordinates.lat,
        lng: newCoordinates.lng
      });
      marker.setLngLat([newCoordinates.lng, newCoordinates.lat]);
    });

    return () => {
      map.remove();
    };
  }, [coordinates]);
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const url =
        userRole === "courier"
          ? `/shippers/${userId}/${addressId}`
          : `/auth/update_address/${userId}/${addressId}`;
      const { data } = await instance.put(url, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["AUTH_KEY", userId]);
      setIsOpenUpdate(false);
      messageApi.open({
        type: "success",
        content: "Cập nhật địa chỉ thành công"
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Cập nhật địa chỉ thất bại!"
      });
    }
  });
  const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
    if (data.address.addressName[2] !== selectedLocation.province?.name) {
      message.error("Vui lòng chọn lại quận/huyện!");
      return;
    }
    if (data.address.addressName[1] !== selectedLocation.district?.name) {
      message.error("Vui lòng chọn lại phường/xã");
      return;
    }
    const fullAddress = `${selectedLocation.ward.name || form.getFieldValue("ward")
      }, ${selectedLocation.district.name || form.getFieldValue("district")}, ${selectedLocation.province.name || form.getFieldValue("province")
      }`;
    const fullAddressName = [
      selectedLocation.ward.name || form.getFieldValue("ward"),
      selectedLocation.district.name || form.getFieldValue("district"),
      selectedLocation.province.name || form.getFieldValue("province")
    ];

    if (!coordinates.lat || !coordinates.lng) {
      await fetchCoordinates(fullAddress);
    }

    const data_form: any = {
      updatedAddress: {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        detailedAddress: values.detailedAddress,
        address: fullAddress,
        addressName: fullAddressName,
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      },
      setDefault: values.checked
    };
    message.success("Cập nhật địa chỉ thành công!");

    mutate(data_form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {contextHolder}
      <div className="bg-white p-4 border rounded relative w-[600px] lg:w-[800px] h-[500px] overflow-y-auto custom-scrollbar">
        <h1 className="py-1 font-medium text-center">Cập nhật địa chỉ</h1>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            className="w-full my-3"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            className="w-full my-3"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" }
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố!" }
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
              >
                {provinces?.map((province: any) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!districts.length}
              >
                {districts?.map((district: any) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="ward"
              label="Xã/Phường"
              rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn xã/phường"
                onChange={handleWardChange}
                disabled={!wards.length}
              >
                {wards?.map((ward: any) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="detailedAddress"
            label="Địa chỉ cụ thể"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }
            ]}
          >
            <Input placeholder="Địa chỉ cụ thể" />
          </Form.Item>

          <Form.Item name="checked" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>

          <div className="map-container">
            <div
              className="map-box"
              ref={mapContainerRef}
              style={{ height: "300px", width: "100%" }}
            />
          </div>

          <div className="text-center py-3">
            <Button
              className="h-10 mt-5 text-white bg-black"
              htmlType="submit"
            >
              Cập nhật
            </Button>
          </div>

          <div className="absolute top-0 right-0 p-3">
            <Button
              icon={<CloseOutlined />}
              onClick={closeOpenUpdate}
              type="text"
              style={{ color: "black" }}
            />
          </div>
        </Form>
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
  // const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  const handleUpdateAddress = () => {
    setIsOpenUpdate(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-screen z-[50] h-screen fixed top-0 left-0 bg-transparent" onClick={handleAddress} />
      <div className="bg-white z-[100] p-5 border rounded relative w-[400px] lg:w-[600px] max-h-[600px] overflow-auto hidden_scroll_x">
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
                    <p className="py-2 text-gray-400">{item.detailedAddress}</p>
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
                        <EditOutlined onClick={() => {
                          handleUpdateAddress(), setAddressId(item?._id);
                        }} />
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
        {isOpenUpdate && <Update_Address
          isOpenUpdate={isOpenUpdate}
          setIsOpenUpdate={setIsOpenUpdate}
          handleUpdateAddress={handleUpdateAddress}
          addressId={addressId}
        />}
      </div>
    </div>
  );
};

export const Add_Address = ({ handleAddress }: any) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    province: { name: "" },
    district: { name: "" },
    ward: { name: "" }
  });
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
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
      form.resetFields();
      handleAddress(false);
      querryClient.invalidateQueries({
        queryKey: ["AUTH_KEY"]
      });
      messageApi.open({
        type: "success",
        content: "Thêm địa chỉ thành công"
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Thêm địa chỉ thất bại!"
      });
    }
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch {
        message.error("Lỗi khi tải danh sách tỉnh/thành phố.");
      }
    };
    fetchProvinces();
  }, []);

  const fetchDetailProvinces = async (provinceCode: string) => {
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch {
      message.error("Lỗi khi tải danh sách quận/huyện.");
    }
  };
  const handleProvinceChange = (value: string) => {
    const selectedProvince = provinces.find((item) => item.code === value);
    if (selectedProvince) {
      setSelectedLocation({
        province: selectedProvince,
        district: { name: "" },
        ward: { name: "" }
      });
      setDistricts([]);
      setWards([]);
      fetchDetailProvinces(value);
    }
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find((item) => item.code === value);
    if (selectedDistrict) {
      setSelectedLocation((prev) => ({
        ...prev,
        district: selectedDistrict,
        ward: { name: "" }
      }));
      setWards(selectedDistrict.wards || []);
    }
  };

  const handleWardChange = (value: string) => {
    const selectedWard = wards.find((item) => item.code === value);
    if (selectedWard) {
      setSelectedLocation((prev) => ({
        ...prev,
        ward: selectedWard
      }));
      const fullAddress = `${selectedWard.name}, ${selectedLocation.district.name}, ${selectedLocation.province.name}`;
      fetchCoordinates(fullAddress);
    }
  };

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features?.length) {
        const [lng, lat] = data.features[0].center;
        setCoordinates({ lat, lng });
      } else {
        message.error("Không thể tìm thấy tọa độ.");
      }
    } catch {
      message.error("Lỗi khi tìm tọa độ.");
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapContainerRef.current || !coordinates.lat || !coordinates.lng)
      return;

    // Khởi tạo bản đồ
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 12
    });

    // Tạo Marker
    const marker = new mapboxgl.Marker()
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map);

    // Cập nhật tọa độ khi click vào bản đồ
    map.on("click", (e) => {
      const newCoordinates = e.lngLat;
      setCoordinates({
        lat: newCoordinates.lat,
        lng: newCoordinates.lng
      });

      // Di chuyển Marker đến vị trí mới
      marker.setLngLat([newCoordinates.lng, newCoordinates.lat]);

      console.log(
        "Tọa độ mới sau khi click:",
        newCoordinates.lng,
        newCoordinates.lat
      );
    });

    return () => {
      map.remove();
    };
  }, [coordinates]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!selectedLocation.district?.code) {
      message.error("Vui lòng chọn quận/huyện!");
      return;
    }
    if (!selectedLocation.ward?.code) {
      message.error("Vui lòng chọn xã/phường!");
      return;
    }

    if (!coordinates.lat || !coordinates.lng) {
      const fullAddress = `${selectedLocation.ward.name}, ${selectedLocation.district.name}, ${selectedLocation.province.name}`;
      await fetchCoordinates(fullAddress);
    }

    const fullAddress = `${selectedLocation.ward.name}, ${selectedLocation.district.name}, ${selectedLocation.province.name}`;
    const fullAddressName = [
      selectedLocation.ward.name,
      selectedLocation.district.name,
      selectedLocation.province.name
    ];
    message.success("Địa chỉ đã được lưu!");
    const data_form: any = {
      userId: userId,
      newAddress: {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        detailedAddress: values.addressDetails,
        address: fullAddress,
        addressName: fullAddressName,
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      },
      setDefault: values.checked
    };
    mutate(data_form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {contextHolder}
      <div className="bg-white p-4 border rounded relative w-[600px] lg:w-[800px] h-[500px] overflow-y-[600px] custom-scrollbar">
        <h1 className="py-1 font-medium text-center">Địa chỉ mới</h1>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            className="w-full my-3"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 3, message: "Tên phải có ít nhất 3 ký tự!" }
            ]}
            style={{ fontSize: "8px" }}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            className="w-full my-3"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!"
              }
            ]}
          >
            <Input
              className="w-full px-2 py-2 border rounded focus:ring-0"
              placeholder="Số điện thoại"
            />
          </Form.Item>
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố!" }
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
              >
                {provinces?.map((province: any) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                disabled={!districts.length}
              >
                {districts?.map((district: any) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="ward"
              label="Xã/Phường"
              rules={[{ required: true, message: "Vui lòng chọn xã/phường!" }]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder="Chọn xã/phường"
                onChange={handleWardChange}
                disabled={!wards.length}
              >
                {wards?.map((ward: any) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            name="addressDetails"
            label="Địa chỉ cụ thể"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }
            ]}
          >
            <Input placeholder="Địa chỉ cụ thể" />
          </Form.Item>
          <Form.Item name="checked" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>
          {coordinates.lat !== null && coordinates.lng !== null && (
            <div className="">
              <div
                ref={mapContainerRef}
                style={{
                  width: "100%",
                  height: "30vh"
                }}
              />
            </div>
          )}

          <Form.Item className="flex justify-center">
            <Button htmlType="submit" className="h-10 mt-10 text-white bg-black">
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
