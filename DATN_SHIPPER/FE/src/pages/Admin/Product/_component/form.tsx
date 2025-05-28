import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormProps, Select, Upload } from "antd";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { AiFillBackward } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useCategoryQuery } from "../../../../common/hooks/Category/useCategoryQuery";
import useHookForm from "../../../../common/hooks/form/My_form";
import { ICategory } from "../../../../common/interfaces/Category";
import { IAttribute } from "../../../../common/interfaces/Product";
import { Filed_form } from "./filed_form";

type FieldType = {
  name_product: string;
  price_product: number;
  description_product: string;
  category_id: string[];
  image_product: string;
  gallery_product: string[];
  stock: number;
  attributes: IAttribute[];
  featured_product: boolean;
  tag_product: string[];
};

const Form_Item = ({ mode }: any) => {
  const [check_edit_form, setCheckEditForm] = useState<boolean>(true);
  const [status_attr, setStatus_Attr] = useState(true);
  let image_item: any;
  const gallery_item: any = [];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // hooks
  const {
    onSubmit,
    isPending,
    isError,
    handleImageChange,
    handleGalleryChange,
    loading,
    data_one_item
  } = useHookForm({ mode });

  const { data, refetch } = useCategoryQuery();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    onSubmit(values);
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

  if (data_one_item?.isPending) {
    return (
      <div className="fixed bg-[#17182177] w-screen h-screen top-0 right-0"></div>
    );
  }

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

  const initialAttributes =
    data_one_item?.data?.product?.attributes?.values || [];
  const initialValues = {
    ...data_one_item?.data?.product,
    attributes: initialAttributes.map((attr: IAttribute) => ({
      ...attr,
      size: attr.size || [{}]
    }))
  };

  const onFormValuesChange = () => {
    setCheckEditForm(false);
  };

  return (
    <div className="relative text-[#1C2434] min-h-[90vh] mt-[100px] mx-6">
      {(isPending || loading) && (
        <div className="fixed z-[10] bg-[#17182177] w-screen h-screen top-0 right-0 grid place-items-center">
          <div className="animate-spin">
            <Loader />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-5 -mt-5">
        <h1 className="text-[26px] font-semibold">
          {mode ? "Cập nhật sản phẩm" : "Thêm Mới Sản Phẩm"}
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
        <div className="grid grid-cols-[60%,40%] gap-8">
          <div>
            <div>
              {" "}
              <label className="text-sm font-medium ">Tên sản phẩm</label>
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
            <div className="">
              {" "}
              <label htmlFor="" className="text-[#1C2434] font-medium text-sm">
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
            {status_attr && (
              <>
                <label className="text-[#1C2434] font-medium text-sm">
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
                <label className="text-[#1C2434] font-medium text-sm">
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
            )}

            <label className="text-[#1C2434]font-medium text-sm">
              Mô tả sản phẩm
            </label>
            <Filed_form
              props={{
                name_field: "description_product",
                action: "textarea"
              }}
            />
            <Form.List
              name="attributes"
              initialValue={data_one_item?.data?.product?.attributes?.values}
            >
              {(fields, { add, remove }) => {
                fields.length > 0
                  ? setStatus_Attr(false)
                  : setStatus_Attr(true);
                return (
                  <>
                    <div className="text-[#1C2434] font-medium text-sm">
                      Thuộc tính sản phẩm
                    </div>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key}>
                        <label
                          htmlFor=""
                          className="text-[#1C2434] font-medium text-sm"
                        >
                          Màu :
                        </label>
                        <Filed_form
                          props={{
                            name_field: [name, "color"],
                            ruler_field: [
                              {
                                required: true,
                                message: "Vui lòng nhập màu sắc!"
                              }
                            ],
                            restField: restField
                          }}
                        />
                        <Form.List name={[name, "size"]} initialValue={[{}]}>
                          {(
                            sizeFields,
                            { add: addSize, remove: removeSize }
                          ) => (
                            <>
                              {sizeFields.map(
                                ({
                                  key: sizeKey,
                                  name: sizeName,
                                  ...restSizeField
                                }) => (
                                  <div
                                    key={sizeKey}
                                    className="flex items-center gap-[13px] mb-2 -mt-2"
                                  >
                                    <div>
                                      <label className="text-[#1C2434] font-medium text-sm">
                                        Kích cỡ :
                                      </label>
                                      <Form.Item
                                        {...restSizeField}
                                        name={[sizeName, "name_size"]}
                                      >
                                        <Select
                                          className=" mt-2 h-[40px] max-w-[200px] text-[#1C2434] border-gray-600 !outline-none "
                                          options={sizes.map((size) => ({
                                            label: size,
                                            value: size
                                          }))}
                                          placeholder="Chọn kích cỡ"
                                        />
                                        {/* <Input className=" mt-2 py-2 max-w-[200px] text-[#1C2434] border-gray-600 !outline-none " /> */}
                                      </Form.Item>
                                    </div>
                                    <div>
                                      <label className="text-[#1C2434] font-medium text-sm">
                                        Số lượng :
                                      </label>
                                      <Filed_form
                                        props={{
                                          name_field: [
                                            sizeName,
                                            "stock_attribute"
                                          ],
                                          ruler_field: [
                                            {
                                              required: true,
                                              message: "Số lượng là bắt buộc!"
                                            },
                                            {
                                              type: "number",
                                              min: 0,
                                              message:
                                                "Số lượng phải là số dương!",
                                              transform(value: number) {
                                                return Number(value);
                                              }
                                            }
                                          ],
                                          restField: restSizeField
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">
                                        {" "}
                                        Giá :
                                      </label>
                                      <br />
                                      <Filed_form
                                        props={{
                                          name_field: [
                                            sizeName,
                                            "price_attribute"
                                          ],
                                          ruler_field: [
                                            {
                                              required: true,
                                              message:
                                                "Giá sản phẩm bắt buộc nhập!"
                                            },
                                            {
                                              type: "number",
                                              min: 0,
                                              message:
                                                "Giá sản phẩm phải là số dương!",
                                              transform(value: number) {
                                                return Number(value);
                                              }
                                            }
                                          ],
                                          restField: restSizeField
                                        }}
                                      />
                                    </div>
                                    <DeleteOutlined
                                      onClick={() => removeSize(sizeName)}
                                      style={{ fontSize: "20px" }}
                                    />
                                  </div>
                                )
                              )}
                              <div className="flex items-center gap-4 mb-4">
                                <Button
                                  type="primary"
                                  onClick={() => addSize()}
                                  className="px-2 "
                                >
                                  Thêm kích cỡ
                                </Button>
                                <Button
                                  onClick={() => remove(name)}
                                  className="px-2  bg-red-600 text-gray-100 hover:!text-gray-100 border-none hover:!bg-red-700 hover"
                                >
                                  Xóa thuộc tính
                                </Button>
                              </div>
                            </>
                          )}
                        </Form.List>
                      </div>
                    ))}
                    <Button
                      className="px-2 my-4"
                      type="primary"
                      onClick={() => add()}
                    >
                      Thêm options
                    </Button>
                  </>
                );
              }}
            </Form.List>
            <Form.Item<FieldType>
              name="featured_product"
              valuePropName="checked"
            >
              <Checkbox className="text-[#1C2434]">Sản phẩm nổi bật</Checkbox>
            </Form.Item>
          </div>
          <div>
            <div className="flex flex-col items-start justify-between gap-4">
              <div>
                <label className=" text-[#1C2434] font-medium text-sm">
                  Ảnh sản phẩm
                </label>
                <Form.Item<FieldType>
                  name="image_product"
                  initialValue={{
                    ...data_one_item?.data?.product?.image_product
                  }}
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
                <Form.Item<FieldType>
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
        {isError && (
          <span className="text-red-500">
            Lỗi! Vui lòng kiểm tra và thử lại!
          </span>
        )}
        <Form.Item>
          {check_edit_form ? (
            <Button type="primary" htmlType="button" className="bg-gray-300">
              {isPending || loading
                ? "Loading"
                : mode
                ? "Cập nhật sản phẩm"
                : "Tạo mới sản phẩm"}
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              {isPending || loading
                ? "Loading"
                : mode
                ? "Cập nhật sản phẩm"
                : "Tạo mới sản phẩm"}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
export default Form_Item;
