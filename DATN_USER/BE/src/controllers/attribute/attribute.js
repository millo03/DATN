import category_attribute from "../../models/attribute/category_attribute";
import thuoc_tinh from "../../models/attribute/thuoc_tinh";
import Attributes from "../../models/attribute/variant";
import { StatusCodes } from "http-status-codes";

// the loai thuoc tinh
export async function tao_loai_thuoc_tinh(req, res) {
  try {
    const check_ten_loai_thuoc_tinh = await category_attribute.findOne({
      name_attribute: req.body.name_attribute,
      id_account: req.body.id_account
    });
    if (!req.body.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    if (check_ten_loai_thuoc_tinh) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Loai thuoc tinh da ton tai",
      });
    }
    const check_the_loai_thuoc_tinh = await category_attribute.findOne({
      category_attribute: req.body.category_attribute,
      id_account: req.body.id_account
    });
    if (check_the_loai_thuoc_tinh) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Loai thuoc tinh da ton tai",
      });
    }
    await category_attribute.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "OK",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function sua_loai_thuoc_tinh(req, res) {
  try {
    const check_ten_loai_thuoc_tinh = await category_attribute.findOne({
      name_attribute: req.body.name_attribute,
      id_account: req.body.id_account
    });
    if (!req.body.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    if (check_ten_loai_thuoc_tinh) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Loai thuoc tinh da ton tai",
      });
    }
    await category_attribute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "OK",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function xoa_loai_thuoc_tinh(req, res) {
  try {
    if (!req.params.id) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No id",
      });
    }
    const data = await category_attribute.findOne({ _id: req.params.id });
    await thuoc_tinh.findOneAndDelete({
      the_loai_thuoc_tinh: data.category_attribute,
    });
    await category_attribute.findByIdAndDelete({ _id: req.params.id });
    return res.status(StatusCodes.NO_CONTENT).json({
      message: "OK",
    });
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function lay_loai_thuoc_tinh(req, res) {
  try {
    if (!req.params.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const data = await category_attribute.find({
      id_account: req.params.id_account,
    });
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function lay_1_loai_thuoc_tinh(req, res) {
  try {
    if (!req.params.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const data = await category_attribute.findOne({
      _id: JSON.parse(req.headers["custom-data-request"]).id_thuoc_tinh,
    });
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

// thuoc tinh

export async function tao_thuoc_tinh(req, res) {
  try {
    if (!req.body.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const check_ten_thuoc_tinh = await thuoc_tinh.findOne({
      ten_thuoc_tinh: req.body.ten_thuoc_tinh,
    });
    console.log(req.body);
    if (check_ten_thuoc_tinh) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Ten thuoc tinh da ton tai",
      });
    }
    await thuoc_tinh.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      message: "OK",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
export const lay_tat_ca_thuoc_tinh = async (req, res) => {
  try {
    // Lấy tất cả dữ liệu từ mảng size trong values
    const attributesData = await Attributes.find({}, "values.size");

    // Lấy tất cả các size từ dữ liệu và loại bỏ size trống
    const allSizes = attributesData.flatMap((attr) =>
      attr.values.flatMap(
        (value) =>
          value.size
            .map((size) => size.name_size) // Lấy tên size
            .filter((size) => size !== "") // Lọc bỏ size trống
      )
    );

    // Loại bỏ các kích thước trùng lặp
    const uniqueSizes = [...new Set(allSizes)];

    // Trả về danh sách các kích thước duy nhất dưới dạng JSON
    return res.status(200).json({
      sizes: uniqueSizes,
    });
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi với mã trạng thái 500
    res.status(500).json({
      message: "Lỗi khi lấy thuộc tính",
      error: error.message || error, // Cung cấp thông tin lỗi chi tiết hơn nếu có
    });
  }
};

export async function lay_thuoc_tinh(req, res) {
  try {
    if (!req.params.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const data = await thuoc_tinh.find({
      id_account: req.params.id_account,
      the_loai_thuoc_tinh: JSON.parse(req.headers["custome-data-request"]),
    });
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
export async function lay_1_thuoc_tinh(req, res) {
  try {
    if (!req.params.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const data = await thuoc_tinh.findOne({
      _id: JSON.parse(req.headers["custom-data-request"]).id_thuoc_tinh,
    });
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function sua_thuoc_tinh(req, res) {
  try {
    if (!req.params.id_account) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Khong tim thay tai khoan!",
      });
    }
    const data = await thuoc_tinh.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export async function xoa_thuoc_tinh(req, res) {
  try {
    if (!req.params.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No id!",
      });
    }
    const data = await thuoc_tinh.findOneAndDelete({
      _id: req.params.id,
    });
    return res.status(StatusCodes.OK).json({
      data,
      message: "ok",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
