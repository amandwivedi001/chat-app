import cloudinary from "../config/cloudinary.js";
import { ApiErr } from "../../utils/ApiErr.js";

const uploadImage = async (req, res) => {

    try {

        if (!req.file) {
            throw new ApiErr(400, "No image uploaded");
        }

        cloudinary.uploader.upload_stream(
            {
                folder: "chat-app"
            },

            (error, uploadedImage) => {

                if (error) {
                    throw new ApiErr(400, error.message);
                }

                return res.status(200).json({
                    url: uploadedImage.secure_url
                });

            }

        ).end(req.file.buffer);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

export default uploadImage;