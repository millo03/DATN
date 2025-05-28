import { LoadingOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Spin, Tooltip } from "antd";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { AiOutlineExport } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Query_Orders,
  useAllOrderSuccess,
  useSearchOrdersByNumberOrNumberPhone
} from "../../../common/hooks/Order/querry_Order";
import OrderTable from "./OrderTable";

const { Option } = Select;

const OrderList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialStatusFilter = queryParams.get("status") || "";
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [dataExport, setDataExport] = useState<any[]>([]);

  const { data: DataAllOrdersSuccess } = useAllOrderSuccess();
  const { data: searchData } =
    useSearchOrdersByNumberOrNumberPhone(searchOrder);
  const { data, isLoading, totalPages } = Query_Orders(
    undefined,
    currentPage,
    statusFilter
  );
  const dataSource = searchData || data;

  const handleSearch = () => setSearchOrder(searchOrder.trim());

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const query = new URLSearchParams();
    if (statusFilter) query.set("status", statusFilter);
    query.set("page", currentPage.toString());

    navigate(`?${query.toString()}`, { replace: true });
  }, [statusFilter, currentPage, navigate]);

  useEffect(() => {
    if (DataAllOrdersSuccess?.length) {
      const formattedData = DataAllOrdersSuccess.map((item: any) => ({
        number_order: item.orderNumber,
        name_customer: item.customerInfo?.userName || "N/A",
        number_phone_customer: item.customerInfo?.phone || "N/A",
        email_customer: item.customerInfo?.email || "N/A",
        address_customer: item.customerInfo?.address || "N/A",
        order_date: item.createdAt,
        order_success: item.deliveredAt || "Chưa giao",
        products: item.items?.map((p: any) => ({
          name_product: p.productId.name_product,
          price_product: p.total_price_item,
          quantity_product: p.quantity,
          classification_product: `${p.color_item} - ${p.name_size}`
        })),
        total_price_order: item.totalPrice
      }));
      setDataExport(formattedData);
    }
  }, [DataAllOrdersSuccess]);
  const [dataState, setDataState] = useState<any[]>([]);

  useEffect(() => {
    if (dataExport) {
      const tempData: any[] = [];

      dataExport.forEach((item, index) => {
        item.products.forEach((p: any) => {
          tempData.push({
            stt: index + 1,
            number_order: item.number_order,
            name_customer: item.name_customer,
            number_phone_customer: item.number_phone_customer,
            email_customer: item.email_customer,
            address_customer: item.address_customer,
            order_date: item.order_date,
            order_success: item.order_success,
            name_product: p.name_product,
            price_product: p.price_product,
            quantity_product: p.quantity_product,
            classification_product: p.classification_product,
            total_price_order: item.total_price_order
          });
        });
      });

      setDataState((prevData) => [...prevData, ...tempData]);
    }
  }, [dataExport]);

  const handleExport = async () => {
    const header = [
      "STT",
      "Mã đơn hàng",
      "Tên khách hàng",
      "Số điện thoại",
      "Email",
      "Địa chỉ",
      "Ngày đặt hàng",
      "Ngày hoàn thành",
      "Tên sản phẩm",
      "Giá sản phẩm",
      "Số lượng sản phẩm",
      "Phân loại sản phẩm",
      "Tổng đơn hàng"
    ];

    const worksheetData = dataState.map((row) => ({
      STT: row.stt,
      "Mã đơn hàng": row.number_order,
      "Tên khách hàng": row.name_customer,
      "Số điện thoại": row.number_phone_customer,
      Email: row.email_customer,
      "Địa chỉ": row.address_customer,
      "Ngày đặt hàng": row.order_date,
      "Ngày hoàn thành": row.order_success,
      "Tên sản phẩm": row.name_product,
      "Giá sản phẩm": row.price_product,
      "Số lượng sản phẩm": row.quantity_product,
      "Phân loại sản phẩm": row.classification_product,
      "Tổng đơn hàng": row.total_price_order
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header });

    const merges = [];
    let currentOrder = null;
    let startRow = null;

    // Tạo merge cells cho các cột thông tin đơn hàng
    dataState.forEach((row, index) => {
      if (row.number_order !== currentOrder) {
        if (startRow !== null) {
          // Thêm merge cho các cột
          for (let col = 0; col <= 7; col++) {
            // Cột từ STT đến Ngày hoàn thành
            merges.push({
              s: { r: startRow, c: col },
              e: { r: index - 1, c: col }
            });
          }
          merges.push({
            s: { r: startRow, c: 12 }, // Cột Tổng đơn hàng
            e: { r: index - 1, c: 12 }
          });
        }
        currentOrder = row.number_order;
        startRow = index;
      }
    });

    // Merge cuối cùng
    if (startRow !== null) {
      for (let col = 0; col <= 7; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: dataState.length - 1, c: col }
        });
      }
      merges.push({
        s: { r: startRow, c: 12 },
        e: { r: dataState.length - 1, c: 12 }
      });
    }

    worksheet["!merges"] = merges;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Dữ liệu đơn hàng hoàn thành"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "Dữ liệu đơn hàng hoàn thành.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div className="mx-6">
      <div className="flex items-center justify-between mt-20 mb-5">
        <h1 className="text-2xl font-semibold">Quản Lý Đơn Hàng</h1>
      </div>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2 ">
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-[200px] h-[40px]"
            placeholder="Lọc trạng thái"
          >
            <Option value="">Lọc trạng thái</Option>
            <Option value="1">Chờ xác nhận</Option>
            <Option value="2">Đang chuẩn bị hàng</Option>
            <Option value="3">Đang vận chuyển</Option>
            <Option value="4">Giao hàng thành công</Option>
            <Option value="5">Giao hàng thất bại</Option>
            <Option value="6">Hoàn thành</Option>
            <Option value="7">Đã hủy</Option>
          </Select>
          <div className="flex space-x-2">
            {" "}
            <Input
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              placeholder="Nhập mã đơn hàng hoặc số điện thoại để tìm kiếm..."
              className="w-[500px] h-10"
            />
            <Button
              onClick={handleSearch}
              type="primary"
              className="w-[100px] h-10"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
        <div className="flex space-x-5">
          <Popconfirm
            title="Xuất tất cả dữ liệu đơn hàng"
            description="Bạn có chắc chắn muốn xuất tất cả các đơn hàng ra file excel không? "
            onConfirm={handleExport}
            // onCancel={cancel}
            okText="Có "
            cancelText="Không"
          >
            <Tooltip placement="topLeft" title={"Xuất dữ liệu đơn hàng"}>
              <Button className="bg-[#13DEB9] text-[white] border-none h-10">
                <AiOutlineExport />
                Xuất dữ liệu
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
      <OrderTable
        orders={dataSource}
        refetch={Query_Orders}
        isLoading={isLoading}
        currentPage={currentPage}
        goToPage={goToPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default OrderList;
