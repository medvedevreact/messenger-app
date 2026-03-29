import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

const Message = mongoose.model("message", messageSchema);

export default Message;
