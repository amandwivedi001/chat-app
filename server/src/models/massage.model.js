import mongoose, { Schema } from "mongoose";

const massageSchema = Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  content: {
    type: String,
    trim: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },

  deliveredTo: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
  ],

  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
  ],

}, { timestamps: true });

const Massage = mongoose.model("Massage", massageSchema);

export default Massage;