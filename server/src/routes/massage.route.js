import express from "express"
import { sendMassage, allMassage } from "../controllers/message.controller.js"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = express.Router();
router.use(verifyJWT);

router.route("/sendMassage").post(sendMassage);
router.route("/:chatId").get(allMassage);

export default router;