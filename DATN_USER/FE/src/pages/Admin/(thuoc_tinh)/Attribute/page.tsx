/* eslint-disable @typescript-eslint/no-explicit-any */
// import Table_cpnt from "./table_cpnt";
import { Link, useParams } from "react-router-dom";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import { Dispatch_thuoc_tinh, Lay_the_loai_thuoc_tinh, Lay_thuoc_tinh } from "../../../../API/Dispatch/slice_attribute";
import { Button, Form, FormProps, Input, Spin, Upload } from "antd";
import { SketchPicker } from 'react-color';
import { useState } from "react";
import Table_cpn from "./table_cpn";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadImage } from "../../../../systems/utils/uploadImage";
import { AiFillBackward } from "react-icons/ai";

export default function Attribute() {
  const [user] = useLocalStorage("user", {});
  const { id } = useParams();
  const [symbol, setSymbol] = useState<string>('');
  const [validate, setValidate] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const { data, isLoading, isError } = Lay_the_loai_thuoc_tinh({
    id_thuoc_tinh: id,
    id_account: user?.user?._id
  });
  const { mutate, status_api, isLoading: loading } = Dispatch_thuoc_tinh('CREATED');
  const { data: data_2, isLoading: loading_2 } = Lay_thuoc_tinh({
    id_account: user?.user?._id,
    category_attribute: data?.category_attribute
  });
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  if (isError) return <span>Error...</span>
  const handleImageChange = (imageItem: any) => {
    const files =
      imageItem?.fileList?.map((file: any) => file.originFileObj) || [];
    setImageFile(files);
  };
  const onFinish: FormProps<any>['onFinish'] = async (values) => {
    if (data?.category_attribute === 'ux_image') {
      setLoadingUpload(true);
      const imageUrl = await UploadImage(imageFile[0]);
      const data_request = {
        ten_thuoc_tinh: values?.ten_thuoc_tinh,
        the_loai_thuoc_tinh: data?.category_attribute,
        id_account: user?.user?._id,
        symbol_thuoc_tinh: imageUrl
      }
      setLoadingUpload(false)
      setValidate(false)
      if (!imageUrl) {
        setValidate(true)
      } else {
        mutate(data_request);
      }
    } else if (data?.category_attribute === 'ux_color') {
      const data_request = {
        ten_thuoc_tinh: values?.ten_thuoc_tinh,
        the_loai_thuoc_tinh: data?.category_attribute,
        id_account: user?.user?._id,
        symbol_thuoc_tinh: symbol
      }
      if (!symbol) {
        setValidate(true)
      }
      else {
        mutate(data_request);
      }
    } else {
      const data_request = {
        ten_thuoc_tinh: values?.ten_thuoc_tinh,
        the_loai_thuoc_tinh: data?.category_attribute,
        id_account: user?.user?._id,
        symbol_thuoc_tinh: ''
      }
      mutate(data_request);
    }
  };

  const onFinishFailed: FormProps<any>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleSetColor = (color: any) => {
    setSymbol(color.hex);
    setValidate(false)
  }
  return (
    <div className="px-10 pt-5">
      {
        loading && <div className="fixed bg-[#33333333] top-0 left-0 w-screen h-screen z-10 grid place-items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      }
      {
        isLoading && <div className="fixed bg-[#33333333] top-0 left-0 w-screen h-screen z-10 grid place-items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      }
      {
        loadingUpload && <div className="fixed bg-[#33333333] top-0 left-0 w-screen h-screen z-10 grid place-items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      }
      {
        loading_2 && <div className="fixed bg-[#33333333] top-0 left-0 w-screen h-screen z-10 grid place-items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      }

      <div className="flex justify-between items-center mb-8">
        <span className="text-xl font-semibold">Thuộc tính {data?.name_attribute}</span>
        <Link to="/admin/products/the_loai_thuoc_tinh">
          <Button type="primary">
            <AiFillBackward /> Quay lại
          </Button>
        </Link>
      </div>

      <section className="grid grid-cols-[35%_60%] justify-between">
        {/* cot trai */}
        <div className="mt-10">
          <div className="mb-3 text-lg">Thêm mới {data?.name_attribute}</div>
          <Form
            name="basic"
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex flex-col gap-1">
              <span>Tên thuộc tính :</span>
              <Form.Item<any>
                name="ten_thuoc_tinh"
                rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính!' }]}>
                <Input />
              </Form.Item>
            </div>
            {
              data?.category_attribute === 'ux_color' &&
              <div className='flex flex-col gap-y-2'>
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
              data?.category_attribute === 'ux_image' &&
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handleImageChange}
                className="mt-2"
                maxCount={1}
              >
                <button type="button">
                  <PlusOutlined />
                </button>
              </Upload>
            }
            {
              (data?.category_attribute === 'ux_color' || data?.category_attribute === 'ux_image') &&
              validate && <div className="text-red-500 text-sm mt-2">Vui lòng chọn</div>
            }
            {
              status_api === 400 && <div className="text-red-500 mt-5">Tên thuộc tính đã tồn tại!</div>
            }
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" className="-translate-x-[100px] mt-10">
                Tạo mới {data?.name_attribute}
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* cot phai */}
        <div>
          {
            data &&
            <Table_cpn data_props={data_2} />
          }
        </div>
      </section>
    </div>
  )
}