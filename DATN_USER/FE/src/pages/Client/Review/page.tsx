import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Button, Form, Image, Input, Upload } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mutation_Cart } from "../../../common/hooks/Cart/mutation_Carts";
import useLocalStorage from "../../../common/hooks/Storage/useStorage";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Layout_Review = ({ dataProps }: any) => {
  const navi = useNavigate();
  const [user] = useLocalStorage("user", {});
  const account = user?.user;
  const { mutate } = Mutation_Cart("ADD");
  const addCart = (orderId?: string | number) => {
    if (account) {
      const order = dataProps.find((i: any) => i?._id === orderId);
      if (order?.items) {
        for (let i = 0; i < order.items.length; i++) {
          const j = order.items[i];
          if (j.productId) {
            mutate({
              userId: account?._id,
              productId: j?.productId?._id,
              color: j?.color_item,
              size: j?.name_size,
              quantity: j?.quantity,
              price_item_attr: j?.price_item,
              image: j?.productId?.image_product,
              name: j?.productId?.name_product,
              _id: orderId
            });
          }
        }
      }
    } else {
      navi("/login");
    }
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  //   const {data} =

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </button>
  );
  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <div>
      <h1>ĐÁNH GIÁ SẢN PHẨM</h1>
      <div className="mt-[20px]">
        {/* {dataProps.map((item: IOrder) => (
          <div>
            {item.items.map((product: any) => (
              <div className="flex mt-[20px] mb-[20px] ">
                <div> {product?.productId?.image_product}</div>
                <div> {product?.productId?.name_product}</div>
              </div>
            ))}
          </div>
        ))} */}

        <div>
          <Form
            name="nest-messages"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name={["user", "introduction"]} label="Mô tả">
              <Input.TextArea
                rows={6}
                placeholder="Hãy chia sẻ chất lượng sản phẩm và trải nghiệm dịch vụ của bạn cho mọi người cùng biết nhé!"
              />
            </Form.Item>
            <div>
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage("")
                  }}
                  src={previewImage}
                />
              )}
            </div>
            <div className="flex">
              <Form.Item wrapperCol={{ offset: 10 }} className="mt-[20px]">
                <Button type="primary" htmlType="submit" className="h-[40px]">
                  TRỞ LẠI
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 10 }} className="mt-[20px]">
                <Button type="primary" htmlType="submit" className="h-[40px]">
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Layout_Review;
