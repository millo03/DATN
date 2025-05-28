import { useState, useEffect } from 'react';
import useLocalStorage from '../../../common/hooks/Storage/useStorage';
import instance from '../../../configs/axios';

const ChatBot = () => {
    const [user] = useLocalStorage("user", {});
    const userId = user?.user?._id;
    const [messages, setMessages] = useState([
        { text: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const initializeConversation = async () => {
        try {
            const response = await instance.post('/get_messages', { userId });
            if (response.data.success) {
                setConversationId(response.data.conversation_Id);
                const botMessages = response.data.data.data.map((msg: any) => ({
                    text: msg.content,
                    sender: 'bot'
                }));
                setMessages(prev => [...prev, ...botMessages]);
            }
        } catch (error) {
            console.error("Lỗi khi khởi tạo cuộc trò chuyện:", error);
        }
    };

    useEffect(() => {
        initializeConversation();
    }, []);
    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);
            const userMessage = input;
            setInput('');

            try {
                // Gửi tin nhắn người dùng đến backend
                const response = await instance.post('/send_messages', {
                    conversationId,
                    content: userMessage,
                    user_id: userId
                });

                // Xử lý phản hồi từ bot
                if (response.data.success) {
                    const botMessages = response.data.data.messages.map((msg: any) => ({
                        text: msg.content,
                        sender: 'bot'
                    }));
                    setMessages(prev => [...prev, ...botMessages]);
                }
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md p-4 mx-auto bg-white rounded shadow-lg border h-[500px] mt-48">
            <div className="flex-1 overflow-y-auto p-2">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded block max-w-[100%] break-words ${message.sender === 'user'
                            ? 'bg-blue-500 text-white self-end max-w-[80%] ml-auto'
                            : 'bg-gray-300 text-black self-start max-w-[80%] mr-auto'
                            }`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>

            <div className="flex items-center p-2 border-t">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded mr-2 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
