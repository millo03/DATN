/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Select } from 'antd';
import { Filed_form } from './filed_form';
import { DeleteOutlined } from '@ant-design/icons';

export default function Bien_the_trang_update({ props }: any) {
  return (
    <Form.List
      name="attributes"
      initialValue={props?.data_one_item?.data?.product?.attributes?.values}
    >
      {(fields, { add, remove }) => {
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
                            className="flex items-center gap-[13px] mb-2 -mt-2 *:whitespace-nowrap"
                          >
                            <div>
                              <label className="text-[#1C2434] font-medium text-sm whitespace-nowrap">
                                Kích cỡ :
                              </label>
                              <Form.Item
                                {...restSizeField}
                                name={[sizeName, "name_size"]}
                              >
                                <Select
                                  className=" mt-2 h-[40px] max-w-[200px] text-[#1C2434] border-gray-600 !outline-none "
                                  options={props?.sizes.map((size: any) => ({
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
                            {/* <div className='max-w-20'>
                              <label className="text-sm font-medium">
                                {" "}
                                Ưu đãi (%) :
                              </label>
                              <Filed_form
                                props={{
                                  name_field: [
                                    sizeName,
                                    "sale"
                                  ],
                                  ruler_field: [
                                    {
                                      required: true,
                                      message:
                                        "Ưu đãi tối thiểu bằng 0!"
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
                                  restField: restSizeField
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                {" "}
                                Giá ưu đãi :
                              </label>
                              <Filed_form
                                props={{
                                  name_field: [
                                    sizeName,
                                    "price_sale"
                                  ],
                                  ruler_field: [
                                    {
                                      required: true,
                                      message:
                                        "Giá ưu đãi tối thiểu bằng 0!"
                                    },
                                    {
                                      type: "number",
                                      min: 0,
                                      message:
                                        "Giá ưu đãi sản phẩm phải là số dương!",
                                      transform(value: number) {
                                        return Number(value);
                                      }
                                    }
                                  ],
                                  restField: restSizeField
                                }}
                              />
                            </div> */}
                            <DeleteOutlined
                              onClick={() => removeSize(sizeName)}
                              style={{ fontSize: "20px" }}
                              className='text-red-500'
                            />
                          </div>
                        )
                      )}
                      <div className="flex flex-col items-start gap-4 mb-4">
                        <Button
                          type="primary"
                          onClick={() => addSize()}
                          className="px-2 "
                        >
                          Thêm kích thước
                        </Button>
                        <Button
                          onClick={() => remove(name)}
                          className="px-2 bg-red-600 text-gray-100 hover:!text-gray-100 border-none hover:!bg-red-700 hover"
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
              Thêm thuộc tính
            </Button>
          </>
        );
      }}
    </Form.List>
  )
}