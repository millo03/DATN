import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Empty, Pagination, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import MenuShop from "../../../pages/Client/Shop/MenuShop";
import { useFilteredProducts } from "../../../common/hooks/Products/useFilterProducts";
import Products from "../Items/Products";
import ArrangeFilter from "../../../pages/Client/Shop/Filter/ArrangeFilter";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query: any = searchParams.get("keyword");

  // Các state lọc
  const [cate_id, setCategoryId] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<any>("");

  const itemsPerPage = 16;

  // Dữ liệu sản phẩm đã lọc
  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useFilteredProducts(
    query,
    cate_id,
    priceRanges, // Truyền priceRanges vào hook để lọc sản phẩm theo giá
    selectedColors,
    selectedSizes,
    currentPage,
    itemsPerPage,
    sortOption
  );
  const handleCategorySelect = (_id: string[]) => {
    setCategoryId(_id);
    setCurrentPage(1); // Reset về trang 1
  };

  const handlePriceChange = (priceRanges: { min: number; max: number }[]) => {
    setPriceRanges(priceRanges);
    setCurrentPage(1); // Reset về trang 1
  };

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
    setCurrentPage(1); // Reset về trang 1
  };

  const handleSizeChange = (sizes: string[]) => {
    setSelectedSizes(sizes);
    setCurrentPage(1); // Reset về trang 1
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1); // Reset về trang 1
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const totalItems = results?.pagination.totalItems || 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  if (isError) return <div>Có lỗi xảy ra: {error?.message}</div>;

  return (
    <div className="lg:mt-[40px] mt-[60px]">
      <div className="max-w-[1440px] w-[95vw] mx-auto">
        <div className="text-sm py-6 bg-[#F3F3F3] font-medium px-[2.5%] rounded">
          <Link to={`/`} className="text-gray-500 hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-1 text-gray-500">&#10148;</span>
          <Link to={`/shops`} className="text-gray-500 hover:text-black">
            Sản phẩm
          </Link>
          <span className="mx-1 text-gray-500">&#10148;</span> Kết quả tìm kiếm
          cho "{query}"
        </div>

        <div className="xl:grid grid-cols-[21%_76%] justify-between">
          <MenuShop
            onCategorySelect={handleCategorySelect}
            onPriceChange={handlePriceChange} // Truyền hàm xử lý thay đổi giá vào MenuShop
            selectedColors={selectedColors}
            onColorChange={handleColorChange}
            selectedSizes={selectedSizes}
            toggleSize={(size) => handleSizeChange([size])} // Truyền lại các giá trị kích thước
            resetSizeFilter={() => setSelectedSizes([])}
            onSizeChange={handleSizeChange}
            selectedCategories={cate_id}
          />
          <div className="mb:w-[95%] xl:w-full mb:mx-[2.5%] xl:mx-0">
            <ArrangeFilter
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
            {results?.data?.length ? (
              <>
                <div className="grid grid-cols-2 gap-6 my-4 lg:grid-cols-4">
                  {results.data.map((product: any) => (
                    <Products key={product._id} items={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalItems > 0 && (
                  <div className="flex justify-center my-6">
                    <Pagination
                      current={currentPage}
                      pageSize={itemsPerPage}
                      total={totalItems}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <Empty className="my-5" description="Không có sản phẩm nào" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
