/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spin } from "antd";
import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import { Query_Trash_Item } from "../../../common/hooks/Products/Products";
import { Mutation_items } from "../../../common/hooks/Products/mutation_item";
import Data_Table from "./_component/Data_Table";
import { LoadingOutlined } from "@ant-design/icons";

const TrashProduct = () => {
  // const formatDate = (dateString: any) => {
  //   const date = new Date(dateString);
  //   return format(date, "HH:mm dd/MM/yyyy");
  // };
  const { mutate } = Mutation_items("RESTORE_ITEM_and_DESTROY_ITEM");
  const { data, isLoading } = Query_Trash_Item();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  return (
    <CheckAuths roles={["admin"]}>
      {" "}
      <div>
        {/* <Table columns={columns} dataSource={dataSource} /> */}
        <Data_Table
          dataProps={{
            dataTable: data,
            mutate: mutate,
            action: "recycle",
          }}
        />
      </div>
    </CheckAuths>
  );
};

export default TrashProduct;
