import { Link } from "react-router-dom";
import { Mutation_Notification, Query_notification } from "../../_lib/React_Query/Notification/Query"
import useLocalStorage from "../../common/hooks/Storage/useStorage";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin } from "antd";
import { useListAllShipper } from "../../common/hooks/Shipper/querry_shipper";

export default function Notification() {
    const [user] = useLocalStorage("user", {});
    const userId = user?.user?._id;
    const role = user?.user?.role;
    const { mutate: remove } = Mutation_Notification("Remove");
    const { data, isLoading } = Query_notification(userId, role);
    const { data: shipper } = useListAllShipper()
    let courier: any;
    let fullName: any
    shipper?.shippers.map((b: any) => {
        fullName = b.fullName
        courier = b.role
    })
    const { mutate } = Mutation_Notification("Send");
    const allSend = data?.notifications?.every((item: any) => item.status_notification === true);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }
    return (
        <div className="m-4 space-y-4 text-sm">
            <div className="flex justify-between">
                <strong className="text-lg">Thông báo của bạn</strong>
                <Button onClick={() => mutate(undefined)} disabled={allSend} className="ml-4" type="primary">Đọc tất cả</Button>
            </div>
            {
                data?.notifications?.length > 0 ?
                    data?.notifications?.map((item: any) =>
                        <details onClick={() => mutate(item._id)} open className="group rounded-lg bg-gray-100 p-6 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <div className="flex gap-4">
                                    <h2 className="font-medium">
                                        {item?.userId?.role === "admin"
                                            ? "Seven"
                                            : item?.userId?.role === "user"
                                                ? item?.userId?.userName
                                                : courier === "courier" ? "Seven" : ''}
                                    </h2>
                                    <span>{item.status_notification === false ? <EyeInvisibleOutlined style={{ fontSize: "18px" }} /> : <EyeOutlined style={{ color: 'orange', fontSize: "18px" }} />}</span>
                                </div>
                                <span className="relative size-5 shrink-0">
                                    <button >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute inset-0 size-5 opacity-100 group-open:opacity-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>
                                    <button>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute inset-0 size-5 opacity-0 group-open:opacity-100"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </button>

                                </span>
                            </summary>
                            <div className="flex items-end justify-between gap-x-10">
                                <div>
                                    <p className="mt-4 leading-relaxed text-gray-700">
                                        {item?.message}
                                    </p>
                                    {role === "admin" ? (item?.different && <Link to={`/admin/orders/${item?.different}`} className="mt-4 leading-relaxed text-sky-500 underline">
                                        Chi tiết
                                    </Link>
                                    ) : (
                                        <Link to={`/profile/order/${item?.different}`} className="mt-4 leading-relaxed text-sky-500 underline">
                                            Chi tiết
                                        </Link>
                                    )}

                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="leading-relaxed text-gray-700">
                                        {item?.createdAt?.slice(0, 10)}
                                    </p>
                                    |
                                    <Popconfirm
                                        title="Xóa thông báo "
                                        description="Bạn có chắc chắn muốn xóa thông báo này không?"
                                        onConfirm={() => remove(item._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </div>
                            </div>
                        </details>
                    )
                    :
                    <div className="grid place-items-center w-full h-[70vh]">
                        <span>Không có thông báo nào!</span>
                    </div>
            }
        </div >
    )
}
