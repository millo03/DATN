import React from "react";
import CategoryFilter from "./Filter/CategoryFilter";
import PriceFilter from "./Filter/PriceFilter";
import ColorFilter from "./Filter/ColorFilter";
import SizeFilter from "./Filter/SizeFilter";
import useAttributes from "../../../common/hooks/Attributes/useAttributesQuery";
import { useCategoryQuery } from "../../../common/hooks/Category/useCategoryQuery";
import { Spin } from "antd";

interface MenuShopProps {
  onCategorySelect: (ids: string[]) => void;
  onPriceChange: (priceRanges: { min: number; max: number }[]) => void;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  resetSizeFilter: () => void;
  onSizeChange: (sizes: string[]) => void;
  selectedCategories: string[]; // Thêm prop để nhận danh mục đã chọn
}

const MenuShop: React.FC<MenuShopProps> = ({
  onCategorySelect,
  onPriceChange,
  selectedColors,
  onColorChange,
  selectedSizes,
  toggleSize,
  resetSizeFilter,
  onSizeChange,
  selectedCategories, // Nhận danh mục đã chọn từ cha
}) => {
  const { data: categoryData } = useCategoryQuery();
  const { sizes, loading, error } = useAttributes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  if (error) return <p>Error: {error}</p>;

  const handleCategoryChange = (selectedCategories: string[]) => {
    onCategorySelect(selectedCategories);
  };
  const handleColorSearch = (color?: string) => {
    if (color) {
      onColorChange([color]);
    } else {
      onColorChange([]);
    }
  };

  return (
    <div className="lg:block w-full flex flex-col my-10">
      {/* Bộ lọc danh mục */}
      <div className="w-full bg-gray-50 *:rounded">
        <CategoryFilter
          categories={categoryData || []}
          onCategorySelect={handleCategoryChange}
          selectedCategories={selectedCategories} // Truyền danh mục đã chọn
        />
      </div>

      {/* Bộ lọc giá */}
      <div className="w-full bg-gray-50 mt-2 *:rounded">
        <PriceFilter onPriceChange={onPriceChange} />
      </div>

      {/* Bộ lọc màu */}
      <div className="w-full bg-gray-50 mt-2 *:rounded">
        <ColorFilter
          selectedColor={selectedColors.join(", ")} // Truyền selectedColors vào
          onColorSearch={handleColorSearch} // Truyền hàm tìm kiếm màu sắc
        />
      </div>

      {/* Bộ lọc kích thước */}
      <div className="w-full bg-gray-50 mt-2 *:rounded">
        <SizeFilter
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          resetSizeFilter={resetSizeFilter}
          onSizeChange={onSizeChange}
          sizeOptions={sizes}
        />
      </div>
    </div>
  );
};

export default MenuShop;
