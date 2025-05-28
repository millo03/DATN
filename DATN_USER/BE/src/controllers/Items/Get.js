import { StatusCodes } from "http-status-codes";
import Products from "../../models/Items/Products";
import Category from "../../models/Items/Category";
import mongoose from "mongoose";

// list all
export const getAllProducts = async (req, res) => {
  const { _search = "" } = req.query;
  try {
    const querry = {};
    if (_search) {
      querry.$and = [
        {
          name_product: { $regex: new RegExp(_search, "i") },
        },
      ];
    }
    const data = await Products.find(querry);
    return res.status(StatusCodes.OK).json({
      message: "Done !",
      data,
    });
  } catch (error) {
    console.error("Error getting all products:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Loi server !",
    });
  }
};

// paginate
export async function get_items_client(req, res) {
  const {
    _page = 1,
    _sort = "",
    _limit = 20,
    _search = "",
    _category_id = "",
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
  };
  try {
    const querry = {
      $and: [],
    };

    if (_search) {
      querry.$and.push({
        name_product: { $regex: new RegExp(_search, "i") },
      });
    }

    if (_category_id) {
      // Tìm kiếm các danh mục có trạng thái published là true và khớp với _category_id
      const category = await Category.findOne({
        _id: _category_id,
        published: true,
      });

      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Danh mục bị ẩn hoặc không tồn tại!",
        });
      }

      querry.$and.push({
        category_id: _category_id,
      });
    } else {
      // Tìm kiếm các sản phẩm mà danh mục của chúng có trạng thái published là true
      const visibleCategories = await Category.find({ published: true }).select(
        "_id"
      );

      const visibleCategoryIds = visibleCategories.map((cat) => cat._id);

      querry.$and.push({
        category_id: { $in: visibleCategoryIds },
      });
    }

    const data = await Products.paginate(querry, options);

    await Products.populate(data.docs, { path: "attributes" });
    for (const id_data of data.docs) {
      if (id_data.attributes) {
        let total_stock = 0;
        id_data.attributes.values.map((i) => {
          i.size.map((l) => {
            total_stock += l.stock_attribute;
          });
        });
        id_data.stock_product = total_stock;
      } else {
        id_data.stock_product = id_data.stock;
      }
    }
    data.docs = data.docs.filter((item) => item.stock_product > 0);
    // console.log(data.docs);

    if (!data || data.length < 1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không có dữ liệu!",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Thành công!",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Lỗi server!",
    });
  }
}

export async function get_item_dashboard(req, res) {
  const { _page = 1, _limit = 10, _sort = "" } = req.query;
  try {
    const options = {
      page: _page,
      limit: _limit,
      sort: { createdAt: -1 },
    };
    const data = await Products.paginate({}, options);
    await Products.populate(data.docs, { path: "category_id" });
    await Products.populate(data.docs, { path: "attributes" });
    return res.status(StatusCodes.OK).json({
      message: "OK",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Loi server !",
    });
  }
}

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await Products.findById(req.params.id);

    if (products?.attributes) {
      await Products?.populate(products, { path: "attributes" });
      if (products.attributes.values) {
        products.attributes.values = products.attributes.values.map((item) => {
          const new_data = item.size.filter((attr) => attr.stock_attribute > 0);
          if (new_data.length > 0) {
            return {
              ...item,
              size: new_data,
            };
          }
        });
        products.attributes.values = products.attributes.values.filter(
          (item) => item !== undefined
        );
      }
      await products.save();
    }

    // Kiểm tra tính hợp lệ của ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "ID sản phẩm không hợp lệ" });
    }

    // Sử dụng aggregate để lấy sản phẩm và đánh giá liên quan, cùng thông tin user
    const review = await Products.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(productId) } }, // Tìm sản phẩm bằng productId
      {
        $lookup: {
          from: "reviews", // Tên collection chứa các đánh giá
          localField: "reviews", // Trường trong sản phẩm chứa ID đánh giá
          foreignField: "_id", // Trường trong reviews chứa ID đánh giá
          as: "reviews",
        },
      },
      {
        $unwind: "$reviews", // Tách từng review ra để thao tác
      },
      {
        $lookup: {
          from: "users", // Tên collection chứa người dùng
          localField: "reviews.userId", // Trường trong reviews chứa ID người dùng
          foreignField: "_id", // Trường trong users chứa ID người dùng
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Tách thông tin người dùng ra
      },
      {
        $addFields: {
          "reviews.userName": "$userDetails.userName", // Thêm userName từ userDetails vào reviews
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          reviews: { $push: "$reviews" }, // Gom các reviews lại
          attributes: { $first: "$attributes" },
        },
      },
    ]);

    if (!products) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.status(StatusCodes.OK).json({
      products,
      review,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Lỗi server !",
    });
  }
};

