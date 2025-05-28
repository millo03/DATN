/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Select, Spin } from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Filed_form } from "./filed_form";
import { Lay_thuoc_tinh } from "../../../../API/Dispatch/slice_attribute";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";

const Filed_bien_the_dua_theo_thuoc_tinh = ({ props }: any) => {
  const [user] = useLocalStorage("user", "");
  const { data, isLoading } = Lay_thuoc_tinh({
    id_account: user?.user?._id,
    category_attribute: props?.category_attribute,
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  const initialAttributes =
    data?.map((item: any) => ({
      color: item?.ten_thuoc_tinh || "",
      symbol: item?.symbol_thuoc_tinh,
      size: [
        {
          name_size: "",
          stock_attribute: 0,
          price_attribute: 0,
          // sale: 0
        },
      ],
    })) || [];
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  return (
    <Form.List
      name={`attributes_${props?.category_attribute}`}
      initialValue={initialAttributes}
    >
      {(fields, { remove, ...restField }) => (
        <div className="mt-4">
          <div className="text-[#1C2434] font-medium text-sm">Thuộc tính</div>
          {fields.map(({ key, name }) => (
            <div key={key}>
              <div className="flex gap-x-4">
                <Filed_form
                  props={{
                    name_field: [name, "color"],
                    ruler_field: [
                      {
                        required: true,
                        message: "Vui lòng nhập màu sắc!",
                      },
                    ],
                    restField: restField,
                    disable: true,
                  }}
                />
                {data?.map(
                  (item: any, index: number) =>
                    item?.the_loai_thuoc_tinh === "ux_image" && (
                      <div key={index}>
                        <img
                          className="rounded"
                          width={50}
                          height={50}
                          src={item?.symbol_thuoc_tinh}
                        />
                      </div>
                    )
                )}
              </div>
              <div className="invisible mb-[-15%]">
                <Filed_form
                  props={{
                    name_field: [name, "symbol"],
                    restField: restField,
                  }}
                />
              </div>
              <Form.List name={[name, "size"]} initialValue={[{}]}>
                {(sizeFields, { add: addSize, remove: removeSize }) => (
                  <div className="mt-20">
                    {sizeFields.map(
                      ({ key: sizeKey, name: sizeName, ...restSizeField }) => (
                        <div key={sizeKey} className="flex items-center gap-3">
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
                                options={
                                  props?.sizes?.map((size: any) => ({
                                    label: size,
                                    value: size,
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
                                name_field: [sizeName, "stock_attribute"],
                                ruler_field: [
                                  {
                                    required: true,
                                    message: "Số lượng là bắt buộc!",
                                  },
                                  {
                                    type: "number",
                                    min: 0,
                                    message: "Số lượng phải là số dương!",
                                    transform(value: number) {
                                      return Number(value);
                                    },
                                  },
                                ],
                                restField: restSizeField,
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
                                name_field: [sizeName, "price_attribute"],
                                ruler_field: [
                                  {
                                    required: true,
                                    message: "Giá sản phẩm bắt buộc nhập!",
                                  },
                                  {
                                    type: "number",
                                    min: 0,
                                    message: "Giá sản phẩm phải là số dương!",
                                    transform(value: number) {
                                      return Number(value);
                                    },
                                  },
                                ],
                                restField: restSizeField,
                              }}
                            />
                          </div>
                          {/* <div>
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
                                                    </div> */}
                          <DeleteOutlined
                            onClick={() => removeSize(sizeName)}
                            style={{ fontSize: "20px" }}
                          />
                        </div>
                      )
                    )}
                    <div className="flex flex-col items-start gap-4">
                      <Button
                        type="primary"
                        onClick={() => addSize()}
                        className="px-2 "
                      >
                        Thêm kích thước
                      </Button>
                      {fields?.length > 1 && (
                        <Button
                          onClick={() => remove(name)}
                          className="px-2  bg-red-600 text-gray-100 hover:!text-gray-100 border-none hover:!bg-red-700 hover"
                        >
                          Xóa biến thể
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Form.List>
            </div>
          ))}
        </div>
      )}
    </Form.List>
  );
};

export default Filed_bien_the_dua_theo_thuoc_tinh;
