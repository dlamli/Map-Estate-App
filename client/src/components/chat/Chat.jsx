import { useState } from "react";
import { format } from "timeago.js";
import { useForm } from "react-hook-form";

import { useAuthContext } from "../../hooks/useAuthContext";
import { API_URL } from "../../services/api";

import "./chat.scss";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const currentUser = user.userInfo;

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await API_URL.get(`/chats/${id}`);
      setChat({ ...res.data, receiver });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async ({ text }) => {
    try {
      const res = await API_URL.post(`/messages/${chat.id}`, { text });
      setChat((chat) => ({ ...chat, messages: [...chat.messages, res.data] }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((chat) => (
          <div
            className="message"
            key={chat.id}
            style={{
              backgroundColor: chat.seenBy.includes(currentUser.id)
                ? "white"
                : "#fecd514e",
            }}
            onClick={() => handleOpenChat(chat.id, chat.receiver)}
          >
            <img src={chat.avatar || "noavatar.jpg"} alt="" />
            <span>{chat.receiver.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((m) => (
              <div
                key={m.id}
                className="chatMessage"
                style={{
                  alignSelf:
                    m.userId === currentUser.id ? "flex-end" : "flex-start",
                  textAlign: m.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p>{m.text}</p>
                <span>{format(m.createdAt)}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bottom">
            <textarea name="text" {...register("text")}></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
