const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ss = require('socket.io-stream');
const path = require('path');
const fs = require('fs'); 

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!


var contador = 0;
let interval;

const APIEmit = async socket => {
    try {
        contador += 1;
        socket.emit("FromAPI", contador); // Emitting a new message. It will be consumed by the client
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

const APIFileStreamReceive = async socket => {
    try {
        
        ss(socket).on('FromClient-image', function(stream, data) {
            var filename = path.basename(data.name);
            stream.pipe(fs.createWriteStream(filename));
        });

    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

let imgNumber = 1;
const APIFileStreamSend = async socket => {
    try {
        
        var filename = 'img'+imgNumber+'.jpg';
        const stats = fs.statSync(filename);
        //console.log(stats)

        const fileSizeInBytes = stats.size;

        var stream = ss.createStream();

        ss(socket).emit('FromAPI-image', stream, {name: filename, size: fileSizeInBytes});

        // lê o arquivo e manda pelo stream
        fs.createReadStream(filename).pipe(stream);

        //imgNumber++ 
        //if(imgNumber > 3) { imgNumber = 1}

    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};




io.on("connection", socket => {
    
    console.log("New client connected");

    //if (interval) {
    //    clearInterval(interval);
    //}
    
    interval = setInterval(() => {
        APIEmit(socket)
        
    }, 1000);

    APIFileStreamSend(socket)

    APIFileStreamReceive(socket)
 
    socket.on("disconnect", () => {
        console.log("Client disconnected")
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

