import API from "./api";

export const fetchMessage = async(id) => {
    const res = await API.get(`/api/massage/${id}`);
    return res.data.data;
}

export const sendMassage = async(data) => {
    const res = await API.post("/api/massage/sendMassage", data);

    return res.data.data;
}