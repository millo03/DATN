/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Dispatch_the_loai_thuoc_tinh, Lay_the_loai_thuoc_tinh } from "../../../../API/Dispatch/slice_attribute";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import { Button, Form, FormProps, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Modal_cpnt({ props }: any) {
    const location_url = useLocation();
    const urlParams = new URLSearchParams(location_url.search);
    const editId = urlParams.get('_id');
    const [user] = useLocalStorage("user", {});
    const { data, isLoading, isError } = Lay_the_loai_thuoc_tinh({
        id_account: user?.user?._id,
        id_thuoc_tinh: editId
    });
    const { mutate, isLoading: loading, isError: error } = Dispatch_the_loai_thuoc_tinh('EDIT')

    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name_attribute: data?.name_attribute
            });
        }
    }, [data, form]);

    const handleCancel = () => {
        const url_location: any = window.location;
        const url = new URL(url_location);
        url.searchParams.delete('_id');
        window.history.replaceState({}, '', url.toString());
        props?.setIsModalOpen(false);
    };

    const onFinish: FormProps<any>['onFinish'] = (values) => {
        console.log('Success:', values);
        const data_request = {
            id_loai_thuoc_tinh: editId,
            ...data,
            name_attribute: values?.name_attribute
        }
        mutate(data_request);
        props?.setIsModalOpen(false);
    };

    const onFinishFailed: FormProps<any>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    if (isError || error) return <span>Error...</span>;

    return (
        <div className={`${props?.isModalOpen ? 'translate-y-0' : 'translate-y-[-200%]'} fixed top-0 w-screen left-0 h-screen z-[100]`}>
            <div className={`bg-[#33333333] w-screen h-screen fixed top-0 left-0 z-[100]`} onClick={handleCancel}></div>
            <div className={`${props?.isModalOpen ? '-translate-y-1/2' : '-translate-y-[200%]'} duration-200 fixed top-1/3 left-1/2 -translate-x-1/2 w-auto py-5 px-10 rounded bg-white z-[110]`}>
                <span className="text-lg">Cập nhật loại thuộc tính {data?.name_attribute}</span>
                {
                    (isLoading || loading) &&
                    <div className="flex justify-center items-center h-screen">
                        < Spin indicator={<LoadingOutlined spin />} size="large" />
                    </div>
                }
                <Form className="mt-10"
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<any>
                        label="Tên loại: "
                        name="name_attribute"
                        rules={[{ required: true, message: 'Không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className="translate-x-[120%]">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    );
}
