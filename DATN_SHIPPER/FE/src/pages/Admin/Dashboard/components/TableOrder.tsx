import { Pagination, Table } from "antd";
import { Link } from "react-router-dom";
import { ColumnType, SortOrder } from "antd/es/table/interface";
import { IOrder } from "../../../../common/interfaces/Orders";
import { use10NewOrderInDay } from "../../../../common/hooks/Order/querry_Order";
import { Ellipsis_horizontal } from "../../../../components/common/Client/_component/Icons";

const TableOrder = () => {
  const { data: dataOrder } = use10NewOrderInDay();

  const formatDate = (datetime: any) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return date.toLocaleDateString("vi-VN"); // Định dạng ngày tháng theo chuẩn Việt Nam
  };

  const dataSort = dataOrder?.map((order: any) => ({
    key: order._id,
    ...order
  }));

  const createFilters = (order: IOrder[]) => {
    return order
      .map((order: IOrder) => order.orderNumber)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      )
      .map((orderNumber: string) => ({
        text: orderNumber,
        value: orderNumber
      }));
  };

  const columns: ColumnType<IOrder>[] = [
    {
      title: "Mã đơn",
      dataIndex: "orderNumber",
      key: "orderNumber",
      filterSearch: true,
      filters: dataOrder ? createFilters(dataOrder) : [],
      onFilter: (value: string | any, record: IOrder) => {
        const filterValue = value as string;
        return record.orderNumber.includes(filterValue);
      },
      sorter: (a: IOrder, b: IOrder) =>
        a.orderNumber.localeCompare(b.orderNumber),
      sortDirections: ["ascend", "descend"] as SortOrder[],
      render: (_: any, order: any) => (
        <p className="font-bold">{order?.orderNumber}</p>
      )
    },
    {
      title: "Người Mua",
      dataIndex: "userName",
      key: "userName",
      render: (_: any, order: any) => <p>{order?.customerInfo?.userName}</p>
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      render: (_: any, order: any) => <p>{order?.customerInfo?.phone}</p>
    },
    {
      title: "Ngày Đặt",
      dataIndex: "datetime",
      key: "datetime",
      render: (_: any, order: any) => <p>{formatDate(order?.createdAt)}</p>
    },
    {
      title: "Hình Thức",
      dataIndex: "payment",
      key: "payment",
      render: (_: any, order: any) => <p>{order?.customerInfo?.payment}</p>
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, order: any) => {
        return (
          <>
            {order?.cancellationRequested ? (
              order?.cancelledByAdmin ? (
                <p className="text-blue-700">Đã xác nhận yêu cầu</p>
              ) : (
                <p className="text-yellow-600">Yêu cầu gửi lên</p>
              )
            ) : order?.status == 1 ? (
              <p className="text-gray-500">Chờ xác nhận</p>
            ) : order?.status == 2 ? (
              <p className="text-yellow-500">Đang chuẩn bị hàng</p>
            ) : order?.status == 3 ? (
              <p className="text-blue-500">Đang vận chuyển</p>
            ) : order?.status == 4 ? (
              <p className="text-green-600">Đã giao hàng</p>
            ) : (
              <p className="text-red-600">Đã hủy</p>
            )}
          </>
        );
      }
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Thao Tác",
      render: (_: any, orders: any) => (
        <Link to={`/admin/orders/${orders._id}/orderDetali`}>
          <span className="flex justify-center">
            <Ellipsis_horizontal />
          </span>
        </Link>
      )
    }
  ];

  return (
    <div className="">
      <Table columns={columns} dataSource={dataSort} pagination={false} />
    </div>
  );
};

export default TableOrder;
