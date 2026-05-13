import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiErr } from "../../utils/ApiErr.js";
import { ApiRes } from "../../utils/ApiRes.js";
import { User } from "../models/user.model.js";

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()

        return accessToken
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and referesh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, avatar } = req.body;

    if (
        [name, email, password].some(
            (field) => !field || field.toString().trim() === ""
        )
    ) {
        throw new ApiErr(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiErr(409, "User with above credentials already exists");
    }


    const user = await User.create({
        Username: name,
        email,
        password,
        avatar
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    );

    if (!createdUser) {
        throw new ApiErr(500, "Something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(
            new ApiRes(
                200, createdUser, "User registered successfully"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
        throw ApiErr("400", "Invalid credentials");
    }

    const isPasswordCorrect = await existedUser.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiErr(401, "Invalid user credentials");
    }

    const token = await generateAccessToken(existedUser._id);

    const loggedInUser = await User.findById(existedUser._id).select(
        "-password"
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res
        .status(200)
        .cookie("accesstoken", token, options)
        .json(
            new ApiRes(201, loggedInUser, "Login successfully")
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .json(new ApiRes(200, {}, "User logged Out"))
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    return res.
        status(201)
        .json(
            new ApiRes(
                200,
                users,
                "All users fetched successfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logOutUser,
    getAllUsers
}