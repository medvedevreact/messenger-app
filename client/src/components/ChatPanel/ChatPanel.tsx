import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  getConversationMessages,
  uploadMessageImage,
} from "../../api/conversations";
import { MessageList } from "../MessageList/MessageList";
import { MessageInput } from "../MessageInput/MessageInput";
import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";
import type { User } from "../../types/user";
import { getSocketUrl } from "../../config/api";
import styles from "./ChatPanel.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ChatPanelProps {
  currentChat: Conversation;
  user: User;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ currentChat, user }) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["conversations", currentChat._id, "messages"],
    queryFn: () => getConversationMessages(currentChat._id),
    enabled: !!currentChat?._id,
  });

  const other = currentChat.participants.find(
    (p) => p._id !== (user.id || user._id),
  );

  const uploadImageMutation = useMutation({
    mutationFn: ({
      conversationId,
      file,
    }: {
      conversationId: string;
      file: File;
    }) => uploadMessageImage(conversationId, file),
  });

  const sendMessage = async (text: string, file?: File) => {
    if (!socket || !currentChat || !user) return;

    let imageUrl: string | undefined;
    if (file) {
      try {
        const result = await uploadImageMutation.mutateAsync({
          conversationId: currentChat._id,
          file,
        });
        imageUrl = result?.url;
      } catch (err) {
        console.error("Ошибка загрузки изображения:", err);
        return;
      }
    }

    const newMessage = {
      id: Date.now().toString(),
      text,
      senderId: user.id || user._id,
      senderEmail: user.email,
      createdAt: new Date(),
      ...(imageUrl && { imageUrl }),
    };

    socket.emit("send-message", {
      chatId: currentChat._id,
      message: newMessage,
    });
  };

  useEffect(() => {
    const newSocket = io(getSocketUrl());
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("new-message", (message: Message) => {
      queryClient.setQueryData<Message[]>(
        ["conversations", currentChat._id, "messages"],
        (old) => [...(old ?? []), message],
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentChat && socket) {
      socket.emit("join-chat", currentChat._id);
    }
  }, [currentChat, socket]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>{other?.email ?? ""}</div>
      <div className={styles.messagesWrap}>
        {messagesLoading ? (
          <div className={styles.spinnerWrap} aria-busy="true" aria-label="Загрузка сообщений">
            <div className={styles.spinner} />
          </div>
        ) : (
          <MessageList messages={messages} currentUserEmail={user.email} />
        )}
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
