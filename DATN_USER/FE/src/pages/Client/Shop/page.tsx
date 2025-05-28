import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArrangeFilter from "./Filter/ArrangeFilter";
import MenuShop from "./MenuShop";
import Products_Shop from "./Products";

const IndexShops = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [cate_id, setCategoryId] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [priceRanges, setPriceRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm] = useState("");

  // Thêm useEffect để lắng nghe thay đổi của URL
  useEffect(() => {
    if (categoryFromUrl) {
      setCategoryId([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const handleCategorySelect = (id: string[]) => {
    setCategoryId(id);
  };

  // Các hàm xử lý khác giữ nguyên
  const handlePriceChange = (priceRanges: { min: number; max: number }[]) => {
    setPriceRanges(priceRanges);
  };

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
  };

  const handleSizeChange = (sizes: string[]) => {
    setSelectedSizes(sizes);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetSizeFilter = () => setSelectedSizes([]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

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
          <span className="mx-1 text-gray-500">&#10148;</span> Tất cả
        </div>
        <div className="xl:grid grid-cols-[18%_80%] justify-between">
          <MenuShop
            onCategorySelect={handleCategorySelect}
            onPriceChange={handlePriceChange}
            selectedColors={selectedColors}
            onColorChange={handleColorChange}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            resetSizeFilter={resetSizeFilter}
            onSizeChange={handleSizeChange}
            selectedCategories={cate_id} // Pass cate_id here
          />

          <div className="mb:w-[95%] pb-8 xl:w-full mb:mx-[2.5%] xl:mx-0">
            <ArrangeFilter
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
            <Products_Shop
              query={searchTerm}
              cate_id={cate_id}
              price_ranges={priceRanges}
              selectedColors={selectedColors}
              selectedSizes={selectedSizes}
              sortOption={sortOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexShops;
