import cron from "node-cron";
import Orders from "../../models/Orders/orders";
import { StatusCodes } from "http-status-codes";

export async function list_items_order_by_user(req, res) {
  const { _page = 1, _limit = 20, _search = "", _status = "" } = req.query;

  try {
    const id_user = req.params.id_user;
    if (!id_user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No user!",
      });
    }

    const options = {
      page: _page,
      limit: _limit,
      sort: { createdAt: -1 },
      populate: "reviews", // Thêm populate để lấy nội dung reviews
    };

    const query = {
      userId: id_user,
    };

    if (_status) {
      query.status = _status; // Lọc theo trạng thái đơn hàng
    }

    const data = await Orders.paginate(query, options);

    return res.status(StatusCodes.OK).json({
      message: "OK",
      data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
}
cron.schedule("*/30 * * * * *", async () => {
  try {
    const thirtySecondsAgo = new Date();
    thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
    const orders = await Orders.updateMany(
      {
        status: "4",
        deliveredAt: { $lte: thirtySecondsAgo },
        completedAt: null
      },
      {
        status: "6",
        completedAt: new Date()
      }
    );
    // console.log("Đã cập nhật", orders.nModified, "đơn hàng");
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
  }
});

