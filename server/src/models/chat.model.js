import mongoose, { Schema } from "mongoose";

const chatSchema = Schema({
    chatname: {
        type: String,
    },

    isGroupChat: {
        type: Boolean,
        default: false
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Massage",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
}, { timestamps: true })

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;