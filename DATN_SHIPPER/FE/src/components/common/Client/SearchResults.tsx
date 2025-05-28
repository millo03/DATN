/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Empty, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import MenuShop from "../../../pages/Client/Shop/MenuShop";
import { useFilteredProducts } from "../../../common/hooks/Products/useFilterProducts";
import Products from "../Items/Products";
import ArrangeFilter from "../../../pages/Client/Shop/Filter/ArrangeFilter";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query: any = searchParams.get("keyword");

  // Thêm các state mới cho việc lọc
  const [cate_id, setCategoryId] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<any>("");
  const itemsPerPage = 16; // Số lượng sản phẩm mỗi trang

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useFilteredProducts(
    query,
    cate_id,
    priceRanges,
    selectedColors,
    selectedSizes,
    sortOption
  );

  const totalPages = results
    ? Math.ceil(results.data.length / itemsPerPage)
    : 1;
  const hasMore = currentPage < totalPages;
  // Hàm xử lý cho MenuShop
  const handleCategorySelect = (id: string[]) => {
    setCategoryId(id);
  };

  const handlePriceChange = (priceRanges: { min: number; max: number }[]) => {
    setPriceRanges(priceRanges);
  };

  const handleColorChange = (colors: string[]) => setSelectedColors(colors);

  const handleSizeChange = (sizes: string[]) => setSelectedSizes(sizes);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetColorFilter = () => setSelectedColors([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  const resetSizeFilter = () => setSelectedSizes([]);

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
            onPriceChange={handlePriceChange}
            setSearch={() => {}}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            resetColorFilter={resetColorFilter}
            onColorChange={handleColorChange}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            resetSizeFilter={resetSizeFilter}
            onSizeChange={handleSizeChange}
          />
          <div className="mb:w-[95%] xl:w-full mb:mx-[2.5%] xl:mx-0">
            <ArrangeFilter
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
            {results && results?.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-6 my-4 lg:grid-cols-4">
                  {results?.data
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((product: any) => (
                      <Products key={product._id} items={product} />
                    ))}
                </div>

                {results.data.length > itemsPerPage && (
                  <div className="flex flex-col items-center my-4">
                    <div className="flex items-center mb-4 space-x-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={`px-4 py-2 border rounded-md ${
                          currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={currentPage === 1}
                      >
                        &#10094; Trang trước
                      </button>
                      <span className="text-lg font-semibold">
                        Trang {currentPage}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={`px-4 py-2 border rounded-md ${
                          !hasMore
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={!hasMore}
                      >
                        Trang tiếp theo &#10095;
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center space-x-2">
                      {totalPages > 1 &&
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 border rounded-md ${
                                currentPage === page
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-black hover:bg-gray-300"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                    </div>
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
