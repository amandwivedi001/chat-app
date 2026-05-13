import uploadImage from "../controllers/upload.controller.js";
import express from "express"
import upload from "../middleware/upload.js";

const router = express.Router();

router.route("/uploadImage")
                        .post(
                            upload.single("image"),
                            uploadImage
                        )

export default router;