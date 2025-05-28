import Cart from "../../models/Cart/cart";
import { StatusCodes } from "http-status-codes";

export const getCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const dataCart = await Cart.findOne({ userId }).populate(
      "products.productId"
    );
    await Cart.populate(dataCart.products, { path: 'productId.attributes' });
    if (!dataCart) {
      return res.status(StatusCodes.OK).json([]);
    }
    const data_cart = dataCart.products.filter(item => item?.productId?._id && item);
      await Cart.updateOne(
        { userId: userId },
        { $pull: { products: { productId: null } } }
      );
    data_cart.total_price = dataCart.products.reduce((a, b) => {
      if (b.status_checked) {
        return a + b.total_price_item;
      } else {
        return a;
      }
    }, 0);
    await dataCart.save();
    return res.status(StatusCodes.OK).json(dataCart);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
export const removeProductToCart = async (req, res) => {
  const { userId, id } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart Not Found" });
    }
    cart.products = cart.products.filter(
      (product) => product._id && product._id.toString() !== id
    );
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Internal Server Error" });
  }
};
export const removeMultipleProductsFormCart = async (req, res) => {
  try {
    const { userId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart Not Found" });
    }
    cart.products = cart.products.filter((product) => !product.status_checked);
    await cart.save();
    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Internal Server Error" });
  }
};
export const buyMultipleProductsFromCart = async (req, res) => {
  try {
    const { userId, productsId } = req.body;

    if (!userId || !Array.isArray(productsId) || productsId.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid input" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart Not Found" });
    }

    // Lọc các sản phẩm trong giỏ hàng để lấy các sản phẩm có ID nằm trong productsId
    const productsToBuy = cart.products.filter((product) =>
      productsId.includes(product.productId.toString())
    );

    if (productsToBuy.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No products found to buy" });
    }

    // Tính tổng giá trị đơn hàng
    const totalPrice = productsToBuy.reduce((total, product) => {
      return total + product.price_item * product.quantity;
    }, 0);

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      products: productsToBuy.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        price_item: product.price_item,
        color_item: product.color_item,
        name_size: product.name_size,
        total_price_item: product.total_price_item
      })),
      total_price: totalPrice
    });

    await newOrder.save();

    // Cập nhật giỏ hàng
    cart.products = cart.products.filter(
      (product) => !productsId.includes(product.productId.toString())
    );
    await cart.save();

    return res.status(StatusCodes.OK).json({
      message: "Products successfully purchased",
      order: newOrder
    });
  } catch (error) {
    console.error("Error buying multiple products from cart:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Internal Server Error" });
  }
};
export async function handle_status_checked(req, res) {
  const { userId, productId, color, size } = req.body;
  try {
    const data_cart = await Cart.findOne({ userId });
    for (let i of data_cart.products) {
      if (i.productId.toString() == productId._id.toString()) {
        if (color && size) {
          if (i.color_item == color && i.name_size == size) {
            i.status_checked = !i.status_checked;
          }
        } else if (color) {
          if (i.color_item == color) {
            i.status_checked = !i.status_checked;
          }
        } else if (size) {
          if (i.name_size == size) {
            i.status_checked = !i.status_checked;
          }
        }
        else {
          i.status_checked = !i.status_checked;
        }
      }
    }
    await data_cart.save();
    return res.status(StatusCodes.OK).json({
      message: "Done!",
      data_cart
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Loi roi dai vuong oi!"
    });
  }
}
