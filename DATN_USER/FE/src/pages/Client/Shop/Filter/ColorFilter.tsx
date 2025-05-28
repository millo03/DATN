import React, { useState } from "react";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { SlArrowDown } from "react-icons/sl";

interface ColorFilterProps {
  selectedColor: string;
  onColorSearch: (color?: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  selectedColor,
  onColorSearch,
}) => {
  const [colorInput, setColorInput] = useState(selectedColor);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorInput(event.target.value);
  };

  const handleSearch = () => {
    if (colorInput.trim()) {
      onColorSearch(colorInput);
    } else {
      onColorSearch();
    }
  };

  const handleClear = () => {
    setColorInput("");
    onColorSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-2 border border-gray-200">
      <details className="group" open>
        <summary className="flex cursor-pointer items-center justify-between py-2 text-gray-900">
          <strong className="ml-3">Tìm kiếm màu</strong>
          <span className="shrink-0 transition duration-300 group-open:-rotate-180 mr-4">
            <SlArrowDown />
          </span>
        </summary>
        <div className="pt-2">
          <div className="relative flex items-center w-52 p-2">
            <input
              type="text"
              value={colorInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="border p-2 rounded-md flex-grow pl-10 w-20"
              placeholder="Nhập tên màu"
            />
            <button
              onClick={handleSearch}
              className="absolute left-4 text-gray-500"
            >
              <SearchOutlined />
            </button>
            {colorInput && (
              <button
                onClick={handleClear}
                className="absolute -right-3 text-gray-500"
              >
                <CloseCircleOutlined />
              </button>
            )}
          </div>
        </div>
      </details>
    </div>
  );
};

export default ColorFilter;
