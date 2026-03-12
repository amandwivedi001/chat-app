const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('App is Running');
})

app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
})