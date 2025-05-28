import React, { useState } from "react";
import { Form, Modal, Input, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../../../configs/axios";

type FieldType = {
  fullName?: string;
  phone?: string;
  email?: string;
};

interface AddShipperFormProps {
  open: boolean;
  onClose: () => void;
}

const AddShipperForm: React.FC<AddShipperFormProps> = ({ open, onClose }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (formData: FieldType) => {
      try {
        return await instance.post(`/shippers`, formData);
      } catch (error: any) {
        throw new Error(error.response.data.message || error.message);
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Thêm mới người vận chuyển thành công",
      });
      form.resetFields();
      setConfirmLoading(false);
      queryClient.invalidateQueries({
        queryKey: [`shippers`],
      });
      onClose();
    },
    onError: (error) => {
      messageApi.open({
        type: "error",
        content: error?.message,
      });
      setConfirmLoading(false);
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true);
      mutate(values);
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Thêm mới người giao hàng"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onClose}
      >
        <Form
          form={form}
          name="addShipper"
          layout="vertical"
          onFinish={handleOk}
          disabled={confirmLoading}
        >
          <Form.Item<FieldType>
            label="Tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập tên người vận chuyển" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống!" },
              { type: "email", message: "Email không đúng định dạng" },
              () => ({
                validator(_, value) {
                  if (!value || /^[^\u00C0-\u1EF9]+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Email không được chứa ký tự có dấu!")
                  );
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddShipperForm;
