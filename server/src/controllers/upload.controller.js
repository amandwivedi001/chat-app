import cloudinary from "../config/cloudinary.js";
import {ApiErr} from "../../utils/ApiErr.js"

const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        const result = cloudinary.uploader.upload_stream(
            {folder: "chat-app"},
            (error, result) => {
                if(error){
                    throw new ApiErr(400, error.message)
                }

                res.json({url : result.secure_url});
            }
        )

        result.end(file.buffer);
    } catch (error) {
        throw new ApiErr(500, error.message);
    }
}

export default uploadImage;