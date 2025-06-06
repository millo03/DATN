/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Query_Products_Dashboard,
  useQueryProductsSearch,
} from "../../../common/hooks/Products/Products";
import { Button, Input, message, Pagination, Popconfirm, Spin } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Mutation_items } from "../../../common/hooks/Products/mutation_item";
import { AiOutlinePlus } from "react-icons/ai";
import Data_Table from "./_component/Data_Table";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
const ListProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = Mutation_items("REMOVE_and_REMOVE_MULTIPLE");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const { data, isLoading, isError } = Query_Products_Dashboard(
    +(searchParams?.get("_page") || 1)
  );

  const [searchName, setSearchName] = useState("");
  const { data: searchData } = useQueryProductsSearch(searchName);
  const onHandleSearch = () => {
    setSearchName(searchName.trim());
  };
  const handleRemoveMultiple = () => {
    const products = { productIds: selectedProductIds };
    mutate(products, {
      onSuccess: () => {
        messageApi.destroy()
        messageApi.open({
          type: "success",
          content: "Xóa thành công, bạn có thể khôi phục trong thùng rác!",
        });
        queryClient.invalidateQueries({
          queryKey: ["Product_Dashboard"],
        });
      },
      onError: (error: any) => {
        messageApi.open({
          type: "error",
          content: error?.message,
        });
      },
    });
  };

  function handle_page(i: number) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("_page", String(i));
    setSearchParams(newParams);
  }

  const handleCheckboxChange = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(
        selectedProductIds.filter((id) => id !== productId)
      );
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  if (isError) return <div>Lỗi!!</div>;
  return (
    <CheckAuths roles={["admin"]}>
      <>
        {contextHolder}

        <div className="mx-5">
          <div className="flex items-center justify-between mt-20 mb-5">
            <h1 className="text-2xl font-semibold">Quản Lý Sản Phẩm</h1>{" "}
            <Link to="/admin/products/add">
              <Button className="mr-[50px] px-[6px] h-[38px] text-[14px] font-semibold border-[#1976D2] text-[#1976D2]">
                <AiOutlinePlus className="ml-[3px]" /> Thêm mới sản phẩm
              </Button>
            </Link>
          </div>

          <div className="flex justify-between mb-2">
            <div className="space-x-5">
              {/* <Checkbox className="ml-4" />
            <Button>Chọn tất cả (7)</Button> */}
              {
                selectedProductIds?.length > 0 ?
                  <Popconfirm
                    title="Xóa sản phẩm "
                    description={`Bạn có muốn xóa ${selectedProductIds?.length} sản phẩm không?`}
                    onConfirm={handleRemoveMultiple}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button danger>
                      <DeleteOutlined style={{ fontSize: "24px" }} />
                      Xóa sản phẩm đã chọn
                    </Button>
                  </Popconfirm> :
                  <Button disabled>
                    <DeleteOutlined style={{ fontSize: "24px" }} />
                    Xóa sản phẩm đã chọn
                  </Button>
              }
            </div>
            <div className="flex space-x-5 mr-[50px]">
              <Input
                className="w-[400px]"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="nhâp tên sản phẩm để tìm kiếm..."
              />
              <Button onSubmit={() => onHandleSearch} type="primary">
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* <Table columns={columns} dataSource={dataSource} pagination={false} /> */}
          <Data_Table
            dataProps={{
              dataTable: searchName ? searchData : data?.docs,
              handleCheckboxChange: handleCheckboxChange,
              mutate: mutate,
            }}
          />
          <div className="grid my-2 mx-2 place-items-center">
            <Pagination
              defaultCurrent={data?.page}
              total={data?.totalDocs}
              onChange={(i) => handle_page(i)}
            />
          </div>
        </div>
      </>
    </CheckAuths>
  );
};

export default ListProduct;
