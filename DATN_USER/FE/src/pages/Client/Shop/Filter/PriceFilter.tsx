import React, { useCallback } from "react";
import { SlArrowDown } from "react-icons/sl";
import usePriceFilter from "../../../../common/hooks/Products/Filter/usePriceFilter";

interface PriceFilterProps {
  onPriceChange: (priceRanges: { min: number; max: number }[]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ onPriceChange }) => {
  // const { selectedPriceRanges, handlePriceChange, resetPriceFilter } =
  const { selectedPriceRanges, handlePriceChange } = usePriceFilter();

  // Kiểm tra xem khoảng giá có được chọn không
  const isPriceRangeSelected = useCallback(
    (min: number, max: number) => {
      return selectedPriceRanges.some((range) =>
        max === Infinity
          ? range.min === min && range.max === Infinity
          : range.min === min && range.max === max
      );
    },
    [selectedPriceRanges]
  );

  // Xử lý thay đổi khoảng giá
  const handlePriceChangeToggle = useCallback(
    (min: number, max: number) => {
      const newPriceRanges = isPriceRangeSelected(min, max)
        ? selectedPriceRanges.filter(
            (range) =>
              !(range.min === min && (range.max === max || max === Infinity))
          )
        : [...selectedPriceRanges, { min, max }];

      // Cập nhật trạng thái chọn khoảng giá
      handlePriceChange(min, max);
      onPriceChange(newPriceRanges);
    },
    [
      handlePriceChange,
      onPriceChange,
      selectedPriceRanges,
      isPriceRangeSelected,
    ]
  );

  // Xử lý đặt lại bộ lọc
  // const handleResetClick = useCallback(() => {
  //   resetPriceFilter();
  //   onPriceChange([]);
  // }, [resetPriceFilter, onPriceChange]);

  return (
    <div className="border border-gray-200">
      <details
        className="group [&_summary::-webkit-details-marker]:hidden *:px-4"
        open
      >
        <summary className="flex cursor-pointer items-center justify-between py-2 text-gray-900">
          <strong>Giá </strong>
          <span className="shrink-0 transition duration-300 group-open:-rotate-180">
            <SlArrowDown />
          </span>
        </summary>
        <div className="w-full bg-white rounded-md">
          <div className="py-5 px-3">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="price-0-150k"
                checked={isPriceRangeSelected(0, 150000)}
                onChange={() => handlePriceChangeToggle(0, 150000)}
                className="mr-2"
              />
              <label htmlFor="price-0-150k" className="text-gray-700 text-lg">
                $0 - $150K
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="price-150k-200k"
                checked={isPriceRangeSelected(150000, 200000)}
                onChange={() => handlePriceChangeToggle(150000, 200000)}
                className="mr-2"
              />
              <label
                htmlFor="price-150k-200k"
                className="text-gray-700 text-lg"
              >
                $150K - $200K
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="price-200k-300k"
                checked={isPriceRangeSelected(200000, 300000)}
                onChange={() => handlePriceChangeToggle(200000, 300000)}
                className="mr-2"
              />
              <label
                htmlFor="price-200k-300k"
                className="text-gray-700 text-lg"
              >
                $200K - $300K
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="price-300k-above"
                checked={isPriceRangeSelected(300000, Infinity)}
                onChange={() => handlePriceChangeToggle(300000, Infinity)}
                className="mr-2"
              />
              <label
                htmlFor="price-300k-above"
                className="text-gray-700 text-lg"
              >
                Trên $300K
              </label>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default PriceFilter;
