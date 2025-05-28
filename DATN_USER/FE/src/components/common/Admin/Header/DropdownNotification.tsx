
import { Link } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import { EyeInvisibleOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Query_notification, Mutation_Notification } from "../../../../_lib/React_Query/Notification/Query";
import useLocalStorage from "../../../../common/hooks/Storage/useStorage";
import { useState } from "react";

const DropdownNotification = () => {
  const [user] = useLocalStorage("user", {});
  const userId = user?.user?._id;
  const role = user?.user?.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate: removeNotification } = Mutation_Notification("Remove");
  const { mutate: markAsRead } = Mutation_Notification("Send");
  const { data } = Query_notification(userId, role);

  const allRead = data?.notifications?.every((item: any) => item.status_notification === true);

  return (
    <div className="relative">
      <li>
        <Link onClick={() => {
          setDropdownOpen(!dropdownOpen);
        }}
          to="#"
          className="relative flex w-[34px] h-[34px] items-center justify-center rounded-full border-[0.5px] bg-[#EFF4FB]"
        >
          <span
            className={`absolute -top-0.5 right-0 z-[2] h-2 w-2 rounded-full bg-red-700`}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-75"></span>
          </span>

          <svg
            className="fill-[#677381] hover:fill-[#3C50E0] duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2.5 w-[320px] rounded-sm border border-stroke bg-white">
            <div className="flex justify-between px-5 py-3">
              <h5 className="text-[14px] font-semibold text-[#8A99AF]">Thông Báo</h5>
              <Button
                onClick={() => markAsRead(undefined)}
                disabled={allRead}
                size="small"
                type="primary"
              >
                Đọc tất cả
              </Button>
            </div>
            <ul className="max-h-[300px] flex-col overflow-y-auto">
              {data?.notifications?.length > 0 ? (
                data.notifications.map((item: any) => (
                  <li key={item._id} className="flex flex-col gap-3 border-t border-stroke px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <h2 className="text-sm font-medium text-black">
                          {item?.userId?.role === "admin"
                            ? "Seven"
                            : item?.userId?.role === "user"
                              ? item?.userId?.userName
                              : "Khác"}
                        </h2>
                        {item.status_notification ? (
                          <EyeOutlined style={{ color: "orange", fontSize: "18px" }} />
                        ) : (
                          <EyeInvisibleOutlined style={{ fontSize: "18px", color: "black" }} />
                        )}
                      </div>
                      <Popconfirm
                        title="Xóa thông báo"
                        onConfirm={() => removeNotification(item._id)}
                        okText="Yes"
                        cancelText="No"
                        className=" text-black"
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    </div>
                    <p className="text-sm text-gray-700">{item.message}</p>
                    <Link
                      to={
                        role === "admin"
                          ? `/admin/orders/${item?.different}`
                          : `/profile/order/${item?.different}`
                      }
                      className="text-sky-500 underline"
                    >
                      Chi tiết
                    </Link>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-center h-[200px] text-gray-500">
                  Không có thông báo nào!
                </li>
              )}
            </ul>
          </div>
        )}

      </li>
    </div>
  );
};

export default DropdownNotification;

