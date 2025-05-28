/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dispatch_thuoc_tinh, Lay_thuoc_tinh } from "../../../../API/Dispatch/slice_attribute";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import { Button, Form, FormProps, Input, Spin, Upload } from "antd";
import { SketchPicker } from "react-color";
import { LoadingOutlined } from "@ant-design/icons";
import { FilePenLine } from "lucide-react";
import { UploadImage } from "../../../../systems/utils/uploadImage";


export default function Edit_thuoc_tinh({ props }: any) {
    const location_url = useLocation();
    const urlParams = new URLSearchParams(location_url.search);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const editId = urlParams.get('_id');
    const [symbol, setSymbol] = useState<string>('');
    const [user] = useLocalStorage("user", {});
    const { data, isLoading, isError } = Lay_thuoc_tinh({
        id_account: user?.user?._id,
        id_thuoc_tinh: editId
    });
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [status_change_img, setStatus_change_img] = useState<boolean>(false);
    const { mutate, isLoading: loading, isError: error } = Dispatch_thuoc_tinh('EDIT')
    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ten_thuoc_tinh: data?.ten_thuoc_tinh
            });
            const fileList = [{
                uid: '-1',
                name: 'image.jpg',
                status: 'done',
                url: data?.symbol_thuoc_tinh,
            }];
            form.setFieldsValue({
                symbol_thuoc_tinh: fileList,
            });
            setImageFile(data?.symbol_thuoc_tinh)
        }
    }, [data, form]);
    console.log(imageFile)
    const handleCancel = () => {
        const url_location: any = window.location;
        const url = new URL(url_location);
        url.searchParams.delete('_id');
        window.history.replaceState({}, '', url.toString());
        props?.setIsModalOpen(false);
    };

    const handleImageChange = (imageItem: any) => {
        const files =
            imageItem?.fileList?.map((file: any) => file.originFileObj) || [];
        setImageFile(files);
        setStatus_change_img(true);
    };

    const onFinish: FormProps<any>['onFinish'] = async (values) => {
        let imageUrl = '';
        if (status_change_img) {
            if (data?.the_loai_thuoc_tinh === 'ux_image') {
                setLoadingUpload(true);
                imageUrl = await UploadImage(imageFile[0]);
                setLoadingUpload(false)
            }
        }
        console.log(symbol)
        const data_request = {
            _id: editId,
            ...data,
            ten_thuoc_tinh: values?.ten_thuoc_tinh,
            symbol_thuoc_tinh: data?.the_loai_thuoc_tinh === 'ux_image' ? (status_change_img ? imageUrl
                : data?.symbol_thuoc_tinh) : data?.the_loai_thuoc_tinh === 'ux_color' ? (symbol ? symbol : data?.symbol_thuoc_tinh) : ''
        }
        mutate(data_request);
        props?.setIsModalOpen(false);
    };

    const onFinishFailed: FormProps<any>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleSetColor = (color: any) => {
        setSymbol(color.hex);
    }
    {
        (isLoading) &&
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
    }
    if (isError || error) return <span>Error...</span>;
    return (
        <div className={`${props?.isModalOpen ? 'translate-y-0' : 'translate-y-[-200%]'} fixed top-0 w-screen left-0 h-screen z-[100]`}>
            <div className={`bg-[#33333333] w-screen h-screen fixed top-0 left-0 z-[100]`} onClick={handleCancel}></div>
            {(loading || loadingUpload) &&
                <div className="fixed bg-[#33333333] z-[200] top-0 left-0 w-screen flex justify-center items-center h-screen">
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
            }
            <div className={`${props?.isModalOpen ? '-translate-y-1/2' : '-translate-y-[200%]'} fixed duration-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto py-5 px-14 rounded bg-white z-[110]`}>
                <span className="text-lg font-semibold">Cập nhật thuộc tính {data?.ten_thuoc_tinh}</span>
                <Form className="mt-10"
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<any>
                        label="Tên thuộc tính"
                        name="ten_thuoc_tinh"
                        rules={[{ required: true, message: 'Không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {
                        data?.the_loai_thuoc_tinh === 'ux_color' &&
                        <div className='flex flex-col gap-y-2 mb-6'>
                            <span>Chọn màu sắc:</span>
                            <div style={{
                                backgroundColor: symbol
                            }} className={`w-16 h-10 rounded border`}></div>
                            <div className='flex gap-4'>
                                <SketchPicker
                                    color={symbol}
                                    onChangeComplete={handleSetColor} />
                            </div>
                        </div>
                    }
                    {
                        data?.the_loai_thuoc_tinh === 'ux_image' &&
                        <Form.Item<any>
                            name="symbol_thuoc_tinh">
                            <Upload
                                defaultFileList={[{
                                    uid: '-1',
                                    name: 'image.jpg',
                                    status: 'done',
                                    url: data?.symbol_thuoc_tinh,
                                }]}
                                listType="picture-card"
                                beforeUpload={() => false}
                                onChange={handleImageChange}
                                className="mt-2"
                                maxCount={1}>
                                <button type="button">
                                    <FilePenLine />
                                </button>
                            </Upload>
                        </Form.Item>
                    }
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className="translate-x-[120%]">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}