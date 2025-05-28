import Cart from "../../models/Cart/cart";
import { StatusCodes } from "http-status-codes";
import Products from "../../models/Items/Products";

export const addItemToCart = async (req, res) => {
  const {
    userId,
    productId,
    quantity,
    color,
    size,
    price_item_attr,
    status_checked
  } = req.body;
  try {
    const data_product = await Products.findOne({ _id: productId }).populate(
      "attributes"
    );
    let price_item =
      price_item_attr > 0 ? price_item_attr : data_product.price_product;
    let color_item;
    let name_size;
    let stock_attribute = 0;
    if (data_product.attributes) {
      const varr = data_product.attributes.values.find(color_attr => color_attr.color === color);
      if (varr) {
        for (let i of varr.size) {
          if (i.name_size === size) {
            color_item = varr.color;
            name_size = i.name_size
            stock_attribute = i.stock_attribute
          }
        }
      }
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: []
      });
    }

    let check_item = false;
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].productId.toString() === productId) {
        if (cart.products[i].color_item === color && cart.products[i].name_size === size) {
          cart.products[i].quantity += quantity;
          cart.products[i].total_price_item = price_item * cart.products[i].quantity;
          if (status_checked) {
            cart.products[i].status_checked = status_checked;
          }
          else {
            cart.products[i].status_checked = cart.products[i].status_checked;
          }
          check_item = true;
        }
        if (cart.products[i].quantity >= stock_attribute) {
          cart.products[i].quantity = stock_attribute;
          cart.products[i].total_price_item = price_item * cart.products[i].quantity;
          if (status_checked) {
            cart.products[i].status_checked = status_checked;
          }
          else {
            cart.products[i].status_checked = cart.products[i].status_checked;
          }
        }
      }
    }
    if (!check_item) {
      if (status_checked) {
        cart.products.unshift({
          productId,
          quantity,
          price_item,
          color_item,
          name_size,
          status_checked,
          total_price_item: price_item * quantity
        });
      } else {
        cart.products.push({
          productId,
          quantity,
          price_item,
          color_item,
          name_size,
          status_checked,
          total_price_item: price_item * quantity
        });
      }
    }
    cart.total_price = cart.products.reduce(
      (acc, product) => acc + product.total_price_item,
      0
    );
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Internal Server Error" });
  }
};

export const updateQuantityProductsInCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart not found" });
    }
    console.log(cart);

    const product = cart.products.find(
      (item) => item?.productId?.toString() === productId
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });
    }
    const productData = await Products.findOne({ _id: productId }).populate(
      "attributes"
    );
    let stockLimit = productData.countInStock_product;

    if (productData.attributes) {
      for (let i of productData.attributes.values) {
        if (i.color === product.color_item) {
          for (let k of i.size) {
            if (k.name_size === product.name_size) {
              stockLimit = k.stock_attribute;
              break;
            }
          }
        }
      }
    }

    if (quantity > stockLimit) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Only ${stockLimit} items in stock.` });
    }

    product.quantity = quantity;
    product.total_price_item = product.quantity * product.price_item;

    cart.total_price = cart.products.reduce(
      (acc, item) => acc + item.total_price_item,
      0
    );
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Internal Server Error" });
  }
};
export const increaseProductQuantity = async (req, res) => {
  const { userId, productId, color, size } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const product = cart.products.map(
      (item) => item.productId.toString() == productId._id && item
    );
    for (let i of cart.products) {
      if (i.productId.toString() == productId._id) {
        if (i.color_item == color && i.name_size == size) {
          i.quantity++;
          i.total_price_item = i.quantity * i.price_item;
        }
      }
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const decreaseProductQuantity = async (req, res) => {
  const { userId, productId, color, size } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].productId == productId._id) {
        if (
          cart.products[i].color_item == color &&
          cart.products[i].name_size == size
        ) {
          cart.products[i].quantity--;
          cart.products[i].total_price_item =
            cart.products[i].price_item * cart.products[i].quantity;
          if (cart.products[i].quantity === 0) {
            cart.products.splice(i, 1);
          }
        }
      }
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
