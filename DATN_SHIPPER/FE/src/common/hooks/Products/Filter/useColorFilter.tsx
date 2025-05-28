import { useState } from "react";

const useColorFilter = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const resetColorFilter = () => {
    setSelectedColors([]);
  };

  return {
    selectedColors,
    toggleColor,
    resetColorFilter,
  };
};

export default useColorFilter;