export const getProductAverageRating = async (req, res) => {
  const productId = req.params.id;
  try {
    // Cập nhật trung bình sao trước tiên
    await Products.updateAverageRating(productId);

    // Sau khi cập nhật, truy vấn lại sản phẩm để lấy giá trị mới
    const product = await Products.findById(productId).select("averageRating");

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Trả về trung bình sao hiện tại của sản phẩm
    return res.status(200).json({
      averageRating: product.averageRating,
      message: `Trung bình sao hiện tại của sản phẩm là: ${product.averageRating}`,
    });
  } catch (error) {
    console.error("Lỗi khi lấy trung bình sao của sản phẩm:", error);
    return res.status(500).json({
      message: "Lỗi khi tính toán trung bình sao",
      error: error.message,
    });
  }
};

// export const getProductById = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const products = await Products.findById(req.params.id).populate(
//       "attributes"
//     );

//     // Kiểm tra tính hợp lệ của ObjectId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "ID sản phẩm không hợp lệ" });
//     }

//     // Sử dụng aggregate để lấy sản phẩm và đánh giá liên quan
//     const product = await Products.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(productId) } },
//       {
//         $lookup: {
//           from: "reviews", // Tên của collection reviews
//           localField: "reviews",
//           foreignField: "_id",
//           as: "reviews",
//         },
//       },
//       {
//         $lookup: {
//           from: "users", // Tên của collection users
//           localField: "reviews.user",
//           foreignField: "_id",
//           as: "reviewUsers",
//         },
//       },
//       {
//         $unwind: {
//           path: "$reviews",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $addFields: {
//           "reviews.user": {
//             $arrayElemAt: [
//               {
//                 $filter: {
//                   input: "$reviewUsers",
//                   as: "user",
//                   cond: { $eq: ["$$user._id", "$reviews.user"] },
//                 },
//               },
//               0,
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           name: { $first: "$name" },
//           description: { $first: "$description" },
//           reviews: { $push: "$reviews" },
//           attributes: { $first: "$attributes" },
//           // Thêm các trường khác nếu cần
//         },
//       },
//     ]);

//     if (!products) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Không tìm thấy sản phẩm" });
//     }
//     if (products.attributes.values) {
//       products.attributes.values = products.attributes.values.map((item) => {
//         const new_data = item.size.filter((attr) => attr.stock_attribute > 0);
//         return {
//           ...item,
//           size: new_data,
//         };
//       });
//     }
//     await products.save();

//     return res.status(StatusCodes.OK).json({
//       products,
//       product,
//     });
//   } catch (error) {
//     console.error("Error getting product by ID:", error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Lỗi server !",
//     });
//   }
// };
export const getDetailProductDashBoard = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate(
      "attributes"
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }
    return res.status(StatusCodes.OK).json({
      product,
    });
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Lỗi server !",
    });
  }
};

