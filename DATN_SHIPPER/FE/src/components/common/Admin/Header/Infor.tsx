import { Button, Form, Input } from "antd";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const Infor = ({ onFinish, data, togglePopup }: any) => {
  const [isChanged, setIsChanged] = useState(false);
  const onValuesChange = (changedValues: any) => {
    // Nếu có sự thay đổi nào trong form
    setIsChanged(true);
  };
  return (
    <div className="bg-white shadow-lg p-8 rounded-lg w-1/2 overflow-y-auto h-4/5 text-center">
      <div className="text-right">
        <button
          onClick={togglePopup}
          className="  hover:underline text-2xl text-black"
        >
          <IoCloseSharp />
        </button>
      </div>
      <div className="flex items-center justify-center">
        <img
          src={data?.avatar}
          alt=""
          className="rounded-full w-[200px] h-[200px] shadow-lg"
        />{" "}
        <br />
      </div>
      <span>{data?.fullName || "not found"}</span>
      <Form
        name="basic"
        autoComplete="off"
        layout="vertical"
        className="space-y-4"
        onFinish={onFinish}
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
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Email" name="email">
          <Input className="h-[50px]" />
        </Form.Item>

        <Form.Item name="address" label="Thành phố">
          <Input className="h-[50px]" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input className="h-[50px]" />
        </Form.Item>

        <Form.Item label="Số CCCD" name="number_citizen">
          <Input className="h-[50px] " disabled />
        </Form.Item>

        <Form.Item name="vehicle" label="Phương tiện di chuyển">
          <Input className="h-[50px]" />
        </Form.Item>

        <Form.Item name="bankAccountName" label="Tên ngân hàng nhận lương">
          <Input className="h-[50px]" disabled />
        </Form.Item>

        <Form.Item name="bankAccountNumber" label="Số tài khoản ngân hàng">
          <Input className="h-[50px]" disabled />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-[100px] h-[40px]"
            disabled={!isChanged}
          >
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Infor;
