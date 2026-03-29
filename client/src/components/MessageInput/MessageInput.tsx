import React, { useRef, useState } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";
import styles from "./MessageInput.module.scss";

interface MessageInputProps {
  onSend: (text: string, file?: File) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSend = () => {
    const text = value.trim();
    if (!text && !selectedFile) return;
    onSend(text || "", selectedFile ?? undefined);
    setValue("");
    handleRemoveFile();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.root}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className={styles.fileInput}
        aria-hidden
      />
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Превью" className={styles.previewImage} />
          <button
            type="button"
            className={styles.previewRemove}
            onClick={handleRemoveFile}
            aria-label="Убрать файл"
          >
            <FiX size={14} />
          </button>
        </div>
      )}
      <div className={styles.inputRow}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles.mediaBtn}
        >
          <FiPaperclip size={20} />
        </button>
        <input
          type="text"
          className={styles.input}
          placeholder="Введите сообщение..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button type="button" className={styles.sendBtn} onClick={handleSend}>
          →
        </button>
      </div>
    </div>
  );
};
