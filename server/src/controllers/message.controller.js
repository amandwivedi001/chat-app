import Massage from "../models/massage.model.js";
import Chat from "../models/chat.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiErr } from "../../utils/ApiErr.js";
import { ApiRes } from "../../utils/ApiRes.js";

const sendMassage = asyncHandler(async (req, res) => {
    const { content, chatId , image} = req.body;

    if ((!content && !image) || !chatId) {
        throw new ApiErr(400, "Invalid data");
    }

    let newMassage = await Massage.create({
        sender: req.user._id,
        content: content,
        image,
        chat: chatId,
    })

    newMassage = await newMassage.populate("sender", "Username email avatar");
    newMassage = await newMassage.populate("chat");

    await Chat.findByIdAndUpdate(chatId, { lastMessage: newMassage._id },
        { new: true })

    return res
        .status(201)
        .json(
            new ApiRes(201, newMassage, "Massage send successfully")
        )
})

const allMassage = asyncHandler(async (req, res) => {
    const massages = await Massage.find({
        chat: req.params.chatId,
    })
        .populate("sender", "Username email avatar")
        .populate("chat");

    return res.status(200).json(
        new ApiRes(200, massages, "All messages fetched successfully")
    );
});

export {
    sendMassage,
    allMassage
}