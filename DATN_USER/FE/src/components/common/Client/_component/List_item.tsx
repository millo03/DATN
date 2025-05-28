import { IProduct } from "../../../../common/interfaces/Product";
import Products from "../../Items/Products";

const List_item = ({ dataProps }: any) => {
  return (
    <div className="mx-auto my-8 grid grid-cols-2 lg:grid-cols-4 gap-6 ">
      {dataProps?.data?.map((item: IProduct) => {
        return <Products key={item._id} items={item} />;
      })}
    </div>
  );
};

export default List_item;
