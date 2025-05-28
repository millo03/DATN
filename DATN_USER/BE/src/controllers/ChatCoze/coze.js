import cozeApi from "../../config/coze";
import Coze from "../../models/Chatcoze/coze";
const chat_bot_id = process.env.CHAT_BOT_ID;

export const SendMessage = async (req, res) => {
  try {
    const { conversationId, content, user_id } = req.body;

    const requestData = {
      bot_id: chat_bot_id,
      user_id: user_id,
      stream: true,
      auto_save_history: true,
      additional_messages: [
        {
          role: "user",
          content: content,
          content_type: "text"
        }
      ]
    };

    const response = await cozeApi.post(
      `/v3/chat?conversation_id=${conversationId}`,
      requestData
    );

    // const response = await cozeApi.get(
    //   `/v1/conversation/message/list?conversation_id=${conversationId}`
    // );

    res.status(201).json({
      success: true,
      message: "Add message successful",
      data: response?.data
    });
  } catch (error) {
    console.error("Error in conversation and message flow:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const GetMessagesByIdUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const existingConversation = await Coze.findOne({ userId });
    if (existingConversation) {
      const conversationId = existingConversation.conversationId;
      const listMessageResponse = await cozeApi.get(
        `/v1/conversation/message/list?conversation_id=${conversationId}`
      );
      return res.status(200).json({
        success: true,
        message: "The conversation has been created",
        conversation_Id: conversationId,
        data: listMessageResponse.data
      });
    }

    const response = await cozeApi.post(`/v1/conversation/create`);
    const conversationId = response?.data?.data?.id;

    if (conversationId) {
      const listMessageResponse = await cozeApi.get(
        `/v1/conversation/message/list?conversation_id=${conversationId}`
      );
      const newCoze = new Coze({ userId, conversationId });
      await newCoze.save();
      return res.status(201).json({
        success: true,
        message: "Conversation created successfully",
        conversation_Id: conversationId,
        data: listMessageResponse.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to create conversation"
      });
    }
  } catch (error) {
    console.error("Error in conversation and message flow:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
