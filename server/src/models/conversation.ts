import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
