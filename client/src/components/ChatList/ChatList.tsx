import React from "react";
import type { Conversation } from "../../types/conversation";
import type { User } from "../../types/user";
import styles from "./ChatList.module.scss";

interface ChatListProps {
  conversations: Conversation[];
  currentChatId?: string;
  user: User;
  onChatSelect: (chat: Conversation) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  currentChatId,
  user,
  onChatSelect,
}) => (
  <ul className={styles.list}>
    {conversations.map((chat) => {
      const otherUser = chat.participants.find(
        (p) => p._id !== (user.id || user._id),
      );
      return (
        <li
          key={chat._id}
          onClick={() => onChatSelect(chat)}
          className={
            currentChatId === chat._id
              ? `${styles.item} ${styles.itemActive}`
              : styles.item
          }
        >
          {otherUser?.email}
        </li>
      );
    })}
  </ul>
);
