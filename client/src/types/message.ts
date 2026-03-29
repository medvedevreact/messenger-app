export interface Message {
  _id?: string;
  id?: string;
  text: string;
  senderId?: { email?: string } | string;
  senderEmail?: string;
  /** URL изображения после загрузки на бэкенд */
  imageUrl?: string;
  createdAt?: Date;
}
