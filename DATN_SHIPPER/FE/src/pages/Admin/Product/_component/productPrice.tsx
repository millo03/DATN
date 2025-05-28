/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import instance from "../../../../configs/axios";
import { LoadingOutlined } from "@ant-design/icons";

const ProductPrice = ({ attributeId }: any) => {
  const {
    data: attributes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attributes", attributeId],
    queryFn: async () => {
      const response = await instance.get(`/attributes/${attributeId}`);
      return response?.data;
    },
  });

  if (isLoading) return <LoadingOutlined />;

  if (isError || !attributes) return <span>Lỗi hiển thị giá</span>;

  const renderPrice = () => {
    try {
      if (!attributes.values || !Array.isArray(attributes.values)) {
        return "Giá không có sẵn";
      }

      const allPrices = attributes.values
        .flatMap((value: any) =>
          value.size.map((sizeItem: any) => sizeItem.price_attribute)
        )
        .filter((price: any) => typeof price === "number" && !isNaN(price));

      if (allPrices.length === 0) return "Giá không có sẵn";

      const uniquePrices: any = [...new Set(allPrices)];

      if (uniquePrices.length === 1) {
        return uniquePrices[0].toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        });
      }

      const minPrice = Math.min(...uniquePrices);
      const maxPrice = Math.max(...uniquePrices);

      return `${minPrice.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      })} - ${maxPrice.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      })}`;
    } catch (error) {
      console.error("Error calculating price range:", error);
      return "Lỗi hiển thị giá";
    }
  };

  return (
    <div className="flex items-end gap-x-2">
      <span>{renderPrice()}</span>
    </div>
  );
};

export default ProductPrice;
