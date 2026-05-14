import { User } from "../models/user.model.js";
import { ApiErr } from "../../utils/ApiErr.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")


    if (!token) {
        throw new ApiErr(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password")

    if (!user) {
        throw new ApiErr(401, "Invalid Access Token")
    }

    req.user = user;
    next()
})