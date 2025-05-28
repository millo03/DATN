import Contact from "../../models/contact/contact";
import { StatusCodes } from "http-status-codes";

export const create_contact = async (req, res) => {
  try {
    const data = await Contact(req.body).save();
    if (!data) {
      throw new Error(`Error creating`);
    }
    return res.status(200).json({
      message: "Bạn đã tạo thành công",
      data,
    });
  } catch (error) {
    return res.json({
      name: error.name,
      message: error.message,
    });
  }
};
export const get_contact = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    let objWhere = {};
    if (keyword) {
      objWhere.name = new RegExp(keyword, "i");
    }

    const data = await Contact.find(objWhere);
    if (!data) {
      throw new Error(`Failed to get contacts`);
    }
    return res.status(200).json({
      message: "Thành công",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getById_contact = async (req, res) => {
  try {
    const data = await Contact.findById(req.params.id);
    if (!data) {
      throw new Error(`Failed to get contact detail`);
    }
    return res.status(200).json({
      message: "Thành công",
      data,
    });
  } catch (error) {
    return res.json({
      name: error.name,
      message: error.message,
    });
  }
};
export const delete_contact = async (req, res) => {
  try {
    const data = await Contact.findByIdAndDelete(req.params.id);
    if (!data) {
      throw new Error(`Failed to delete contact`);
    }
    return res.status(200).json({
      message: "Xóa thành công",
      data,
    });
  } catch (error) {
    return res.json({
      name: error.name,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { response_content, responder_email } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Liên hệ không tồn tại" });
    }

    contact.response_content = response_content;
    contact.responder_email = responder_email;
    contact.response_date = new Date();

    await contact.save();

    res.status(200).json({ message: "Phản hồi đã được cập nhật", contact });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật phản hồi", error });
  }
};
export const getContactByNameOrEmail = async (req, res) => {
  try {
    const { searchContact } = req.body;
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: new RegExp(searchContact, "i") } },
        { email: { $regex: new RegExp(searchContact, "i") } },
      ],
    });
    if (contacts.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có tài khoản liên hệ nào khớp với tìm kiếm" });
    }

    return res.status(StatusCodes.OK).json(contacts);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Lỗi máy chủ!" });
  }
};
// import contact from "../../models/contact/contact";

// export const create_contact = async (req, res) => {
//   try {
//     const data = await contact(req.body).save();
//     if (!data) {
//       throw new Error(`Error creating`);
//     }
//     return res.status(200).json({
//       message: "Bạn đã tạo thành công",
//       data,
//     });
//   } catch (error) {
//     return res.json({
//       name: error.name,
//       message: error.message,
//     });
//   }
// }
// export const get_contact = async (req, res) => {
//     try {
//         const keyword = req.query.keyword;
//         let objWhere = {};
//         if (keyword) {
//         objWhere.name = new RegExp(keyword, "i");
//         }

//         const data = await contact.find(objWhere);
//         if (!data) {
//         throw new Error(`Failed to get contacts`);
//         }
//         return res.status(200).json({
//         message: "Thành công",
//         data,
//         });
//     } catch (error) {
//         return res.status(400).json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }
//     export const getById_contact = async (req, res) => {
//     try {
//         const data = await contact.findById(req.params.id);
//         if (!data) {
//         throw new Error(`Failed to get contact detail`);
//         }
//         return res.status(200).json({
//         message: "Thành công",
//         data,
//         });
//     } catch (error) {
//         return res.json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }
//     export const delete_contact = async (req, res) => {
//     try {
//         const data = await contact.findByIdAndDelete(req.params.id);
//         if (!data) {
//         throw new Error(`Failed to delete contact`);
//         }
//         return res.status(200).json({
//         message: "Xóa thành công",
//         data,
//         });
//     } catch (error) {
//         return res.json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }

//     import contact from "../../models/contact/contact";

// export const create_contact = async (req, res) => {
//   try {
//     const data = await contact(req.body).save();
//     if (!data) {
//       throw new Error(`Error creating`);
//     }
//     return res.status(200).json({
//       message: "Bạn đã tạo thành công",
//       data,
//     });
//   } catch (error) {
//     return res.json({
//       name: error.name,
//       message: error.message,
//     });
//   }
// }
// export const get_contact = async (req, res) => {
//     try {
//         const keyword = req.query.keyword;
//         let objWhere = {};
//         if (keyword) {
//         objWhere.name = new RegExp(keyword, "i");
//         }

//         const data = await contact.find(objWhere);
//         if (!data) {
//         throw new Error(`Failed to get contacts`);
//         }
//         return res.status(200).json({
//         message: "Thành công",
//         data,
//         });
//     } catch (error) {
//         return res.status(400).json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }
//     export const getById_contact = async (req, res) => {
//     try {
//         const data = await contact.findById(req.params.id);
//         if (!data) {
//         throw new Error(`Failed to get contact detail`);
//         }
//         return res.status(200).json({
//         message: "Thành công",
//         data,
//         });
//     } catch (error) {
//         return res.json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }
//     export const delete_contact = async (req, res) => {
//     try {
//         const data = await contact.findByIdAndDelete(req.params.id);
//         if (!data) {
//         throw new Error(`Failed to delete contact`);
//         }
//         return res.status(200).json({
//         message: "Xóa thành công",
//         data,
//         });
//     } catch (error) {
//         return res.json({
//         name: error.name,
//         message: error.message,
//         });
//     }
//     }
