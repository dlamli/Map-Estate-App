import { useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import { useForm } from "react-hook-form";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useSocketContext } from "../../hooks/useSocketContext";
import { API_URL } from "../../services/api";

import "./chat.scss";
import { useNotificationStore } from "../../store/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { user } = useAuthContext();
  const { register, handleSubmit } = useForm();
  const { socket } = useSocketContext();
  const messageEndRef = useRef(null);
  const decrease = useNotificationStore((state) => state.decrease);

  const currentUser = user.userInfo;

  useEffect(() => {
    const read = async () => {
      try {
        await API_URL.put(`/chats/read/${chat.id}`);
      } catch (error) {
        console.log(error);
      }
    };

    if (socket && chat) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId)
          setChat((chat) => ({ ...chat, messages: [...chat.messages, data] }));
        read();
      });
    }

    return () => socket?.off("getMessage");
  }, [socket, chat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await API_URL.get(`/chats/${id}`);

      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }

      setChat({ ...res.data, receiver });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async ({ text }, { target }) => {
    try {
      const res = await API_URL.post(`/messages/${chat.id}`, { text });
      setChat((chat) => ({ ...chat, messages: [...chat.messages, res.data] }));
      target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.avatar || "noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
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
            <div ref={messageEndRef}></div>
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
