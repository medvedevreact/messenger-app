import axios from "axios";

export const searchUsers = async (q: string) => {
  try {
    const res = await axios.get(`/api/users/search`, {
      params: { q: q.trim() },
      withCredentials: true,
    });
    return res.data.users;
  } catch {
    return [];
  }
};
