import API from "./api";

export const loginUser = async (data) => {
    const res = await API.post("/api/user/login", data);
    return res.data;
}

export const registerUser = async (data) => {

    return API.post("/api/user/registerUser", data, {
    });

}

export const getAllUsers = async () => {

    const res = await API.get("/api/user/getAllUsers");

    return res.data.data;
} 


export const logOut = async () => {
    return await API.get("/api/user/logout");
}