import { useMutation } from "@tanstack/react-query";
import type { FormProps, GetProp, UploadFile, UploadProps } from "antd";
import { Button, Form, Image, Input, message, Modal, Popconfirm } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mutation_Cart } from "../../../../common/hooks/Cart/mutation_Carts";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import { IOrder } from "../../../../common/interfaces/Orders";
import {
  Car,
  TotalPrice
} from "../../../../components/common/Client/_component/Icons";
import instance from "../../../../configs/axios";

type FieldType = {
  contentReview?: string;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Complete = ({ dataProps }: any) => {
  const [openReviewOrderId, setOpenReviewOrderId] = useState<string | null>(
    null
  );
  const [openReview, setOpenReview] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const [reviewedOrders, setReviewedOrders] = useState<{
    [orderId: string]: Set<string>;
  }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navi = useNavigate();
  const account = user?.user;
  // const CLOUD_NAME = "dwya9mxip";
  // const PRESET_NAME = "upImgProduct";
  // const FOLDER_NAME = "PRODUCTS";
  // const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // const handlePreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as FileType);
  //   }
  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  // };

  // const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
  //   setFileList(newFileList);

  // const uploadButton = (
  //   <button style={{ border: 0, background: "none" }} type="button">
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Thêm ảnh</div>
  //   </button>
  // );

  // Định nghĩa useMutation để thêm đánh giá
  const { mutate: addReview } = useMutation({
    mutationFn: async (reviewData: {
      contentReview: string;
      productId: string;
      imagesReview: string[];
    }) => {
      const { data } = await instance.post(
        `/review/${userId}/${reviewData.productId}`, // Chỉnh sửa URL nếu cần
        {
          contentReview: reviewData.contentReview,
          imagesReview: reviewData.imagesReview
        }
      );
      return data;
    },
    onSuccess: () => {
      message.success("Thêm thành công");
      setOpenReview(false); // Đóng form sau khi thêm thành công
      setReviewedOrders((prev) => ({
        ...prev,
        [openReviewOrderId!]: new Set([
          ...Array.from(prev[openReviewOrderId!] || []),
          currentProductId!
        ])
      })); // Cập nhật danh sách sản phẩm đã đánh giá trong đơn hàng
    },
    onError: () => {
      message.error("Thêm thất bại");
    }
  });

  // Định nghĩa useMutation để thêm đánh giá

  // Khi nhấn vào nút đánh giá, lưu orderId và productId vào state
  const handleOpenReview = (orderId: string, productId: string) => {
    if (reviewedOrders[orderId]?.has(productId)) {
      navi(`/shops/${productId}`); // Điều hướng đến trang chi tiết sản phẩm khi đã đánh giá
    } else if (openReviewOrderId === orderId) {
      setOpenReview(!openReview);
    } else {
      setOpenReview(true);
      setOpenReviewOrderId(orderId);
    }
    setCurrentProductId(productId);
  };

  // Gọi mutate với productId khi form được submit
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Submitting review for productId:", currentProductId);
    console.log(userId);
    console.log("Form values:", values);

    if (currentProductId) {
      addReview({
        contentReview: values.contentReview || "",
        productId: currentProductId,
        imagesReview: fileList.map((file) => file.url as string) // Gửi URL ảnh lên server
      });
    }
  };

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

  return (
    <>
      {!dataProps || dataProps.length === 0 ? (
        <div className="flex justify-center items-center">
          <img
            src="../../src/assets/Images/Products/no-data.png"
            alt="Không có sản phẩm"
          />
        </div>
      ) : (
        <div>
          {dataProps.map((item: IOrder) => (
            // console.log(item)

            <div className="my-4 px-2" key={item._id}>
              <div className="flex gap-2 py-5 border-b-2 justify-between">
                <Link
                  to={`/profile/order/${item._id}`}
                  className="py-2 px-4 bg-[#222222] text-white text-[12px] lg:text-sm rounded"
                >
                  Xem ngay
                </Link>
                <div className="flex">
                  <a href="" className="flex items-center">
                    <Car />
                    {Number(item.status) === 4 && (
                      <span className="text-[12px] lg:text-sm pl-[10px] text-[#26aa99]">
                        Đã giao hàng
                      </span>
                    )}
                  </a>
                </div>
              </div>

              <div>
                {item.items.map((product: any) => (
                  <div
                    className="flex flex-row gap-4 py-[12px] w-full"
                    key={product.productId?._id}
                  >
                    <div className="basis-24">
                      <img
                        src={product?.productId?.image_product}
                        className="w-full h-[80px]"
                        alt=""
                      />
                    </div>
                    <div className="pr-2 basis-full">
                      <h2 className="w-full text-sm lg:text-[16px]">
                        {product?.productId?.name_product}
                      </h2>
                      <div className="flex justify-between gap-2 py-2">
                        <p className="text-xs lg:text-sm text-[#0000008a] ">
                          <p>
                            Phân loại:{" "}
                            <span className="font-bold">
                              {product?.color_item} - {product?.name_size}
                            </span>
                          </p>
                        </p>
                        <div className="text-sm">
                          x <span>{product.quantity}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end lg:justify-between gap-2">
                        <span className="border border-[#26aa99] rounded w-full lg:w-[25%] text-center text-xs lg:text-sm p-1 text-[#26aa99] order-2 lg:order-1">
                          Trả hàng miễn phí 15 ngày
                        </span>
                        <p className="flex gap-2 text-sm lg:text-[18px] text-orange-400 order-1 lg:order-2">
                          <s className="text-black">₫45.000 </s>
                          {product?.price_item?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="py-3 px-2 flex justify-end items-center border-t border-b border-[#eaeaea]">
                  <div className="flex items-center gap-1">
                    <TotalPrice />
                    <p>
                      Thành tiền :{" "}
                      <span className="lg:text-lg text-sm text-[#f68e56]">
                        {item.totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND"
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full py-4 px-2">
                  <p className="lg:basis-9/12 text-[#0000008A] text-[12px]">
                    Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được
                    giao đến bạn và sản phẩm nhận được không có vấn đề nào.
                  </p>
                  <div className="flex gap-3 lg:basis-3/12 w-full">
                    {item?.items?.map((product: any) => (
                      <Button
                        type="default"
                        className="bg-stone-300 w-full h-10 lg:w-[50%] text-white text-[12px] rounded"
                        onClick={() =>
                          handleOpenReview(
                            item._id,
                            item.items[0]?.productId?._id
                          )
                        }
                      >
                        {reviewedOrders[item._id]?.has(
                          item.items[0]?.productId?._id || ""
                        )
                          ? "Xem đánh giá"
                          : "Đánh giá"}
                      </Button>
                    ))}

                    {openReview && openReviewOrderId === item._id && (
                      <div>
                        <Modal
                          open={openReview}
                          onCancel={() => setOpenReview(false)}
                          footer={null}
                          width={600}
                        >
                          <h1 className="text-2xl font-semibold mb-4 text-center">
                            ĐÁNH GIÁ SẢN PHẨM
                          </h1>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-[50px] h-[50px]">
                              <img
                                src={item.items[0]?.productId?.image_product}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>{item.items[0]?.productId?.name_product}</div>
                          </div>
                          <Form onFinish={onFinish}>
                            <Form.Item
                              name="contentReview"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập nội dung đánh giá!"
                                }
                              ]}
                            >
                              <Input.TextArea
                                rows={4}
                                placeholder="Nhập nội dung đánh giá"
                              />
                            </Form.Item>
                            {/* <Form.Item>
                              <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleChange}
                                onPreview={handlePreview}
                                customRequest={async ({ file, onSuccess }) => {
                                  const formData = new FormData();
                                  formData.append("file", file as File);
                                  formData.append("upload_preset", PRESET_NAME);
                                  formData.append("folder", FOLDER_NAME);
                                  try {
                                    const response = await fetch(api, {
                                      method: "POST",
                                      body: formData,
                                    });
                                    const result = await response.json();
                                    const url = result.secure_url;
                                    file.url = url;
                                    onSuccess?.();
                                  } catch (error) {
                                    console.error("Upload error:", error);
                                  }
                                }}
                              >
                                {fileList.length >= 8 ? null : uploadButton}
                              </Upload>
                            </Form.Item> */}
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Gửi đánh giá
                              </Button>
                            </Form.Item>
                          </Form>
                          <Modal
                            open={previewOpen}
                            footer={null}
                            onCancel={() => setPreviewOpen(false)}
                          >
                            <Image src={previewImage} />
                          </Modal>
                        </Modal>
                      </div>
                    )}

                    <Button className="bg-stone-300 w-full h-10 lg:w-[50%] text-white text-[12px] rounded">
                      Đã Nhận Hàng
                    </Button>
                    <Popconfirm
                      title="Mua lại đơn hàng?"
                      description="Bạn có chắc chắn muốn mua lại không?"
                      onConfirm={() => addCart(item?._id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button className="bg-red-500 w-full h-10 lg:w-[50%] text-white text-[12px] rounded">
                        Mua Lại
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Complete;
