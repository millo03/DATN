// services/product.ts
import { StatusCodes } from "http-status-codes";
import Category from "../../models/Items/Category";
import Products from "../../models/Items/Products";
import Attributes from '../../models/attribute/variant';
import { validate_items } from "../../validations/items";

export const createProduct = async (req, res) => {
  const { category_id } = req.body;
  const dataClient = req.body;

  try {
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Khong tim thay danh muc !",
        });
      }
    }
    else {
      let check_name_category = await Category.findOne({
        name: "Chưa phân loại",
      });
      if (!check_name_category) {
        check_name_category = await Category.create({
          name: "Chưa phân loại",
        });
      }
    }

    // let slug = slugify(dataClient.name_product, { lower: true });

    // let existingProduct = await Products.findOne({ slug });
    // if (existingProduct) {
    //     slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    // }
    const checkNameItem = await Products.find();
    for (let check of checkNameItem) {
      if (check.name_product == dataClient.name_product) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Tên sản phẩm đã tồn tại!!'
        })
      }
    }
    const newProductData = {
      ...dataClient,
      attributes: null,
      category_id: category_id ? category_id : check_name_category._id,
    };
    const { error } = validate_items.validate(dataClient, {
      abortEarly: false,
    });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message,
      });
    }
    if (dataClient.attributes && dataClient.attributes.length > 0) {
      const convertAttribute = JSON.parse(dataClient.attributes)
      const data = await Products.create(newProductData);
      const varriant = convertAttribute.map(item => (
        {
          color: item.color ? item.color : '',
          symbol: item.symbol ? item.symbol : '',
          size: item.size.map(data_size => (
            {
              name_size: data_size.name_size ? data_size.name_size.toString() : '',
              stock_attribute: data_size.stock_attribute ? data_size.stock_attribute : 0,
              price_attribute: data_size.price_attribute ? +data_size.price_attribute : 1,
              // sale: data_size.sale ? +data_size.sale : 0
            }
          )
          )
        }
      ));
      const data_attr = {
        id_item: data._id,
        values: varriant
      };
      const new_attr = await Attributes.create(data_attr);
      await Products.findByIdAndUpdate(data._id, {
        $set: { attributes: new_attr._id }
      })
      return res.status(StatusCodes.CREATED).json({
        message: 'OK',
        data
      })
    }
    else {
      const data = await Products.create(newProductData);
      return res.status(StatusCodes.CREATED).json({
        message: 'OK',
        data
      })
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: error.message || "Loi server" });
  }
};
