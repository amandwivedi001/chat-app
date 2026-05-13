import API from "./api";

const uploadFiles = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await API.post(
        "api/upload/uploadImage",
        formData
    );

    return res.data.url; // 👈 MUST match backend
};

export default uploadFiles;
