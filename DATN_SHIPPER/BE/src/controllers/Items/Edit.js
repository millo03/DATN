import Products from "../../models/Items/Products";
import Attributes from '../../models/attribute/attribute'
import { StatusCodes } from "http-status-codes";
import { validate_items } from "../../validations/items";

export const updateProductById = async (req, res) => {
  const { name_product, ...body } = req.body;
  try {
    const { error } = validate_items.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        message,
      });
    }
    // const check_name_item = await Products.findOne({ name_product });
    // if (check_name_item) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     message: "Ten san pham da ton tai",
    //   });
    // }
    let convertAttribute;
    if (req.body.attributes) {
      convertAttribute = JSON.parse(req.body.attributes);
    }
    if (convertAttribute) {
      await Attributes.findOneAndDelete({ id_item: req.params.id });
      if (!Array.isArray(convertAttribute)) {
        convertAttribute = Object.keys(convertAttribute)
          .filter(key => !['_id', 'id_item', 'varriants', 'createdAt', 'updatedAt'].includes(key))
          .map(key => convertAttribute[key])
      }
      const varriant = convertAttribute.map(item => ({
        color: convertAttribute ? item.color : '',
        size: item.size.map(s => ({
          name_size: s.name_size ? s.name_size.toString() : '',
          stock_attribute: s.stock_attribute ? s.stock_attribute : 0,
          price_attribute: s.price_attribute ? s.price_attribute : 1
        }))
      }));
      const new_attr = await Attributes.create({ id_item: req.params.id, values: varriant });
      const dataClient = {
        ...req.body,
        attributes: null
      }
      const product = await Products.findByIdAndUpdate(req.params.id, {
        $set: {
          ...dataClient,
          attributes: new_attr._id
        }
      }, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm để cập nhật" });
      }
      return res.status(200).json(product);
    } else {
      const dataClient = {
        ...req.body,
        attributes: convertAttribute,
      }
      const product = await Products.findByIdAndUpdate(req.params.id, dataClient, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm để cập nhật" });
      }
      return res.status(200).json(product);
    }
  } catch (error) {
    console.error("Error updating product by ID:", error);
    return res.status(500).json({ error: error.message });
  }
};
