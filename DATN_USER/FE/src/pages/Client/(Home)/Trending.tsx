import Products from "../../../components/common/Items/Products";
import { Query_Products } from "../../../common/hooks/Products/Products";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Carousel } from "antd";
import { IProduct } from "../../../common/interfaces/Product";
import { ICategory } from "../../../common/interfaces/Category";
import { useCategoryQuery } from "../../../common/hooks/Category/useCategoryQuery";

const Trending_Products = () => {
  const { data, isLoading } = Query_Products();
  const { data: categories } = useCategoryQuery();

  const visibleCategories =
    categories?.filter((category: ICategory) => category.published) || [];
  const filteredProducts = data?.filter((product: IProduct) =>
    visibleCategories.some(
      (category: ICategory) => category._id === product.category_id
    )
  );

  return (
    <div className="py-16 overflow-hidden text-center border-b">
      <div className="text-center flex flex-col items-center mb-[30px]">
        <span className="text-[32px] tracking-wide capitalize">
          Sản phẩm nổi bật
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <>
          {filteredProducts?.length === 0 ? (
            <div className="flex items-center justify-center">
              <img
                src="../../src/assets/Images/Products/no-data.png"
                alt="Không có sản phẩm"
              />
            </div>
          ) : (
            <div className="mb-[20px]">
              <Carousel
                autoplay
                dots={true}
                autoplaySpeed={2000}
                arrows={true}
                className="px-1 py-4"
                slidesToShow={4}
                centerMode={false}
                infinite={true}
              >
                {filteredProducts
                  ?.filter((item: IProduct) => item.featured_product)
                  .map((item: IProduct) => (
                    <div key={item._id} className="p-4">
                      <Products items={item} />
                    </div>
                  ))}
              </Carousel>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Trending_Products;
