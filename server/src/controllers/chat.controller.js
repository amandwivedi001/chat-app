import { ApiErr } from "../../utils/ApiErr.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import Chat from "../models/chat.model.js";
import { ApiRes } from "../../utils/ApiRes.js"
import { User } from "../models/user.model.js";

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiErr(400, "User id required");
    }

    let chat = await Chat.find({
        isGroupChat: false,
        users: {
            $all: [req.user._id, userId],
        },
    })
        .populate("users", "-password")
        .populate("lastMessage");

    chat = await Chat.populate(chat, {
        path: "lastMessage.sender",
        select: "Username email avatar",
    });

    if (chat.length > 0) {
        return res.status(200).json(
            new ApiRes(200, chat[0], "Chat fetched successfully")
        );
    }

    const user = await User.findById(userId)
        .select("Username")
        .lean();

    const createdChat = await Chat.create({
        chatname: user?.Username || "Chat",
        isGroupChat: false,
        users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
    );

    return res.status(201).json(
        new ApiRes(201, fullChat, "New chat created successfully")
    );
});

const fetchChats = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const chats = await Chat.find({
        users: {
            $in: [userId]
        }
    })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

    return res
        .status(201)
        .json(
            new ApiRes(
                201,
                chats,
                "Users chat fetched successfully"
            )
        )

})

const createGroupChat = asyncHandler(async (req, res) => {
    const { name, users } = req.body;

    if (!name || !users) {
        throw new ApiErr(400, "Please fill all feilds");
    }


    if (users.length < 2) {
        throw new ApiErr(400, "Group must have atleast 3 members");
    }

    users.push(req.user._id);

    const GroupChat = await Chat.create({
        chatname: name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id
    })

    
    const fullGroupChat = await Chat.findById(GroupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res
        .status(201)
        .json(
            new ApiRes(
                200,
                fullGroupChat,
                "Group chat created successfully"
            )
        )
})

const renameName = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const {chatId} = req.params;

    if (!name) {
        throw new ApiErr(404, "Name feild must required to rename group");
    }

    const updatedGroupChat = await Chat.findByIdAndUpdate(chatId,
        { chatname: name },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");


    return res
        .status(201)
        .json(
            new ApiRes(
                200,
                updatedGroupChat,
                "GroupName changed successfully"
            )
        )
})

const addToGroup = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const {chatId} = req.params;

    if (!userId) {
        throw new ApiErr(400, "User Id required to add in a group")
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            $push: { users: userId },
        },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    return res
        .status(201)
        .json(
            new ApiRes(
                201,
                updatedChat,
                "User added successfully in group"
            )
        )
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const {chatId} = req.params;

    if (!userId) {
        throw new ApiErr(400, "User Id required to add in a group")
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: { users: userId },
        },
        { new: true }
    ).populate("users", "-password")
        .populate("groupAdmin", "-password");

    return res
        .status(201)
        .json(
            new ApiRes(
                201,
                updatedChat,
                "User removed successfully from group"
            )
        )
})


export {
    accessChat,
    fetchChats,
    createGroupChat,
    renameName,
    addToGroup,
    removeFromGroup
}