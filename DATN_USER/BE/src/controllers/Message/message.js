import MessageGroup from "../../models/Message/Message";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, role } = req.body;
    let messageGroup1 = await MessageGroup.findOne({
      $or: [{ senderId, receiverId }]
    });
    let messageGroup2 = await MessageGroup.findOne({
      $or: [{ senderId: receiverId, receiverId: senderId }]
    });

    if (!messageGroup1) {
      messageGroup1 = new MessageGroup({
        senderId,
        receiverId,
        messages: []
      });
    }
    if (!messageGroup2) {
      messageGroup2 = new MessageGroup({
        senderId,
        receiverId,
        messages: []
      });
    }

    let savedMessageGroup;
    if (senderId == messageGroup1.senderId) {
      messageGroup1.messages.push({
        content: content,
        role: role
      });
      savedMessageGroup = await messageGroup1.save();
    } else {
      messageGroup2.messages.push({
        content: content,
        role: role
      });
      savedMessageGroup = await messageGroup2.save();
    }

    res
      .status(200)
      .json({ message: "Gửi tin nhắn thành công", data: savedMessageGroup });
  } catch (error) {
    console.error("Lỗi khi lưu tin nhắn:", error);
    res.status(500).json({ message: "Gửi tin nhắn thất bại." });
  }
};
// export const getMessagesBetweenUsers = async (req, res) => {
//   try {
//     const { userId1, userId2 } = req.params;
//     console.log("User ID 1:", userId1);
//     console.log("User ID 2:", userId2);
//     if (
//       !mongoose.Types.ObjectId.isValid(userId1) ||
//       !mongoose.Types.ObjectId.isValid(userId2)
//     ) {
//       return res.status(400).json({ message: "ID người dùng không hợp lệ." });
//     }

//     let messageGroups = await MessageGroup.find({
//       $or: [
//         {
//           senderId: mongoose.Types.ObjectId(userId1),
//           receiverId: mongoose.Types.ObjectId(userId2)
//         },
//         {
//           senderId: mongoose.Types.ObjectId(userId2),
//           receiverId: mongoose.Types.ObjectId(userId1)
//         }
//       ]
//     })
//       .populate("senderId", "fullName email")
//       .populate("receiverId", "fullName email")
//       .sort({ "messages.createdAt": 1 });

//     res.status(200).json(messageGroups);
//   } catch (error) {
//     console.error("Lỗi khi lấy tin nhắn giữa hai người dùng:", error);
//     res.status(500).json({ message: "Lấy tin nhắn thất bại." });
//   }
// };
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    let messageGroups = await MessageGroup.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    })
      .populate("senderId")
      .populate("receiverId")
      .sort({ "messages.createdAt": 1 });

    messageGroups = messageGroups.map((group) => {
      group.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      return group;
    });
    res.status(200).json(messageGroups);
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn giữa hai người dùng:", error);
    res.status(500).json({ message: "Lấy tin nhắn thất bại." });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messageGroups = await MessageGroup.find({})
      .populate("senderId")
      .populate("receiverId");
    const sortedMessageGroups = messageGroups.map((group) => {
      group.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      return group;
    });
    res.status(200).json({ data: sortedMessageGroups });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả tin nhắn:", error);
    res.status(500).json({ message: "Lấy tất cả tin nhắn thất bại." });
  }
};
