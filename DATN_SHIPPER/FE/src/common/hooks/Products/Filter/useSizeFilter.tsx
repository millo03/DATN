import { useState } from "react";

const useSizeFilter = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const resetSizeFilter = () => {
    setSelectedSizes([]);
  };

  return {
    selectedSizes,
    toggleSize,
    resetSizeFilter,
  };
};

export default useSizeFilter;
