export interface Participant {
  _id: string;
  email?: string;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
}
