export interface User {
  id?: string;
  _id?: string;
  email: string;
}

export interface SearchUser {
  email: string;
  createdAt: string;
  _id: string;
}