export async function filterItems(req, res) {
  const { cate_id, color, name_size, price_ranges, _search } = req.query;
  const { _page = 1, _limit = 20, _sort = "" } = req.query;
  const page = parseInt(_page, 10) || 1;
  const limit = parseInt(_limit, 10) || 20;

  const options = {
    sort: {},
  };

  try {
    const visibleCategories = await Category.find({ published: true }).select(
      "_id"
    );
    const visibleCategoryIds = visibleCategories.map((cat) =>
      cat._id.toString()
    );

    const query = { category_id: { $in: visibleCategoryIds } };

    if (cate_id) {
      const cateIds = cate_id.split(",").map((id) => id.trim());
      const validCateIds = cateIds.filter((id) =>
        visibleCategoryIds.includes(id)
      );
      if (validCateIds.length > 0) {
        query.category_id = { $in: validCateIds };
      } else {
        return res.status(StatusCodes.OK).json({
          message: "Không có sản phẩm trong danh mục yêu cầu.",
          data: [],
          pagination: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: limit,
          },
        });
      }
    }

    if (_search) {
      query.name_product = { $regex: new RegExp(_search, "i") };
    }

    const colorArray = color
      ? color.split(",").map((c) => new RegExp(c.trim(), "i"))
      : [];
    const sizeArray = name_size
      ? name_size.split(",").map((s) => s.trim().toLowerCase())
      : [];

    let formattedPriceRanges = [];
    if (price_ranges) {
      try {
        const priceRangesArray = JSON.parse(price_ranges);
        if (!Array.isArray(priceRangesArray)) {
          throw new Error("Invalid price ranges");
        }
        formattedPriceRanges = priceRangesArray.map((pr) => ({
          minPrice: parseFloat(pr.min),
          maxPrice: pr.max !== null ? parseFloat(pr.max) : Infinity,
        }));
      } catch (e) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid JSON format for price_ranges" });
      }
    }

    const data = await Products.find(query)
      .populate("attributes")
      .populate("category_id")
      .sort(options.sort);

    const filteredProducts = data.filter((item) => {
      let total_stock = 0;
      let matched = false;
      let maxPrice = 0;

      if (item.attributes && Array.isArray(item.attributes.values)) {
        for (const value of item.attributes.values) {
          const colorMatch =
            colorArray.length === 0 ||
            colorArray.some((regex) => regex.test(value.color));

          const sizeMatch =
            sizeArray.length === 0 ||
            (Array.isArray(value.size) &&
              value.size.some((sizeObj) =>
                sizeArray.includes(sizeObj.name_size.toLowerCase())
              ));

          if (colorMatch && sizeMatch) {
            value.size.forEach((sizeObj) => {
              total_stock += sizeObj.stock_attribute;
              const priceInRange =
                formattedPriceRanges.length === 0 ||
                formattedPriceRanges.some(
                  (range) =>
                    sizeObj.price_attribute >= range.minPrice &&
                    sizeObj.price_attribute <= range.maxPrice
                );

              if (priceInRange) {
                matched = true;
              }

              maxPrice = Math.max(maxPrice, sizeObj.price_attribute);
            });
          }
        }
      }

      if (matched) {
        item.stock_product = total_stock;
        item.maxPrice = maxPrice;
        return true;
      }
      return false;
    });
    const sortedProducts = filteredProducts.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);

      // Tính giá sau khi giảm giá
      const priceAfterSaleA = a.maxPrice - a.maxPrice * (a.sale / 100);
      const priceAfterSaleB = b.maxPrice - b.maxPrice * (b.sale / 100);

      if (_sort === "price:desc") {
        return priceAfterSaleB - priceAfterSaleA;
      } else if (_sort === "price:asc") {
        return priceAfterSaleA - priceAfterSaleB;
      } else if (_sort === "updatedAt:desc") {
        return dateB - dateA;
      } else if (_sort === "updatedAt:asc") {
        return dateA - dateB;
      }
      return 0;
    });
    const totalCount = sortedProducts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedProducts = sortedProducts.slice(
      (page - 1) * limit,
      page * limit
    );

    return res.status(StatusCodes.OK).json({
      message: "Thành công!",
      data: paginatedProducts,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Lỗi máy chủ!",
    });
  }
}

export const getFilteredProducts = async (req, res) => {
  try {
    const { sort } = req.query;

    // Điều kiện sắp xếp
    let sortCondition = {};
    if (sort === "price_asc") {
      sortCondition = { price_product: 1 }; // Giá tăng dần
    } else if (sort === "price_desc") {
      sortCondition = { price_product: -1 }; // Giá giảm dần
    }

    // Query với điều kiện sắp xếp
    const products = await Products.find()
      .sort(sortCondition) // Sắp xếp theo điều kiện
      .populate("attributes") // Populate thêm data nếu cần
      .exec();

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductsByName = async (req, res) => {
  try {
    const { searchName } = req.body;
    const products = await Products.find({
      name_product: { $regex: new RegExp(searchName, "i") },
    });
    await Products.populate(products, { path: "attributes" });
    if (products.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không Có Sản Phẩm Nào" });
    }
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Lỗi máy chủ!" });
  }
};
