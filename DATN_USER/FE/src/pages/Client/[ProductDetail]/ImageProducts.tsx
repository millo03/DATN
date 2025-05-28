/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel } from "antd";
import React, { useState } from "react";


const ImageProducts: React.FC<any> = ({ product }: any) => {
  const image_product = product?.image_product;

  let gallery_product: any = product?.gallery_product;
  const [currentImage, setCurrentImage] = useState(image_product);
  gallery_product = [...gallery_product, image_product];
  const chunkArray = (array: any, size: any) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      if (array[i]) {
        result.push(array.slice(i, i + size));
      }
    }
    return result;
  };
  const chunks = chunkArray(gallery_product, 3);

  return (
    <div className="w-full flex flex-col lg:items-center lg:gap-y-6 gap-y-3.5">
      <div className="relative cursor-pointer w-[573px] lg:h-[520px] mb:h-[342px] bg-white overflow-hidden grid place-items-center rounded-xl">
        <img
          src={currentImage}
          alt="Product"
          className="w-[573px] h-full lg:h-[520px] rounded"
        />
      </div>
      <div className="lg:w-[45%]">
        {gallery_product && gallery_product.length > 0 ? (
          <Carousel arrows draggable className="!flex justify-center">
            {chunks?.map((chunk, index) => (
              <div key={index} className="!flex gap-x-2 justify-center *:overflow-hidden *:rounded">
                {chunk?.map((item: any, subIndex: any) => (
                  <button
                    key={subIndex}
                    className="hover:border-black duration-200 border"
                    onClick={() => setCurrentImage(item)}
                  >
                    <img
                      src={item}
                      alt={`Gallery ${subIndex}`}
                      className="w-[70px] h-[70px] object-cover mx-2"
                    />
                  </button>
                ))}
              </div>
            ))}
          </Carousel>
        ) : (
          <div>
            <h3>No images to display</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageProducts;
