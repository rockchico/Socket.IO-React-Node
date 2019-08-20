const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");


const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
const getApiAndEmit = async socket => {
    try {
        const API_KEY = "224eacfae4c44e6ee3a4196254942472"
        const res = await axios.get(
            "https://api.darksky.net/forecast/"+API_KEY+"/43.7695,11.2558"
        ); // Getting the data from DarkSky
        socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

