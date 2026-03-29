import React from "react";
import type { Message } from "../../types/message";
import styles from "./MessageList.module.scss";

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserEmail,
}) => (
  <div className={styles.list}>
    {messages &&
      messages.length > 0 &&
      messages.map((msg) => {
        const sid = msg.senderId;
        const senderEmail =
          typeof sid === "object" && sid !== null
            ? (sid.email ?? msg.senderEmail)
            : msg.senderEmail;
        return (
          <div
            key={msg._id ?? msg.id}
            className={`${styles.item} ${senderEmail === currentUserEmail ? styles.itemOutgoing : styles.itemIncoming}`}
          >
            <span className={styles.itemSender}>{senderEmail}</span>
            {msg.imageUrl && (
              <a
                href={msg.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.itemImageLink}
              >
                <img src={msg.imageUrl} alt="" className={styles.itemImage} />
              </a>
            )}
            {msg.text}
          </div>
        );
      })}
  </div>
);
