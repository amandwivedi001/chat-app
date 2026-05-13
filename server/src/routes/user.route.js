import { Router } from "express";
import { loginUser, registerUser, logOutUser, getAllUsers} from "../controllers/user.controller.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/getAllUsers").get(getAllUsers);

export default router;