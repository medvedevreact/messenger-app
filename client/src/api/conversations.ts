import axios from "axios";

export const getAllConversations = async () => {
  try {
    const res = await axios.get(`/api/conversations`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);
    throw error;
  }
};

export const createConversation = async (participantId: string) => {
  try {
    const res = await axios.post(
      `/api/conversations`,
      { participantId },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка создания чата:", error);
    throw error;
  }
};

export const getConversationMessages = async (conversationId: string) => {
  try {
    const res = await axios.get(
      `/api/conversations/${conversationId}/messages`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.error("Ошибка загрузки сообщений:", error);
    throw error;
  }
};

export const uploadMessageImage = async (
  conversationId: string,
  file: File,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post<{ url: string }>(
    `$/api/conversations/${conversationId}/upload`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};
