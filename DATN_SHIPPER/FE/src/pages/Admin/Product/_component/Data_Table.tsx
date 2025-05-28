import { Button, Checkbox, Popconfirm, Space } from "antd";
import { ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { FaEdit, FaRecycle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";

export default function Data_Table({ dataProps }: any) {
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return format(date, "HH:mm dd/MM/yyyy");
  };

  return (
    <>
      <div className="grid text-gray-900 grid-cols-[20px_70px_180px_150px_200px_150px_150px_120px] gap-x-4 items-center justify-between p-4 text-sm whitespace-nowrap">
        <div></div>
        <span>Ảnh</span>
        <span>Tên</span>
        <span>Thể loại</span>
        <span>Giá tiền</span>
        <span>Số lượng</span>
        <span>Thời gian tạo</span>
        <span>Thao tác</span>
      </div>
      {dataProps?.dataTable?.map((data: any) => {
        return (
          <div
            key={data?._id}
            className="flex flex-col w-full text-gray-800 border-t border-gray-300 text-sm"
          >
            <div className="grid grid-cols-[20px_70px_180px_150px_200px_150px_150px_120px] gap-x-4 items-center justify-between p-4">
              {/* checkbox */}
              <Checkbox
                onChange={() => dataProps?.handleCheckboxChange(data?._id)}
              ></Checkbox>
              {/* image */}
              <img
                width={100}
                height={100}
                className="rounded border"
                src={data?.image_product}
                alt="Loading..."
              />
              {/* name */}
              <span className="line-clamp-3">{data?.name_product}</span>
              {/* category */}
              <span className="line-clamp-2">
                {data?.category_id?.name_category}
              </span>
              {/* price */}
              <span className="line-clamp-2 text-red-500">
                {data?.price_product?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              {/* stock */}
              <span className="line-clamp-2">{data?.stock}</span>
              {/* create time */}
              {/* <span className="line-clamp-2">{data?.createdAt?.slice(0, 10)}</span> */}
              <span className="line-clamp-1">
                {formatDate(data?.createdAt)}
              </span>
              {/* options */}
              <div className="flex justify-center items-center gap-x-2 *:duration-200">
                {dataProps?.action === "recycle" ? (
                  <Space>
                    <Button
                      type="primary"
                      onClick={() =>
                        dataProps?.mutate({
                          action: "restore",
                          id_item: data._id,
                        })
                      }
                    >
                      <FaRecycle />
                    </Button>

                    <Popconfirm
                      title="Xóa vĩnh viễn sản phẩm"
                      description="Bạn chắc chắn muốn xóa vĩnh viễn sản phẩm này chứ?"
                      onConfirm={() => dataProps?.mutate(data._id!)}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>
                        <TiDelete />
                      </Button>
                    </Popconfirm>
                  </Space>
                ) : (
                  <Space>
                    <Button type="primary">
                      <Link to={`/admin/products/edit/${data._id}`}>
                        <FaEdit />
                      </Link>
                    </Button>
                    <Popconfirm
                      title="Xóa sản phẩm"
                      description="Bạn có muốn xóa sản phẩm này không ?"
                      onConfirm={() =>
                        dataProps?.mutate({
                          id_item: data._id,
                          action: "remove",
                        })
                      }
                      // onCancel={cancel}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button danger>
                        <FaDeleteLeft />
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              </div>
            </div>
            {/* options */}
            {data?.attributes && (
              <details
                className="group [&_summary::-webkit-details-marker]:hidden"
                open={true}
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-1 w-[100px] mx-auto ">
                  <span className="group-open:block hidden">Đóng</span>
                  <span className="group-open:hidden">Hiện</span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <ChevronUp className="h-4" />
                  </span>
                </summary>
                {data?.attributes &&
                  data?.attributes?.values?.map((item: any) =>
                    item?.size?.map((value: any) => (
                      <div
                        key={item?._id}
                        className="grid border-t duration-200 border-gray-300 gap-x-4 grid-cols-[180px_180px_180px_180px_100px_100px_150px_80px] 
                                                items-center text-start justify-between py-4"
                      >
                        <div></div>
                        {/* attributes */}
                        <div className="flex gap-x-2 w-full">
                          <span className="line-clamp-3">{item?.color}</span>,
                          <span className="line-clamp-3">
                            {value?.name_size}
                          </span>
                        </div>
                        {/* div giả */}
                        <div></div>
                        {/* price */}
                        <span className="line-clamp-1 text-red-600">
                          {value?.price_attribute?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                        {/* quantity */}
                        <div>
                          {value?.stock_attribute > 0 ? (
                            <span className="line-clamp-2">
                              {value?.stock_attribute}
                            </span>
                          ) : (
                            <span className="line-clamp-2 text-red-500">
                              Hết hàng!
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
              </details>
            )}
          </div>
        );
      })}
    </>
  );
}
