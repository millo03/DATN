import React, { useState } from "react";
import { SlArrowDown } from "react-icons/sl";

interface SizeFilterProps {
  sizeOptions: string[];
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  resetSizeFilter: () => void;
  onSizeChange: (sizes: string[]) => void;
}

const SizeFilter: React.FC<SizeFilterProps> = ({
  sizeOptions,
  selectedSizes,
  toggleSize,
  // resetSizeFilter,
  onSizeChange,
}) => {
  const [isOpen, setIsOpen] = useState(true); // Mặc định mở

  // Hàm sắp xếp size theo thứ tự (tùy chỉnh theo yêu cầu)
  const sortedSizeOptions = sizeOptions.sort((a, b) => {
    // Ví dụ: sắp xếp theo thứ tự kích thước từ S đến XL
    const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });

  const handleSizeChange = (size: string) => {
    toggleSize(size);
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onSizeChange(updatedSizes);
  };

  return (
    <div className="border border-gray-200">
      <details
        className="group [&_summary::-webkit-details-marker]:block *:px-4"
        open={isOpen} // Luôn mở mặc định
      >
        <summary className="flex cursor-pointer items-center justify-between py-2 text-gray-900 ">
          <strong>Kích cỡ</strong>
          <span className="shrink-0 transition duration-300 group-open:-rotate-180">
            <SlArrowDown />
          </span>
        </summary>

        {isOpen && (
          <div className="w-full bg-white  rounded-md">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-2">
              {sortedSizeOptions.length > 0 ? (
                sortedSizeOptions.map((size) => (
                  <li key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      id={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="mr-2"
                    />
                    <label htmlFor={size} className="text-gray-700 text-xl">
                      {size}
                    </label>
                  </li>
                ))
              ) : (
                <p className="px-4 py-2">Không có size</p>
              )}
            </ul>
          </div>
        )}
      </details>
    </div>
  );
};

export default SizeFilter;
