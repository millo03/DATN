/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormProps, Select, Upload } from "antd";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AiFillBackward } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useCategoryQuery } from "../../../../common/hooks/Category/useCategoryQuery";
import useHookForm from "../../../../common/hooks/form/My_form";
import { ICategory } from "../../../../common/interfaces/Category";
import { IAttribute } from "../../../../common/interfaces/Product";
import { Filed_form } from "./filed_form";
import { SelectShadcn, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../../../../components/ui_shadcn_customer/select';
import Form_variant from "./form-variant";
import Bien_the_trang_update from "./bien-the-trang-cap-nhat";

const Form_Item = ({ mode }: any) => {
  const [check_edit_form, setCheckEditForm] = useState<boolean>(true);
  let image_item: any;
  const gallery_item: any = [];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // hooks
  const {
    onSubmit,
    isLoading,
    isError,
    handleImageChange,
    handleGalleryChange,
    loading,
    data_one_item
  } = useHookForm({ mode });

  const { data } = useCategoryQuery();
  const [form] = Form.useForm();
  const [statusOptions, setStatusOptions] = useState<any>('no-variant');
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const attributeNames = [
      "attributes_ux_image",
      "attributes_ux_color",
      "attributes_ux_label",
      "new_attributes"
    ];
    const attributeKey = attributeNames.find((key) => values?.[key]);
    let data_request = attributeKey
      ? { ...values, attributes: values[attributeKey] }
      : values;
    if (attributeKey) {
      const { [attributeKey]: _, ...rest } = data_request;
      console.log(_)
      data_request = rest;
    }
    onSubmit(data_request);
  };
  useEffect(() => {
    if (data_one_item?.data?.product?.category_id) {
      const invalidCategory = !data?.some(
        (category: ICategory) =>
          category._id === data_one_item.data.product.category_id
      );
      if (invalidCategory) {
        form.setFieldsValue({ category_id: [] }); // Clear invalid category
      }
    }
  }, [data, data_one_item, form]);

  if (mode && data_one_item?.data?.product?.image_product) {
    image_item = [
      {
        uid: "-1",
        name: "",
        status: "done",
        url:
          data_one_item?.data?.product?.image_product &&
          data_one_item?.data?.product?.image_product
      }
    ];
    data_one_item?.data?.product?.gallery_product?.map(
      (uri_gallery: string | undefined, index: number) => {
        gallery_item.push({
          uid: index,
          name: "image.png",
          status: "done",
          url: uri_gallery && uri_gallery
        });
      }
    );
  }
  const initialValues = useMemo(() => {
    const initialAttributes =
      data_one_item?.data?.product?.attributes?.values || [];
    if (data_one_item?.data?.product) {
      return {
        ...data_one_item?.data?.product,
        attributes: initialAttributes.map((attr: IAttribute) => ({
          ...attr,
          size: attr.size || [{}]
        }))
      };
    }
    return {}
  }, [data_one_item])
  const onFormValuesChange = () => {
    setCheckEditForm(false);
  };
  if (data_one_item?.isLoading) {
    return <div className="fixed z-[10] bg-[#17182177] w-screen h-screen top-0 right-0 grid place-items-center">
      <div className="animate-spin">
        <Loader />
      </div>
    </div>
  }
  return (
    <div className="relative text-[#1C2434] min-h-[90vh] mt-10 mx-6">
      {(isLoading || loading) && (
        <div className="fixed z-[10] bg-[#17182177] w-screen h-screen top-0 right-0 grid place-items-center">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[26px] font-semibold">
          {mode ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}
        </h1>
        <Link to="/admin/products">
          <Button type="primary">
            <AiFillBackward /> Quay lại
          </Button>
        </Link>
      </div>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
        onValuesChange={onFormValuesChange}
      >
        <div className="grid grid-cols-[70%,auto] gap-8">
          <div>
            <div className="bg-gray-50 rounded-t p-4">
              {" "}
              <label className="text-sm font-semibold">Tên sản phẩm</label>
              <Filed_form
                props={{
                  name_field: "name_product",
                  ruler_field: [
                    {
                      required: true,
                      message: "Tên sản phẩm bắt buộc nhập!",
                      whitespace: true
                    }
                  ]
                }}
              />
            </div>
            <div className="bg-gray-50 px-4 pb-4">
              {" "}
              <label className="text-[#1C2434] font-semibold text-sm">
                Danh mục
              </label>
              <Form.Item
                className="mt-2"
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: "Danh mục sản phẩm bắt buộc chọn!",
                    whitespace: true
                  }
                ]}
              >
                <Select
                  className="t-2 *:py-2 max-w-[200px] *:!text-[#1C2434] border-gray-600 !outline-none hover:bg-[#F5F7FD] focus:bg-[#F5F7FD] active:bg-[#F5F7FD]"
                  allowClear
                  options={data?.map((category: ICategory) => ({
                    value: category._id,
                    label: category.name_category
                  }))}
                ></Select>
              </Form.Item>
            </div>
            <div className="bg-gray-50 rounded-b pb-4 px-4 mb-4">
              <label className="text-[#1C2434] font-semibold text-sm">
                Mô tả sản phẩm
              </label>
              <Filed_form
                props={{
                  name_field: "description_product",
                  action: "textarea"
                }}
              />
            </div>
            <div className='w-full bg-gray-50 rounded *:p-4'>
              <section className='w-full border-b flex items-center gap-10'>
                <strong>Dữ liệu sản phẩm</strong>
                {
                  !mode &&
                  <div className="*:rounded">
                    <SelectShadcn onValueChange={(value: any) => setStatusOptions(value)}>
                      <SelectTrigger className="!h-auto pt-2 mt-1">
                        <SelectValue placeholder="Sản phẩm đơn giản" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-[10]">
                        <SelectGroup>
                          <SelectItem value="variant">Sản phẩm có biến thể</SelectItem>
                          <SelectItem value="no-variant">Sản phẩm đơn giản</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </SelectShadcn>
                  </div>
                }
              </section>
              {/* --- */}
              {
                mode ?
                  <Bien_the_trang_update props={{
                    data_one_item: data_one_item?.data?.product?.attributes?.values,
                    sizes
                  }} /> :
                  (statusOptions === 'no-variant') && <div className='grid grid-cols-[auto_90%] text-gray-800 items-center'>
                    <>
                      <label className="text-[#1C2434] font-medium text-sm whitespace-nowrap">
                        Giá sản phẩm
                      </label>
                      <Filed_form
                        props={{
                          name_field: "price_product",
                          ruler_field: [
                            {
                              required: true,
                              message: "Giá sản phẩm bắt buộc nhập!"
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Giá sản phẩm phải là số dương!",
                              transform(value: number) {
                                return Number(value);
                              }
                            }
                          ],
                          action: "price"
                        }}
                      />
                      <label className="text-[#1C2434] font-medium text-sm whitespace-nowrap mr-4">
                        Số lượng sản phẩm
                      </label>
                      <Filed_form
                        props={{
                          name_field: "stock",
                          ruler_field: [
                            {
                              required: true,
                              message: "Số lượng sản phẩm bắt buộc nhập!"
                            },
                            {
                              type: "number",
                              min: 0,
                              message: "Số lượng sản phẩm phải là số dương!",
                              transform(value: number) {
                                return Number(value);
                              }
                            }
                          ],
                          action: "price"
                        }}
                      />
                    </>
                  </div>}
              {
                (statusOptions === 'variant') &&
                <Form_variant propsData={{
                  sizes,
                }} />
              }
              <div className="max-w-[150px] whitespace-nowrap">
                <label className="text-sm font-medium">
                  {" "}
                  Ưu đãi (%) :
                </label>
                <Filed_form
                  props={{
                    name_field: "sale",
                    ruler_field: [
                      {
                        required: true,
                        message: "Ưu đãi sản phẩm bắt buộc phải nhập!"
                      },
                      {
                        type: "number",
                        min: 0,
                        max: 50,
                        message:
                          "Ưu đãi sản phẩm phải là số dương nhỏ hơn 50!",
                        transform(value: number) {
                          return Number(value);
                        }
                      }
                    ],
                  }}
                />
              </div>
            </div>
            <Form.Item<any>
              name="featured_product"
              valuePropName="checked"
            >
              <Checkbox className="text-[#1C2434]">Sản phẩm nổi bật</Checkbox>
            </Form.Item>
          </div>
          <div>
            <div className="flex flex-col items-start justify-between gap-4 bg-gray-50 p-4">
              <div>
                <label className=" text-[#1C2434] font-medium text-sm">
                  Ảnh sản phẩm
                </label>
                <Form.Item<any>
                  name="image_product"
                  // initialValue={mode && {
                  //   ...data_one_item?.data?.product?.image_product
                  // }}
                  rules={[
                    {
                      required: true,
                      message: "Ảnh sản phẩm là bắt buộc!"
                    }
                  ]}
                >
                  <Upload
                    defaultFileList={mode && image_item}
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
                </Form.Item>
              </div>
              <div>
                <label className=" text-[#1C2434] font-medium text-sm">
                  Bộ sưu tập
                </label>
                <Form.Item<any>
                  name="gallery_product"
                  rules={[
                    {
                      required: true,
                      message: "Bộ sưu tập sản phẩm là bắt buộc!"
                    }
                  ]}
                >
                  <Upload
                    defaultFileList={mode && gallery_item}
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={handleGalleryChange}
                    multiple={true}
                    className="mt-2"
                  >
                    <button type="button">
                      <PlusOutlined />
                    </button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        {
          isError && (
            <span className="text-red-500">
              Lỗi! Vui lòng kiểm tra và thử lại!
            </span>
          )
        }
        <Form.Item>
          {check_edit_form ? (
            <Button disabled={true} htmlType="button">
              {isLoading || loading
                ? "Loading"
                : mode
                  ? "Cập nhật sản phẩm"
                  : "Tạo mới sản phẩm"}
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              {isLoading || loading
                ? "Loading"
                : mode
                  ? "Cập nhật sản phẩm"
                  : "Tạo mới sản phẩm"}
            </Button>
          )}
        </Form.Item>
      </Form >
    </div >
  );
};
export default Form_Item;


//  leader vừa bảo tôi làm thêm cái giá sale, theo ông thì làm phần trăm hay fix cứng