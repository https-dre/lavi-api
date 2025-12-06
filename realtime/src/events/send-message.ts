import { createMessage } from "@/functions/create-message";
import { getChat } from "@/functions/get-chat";
import { getUnreadCount } from "@/functions/get-unread-count";
import { ioServer } from "@/infra/socket.io/server";
import type { Socket } from "socket.io";

type MessageData = {
  chat_id: string;
  content: string;
};

export const sendMessage = (socket: Socket) => {
  socket.on("create-message", async (data: MessageData) => {
    const sender_type = socket.data.clientType as "customer" | "member";
    const sender_id = socket.data.id;
    if (!sender_id || !sender_type) return;

    const chatData = await getChat(data.chat_id);
    if (!chatData) return;

    const savedMessage = await createMessage({
      ...data,
      sender_type,
      status: "sent",
      sender_id,
    });

    if (!savedMessage) {
      return;
    }

    socket.emit("message-created", {
      content: savedMessage.content,
      type: "message-created",
      metadata: {
        chatId: data.chat_id,
      },
      message: savedMessage,
    });

    if (sender_type === "customer") {
      const unreadCount = await getUnreadCount(
        data.chat_id,
        chatData.laundryId
      );
      if (chatData.memberId) {
        ioServer.in(`user:${chatData.memberId}`).emit("message-created", {
          content: savedMessage.content,
          type: "message-created",
          metadata: {
            chatId: data.chat_id,
          },
          message: savedMessage,
        });
      }

      ioServer.in(`laundry:${chatData.laundryId}`).emit("chat-update", {
        chatId: data.chat_id,
        unreadCount,
        lastMessage: savedMessage.content,
        status: "unread_by_team",
      });
    } else {
      const unreadCount = await getUnreadCount(data.chat_id, chatData.customerId);
      ioServer.in(`user:${chatData.customerId}`).emit("message-created", {
        content: savedMessage.content,
        type: "message-created",
        metadata: {
          chatId: data.chat_id,
        },
        message: savedMessage,
      });
      ioServer.in(`laundry:${chatData.laundryId}`).emit("chat-update", {
        chatId: data.chat_id,
        unreadCount,
        lastMessage: `You: ${savedMessage.content}`,
        status: "handled",
      });
    }
  });
};
