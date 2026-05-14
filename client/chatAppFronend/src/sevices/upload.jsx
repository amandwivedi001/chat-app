import API from "./api";

const uploadFiles = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const res = await API.post(
        "/api/upload/uploadImage",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data.url;
};

export default uploadFiles;
