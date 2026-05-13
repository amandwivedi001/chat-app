import express from "express"
import {accessChat, fetchChats, createGroupChat, renameName, addToGroup, removeFromGroup} from "../controllers/chat.controller.js"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = express.Router();
router.use(verifyJWT);

router.route("/")
        .post(accessChat)
        .get(fetchChats)

router.route("/group").post(createGroupChat);
router.route("/rename/:chatId").post(renameName);
router.route("/groupAdd/:chatId").post(addToGroup);
router.route("/groupRemove/:chatId").post(removeFromGroup);


export default router;