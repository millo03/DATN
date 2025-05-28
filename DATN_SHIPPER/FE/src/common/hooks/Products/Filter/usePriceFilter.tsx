import { useState } from "react";

interface PriceRange {
  min: number;
  max: number;
}

const usePriceFilter = () => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>(
    []
  );

  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (min: number, max: number) => {
    setSelectedPriceRanges((prev) => {
      // Tạo khoảng giá mới
      const newRange = { min, max };

      // Kiểm tra nếu khoảng giá mới đã tồn tại trong danh sách được chọn
      const isRangeSelected = prev.some(
        (range) => range.min === min && (range.max === max || max === Infinity)
      );

      if (isRangeSelected) {
        // Nếu đã chọn thì loại bỏ khoảng giá
        return prev.filter(
          (range) =>
            !(range.min === min && (range.max === max || max === Infinity))
        );
      } else {
        // Nếu chưa chọn thì thêm khoảng giá vào danh sách
        return [...prev, newRange];
      }
    });
  };

  // Đặt lại bộ lọc
  const resetPriceFilter = () => {
    setSelectedPriceRanges([]);
  };

  return {
    selectedPriceRanges,
    handlePriceChange,
    resetPriceFilter,
  };
};

export default usePriceFilter;
