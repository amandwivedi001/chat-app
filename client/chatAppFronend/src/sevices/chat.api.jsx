import API from "./api"

export const fetchChat = async () => {
  try {
    const res = await API.get("/api/chat");
    return res.data.data;
  } catch (error) {
    console.error("fetchChat error:", error.response || error);
    throw error;
  }
};

export const accessChat = async (userId) => {
  try {
    console.log("SENDING USER ID 👉", userId);
    const res = await API.post("/api/chat",  {
      userId: userId, 
    });
    return res.data.data;
  } catch (error) {
    console.error("accessChat error: ", error.response || error);
    throw error;
  }
}

