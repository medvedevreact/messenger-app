import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getAllConversations } from "../../api/conversations";
import type { RootState } from "../../store/store";
import type { User } from "../../types/user";
import type { Conversation } from "../../types/conversation";
import { ChatPanel } from "../../components/ChatPanel/ChatPanel";
import styles from "./Chat.module.scss";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations", user?.id ?? user?._id],
    queryFn: async () => {
      const data = await getAllConversations();
      return data ?? [];
    },
    enabled: !!user && !!id,
  });

  const currentChat = id
    ? conversations.find((c: Conversation) => c._id === id)
    : undefined;

  if (!id) {
    return (
      <div className={styles.root}>
        <p className={styles.error}>Не указан чат</p>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className={styles.root}>
        <p className={styles.error}>Чат не найден</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.root}>
      <ChatPanel currentChat={currentChat} user={user} />
    </div>
  );
};

export default Chat;
