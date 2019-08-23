import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";
const socket = socketIOClient(endpoint);


function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return btoa(t)}

export function socketReceiveImage(self, streamName) {

    let filedata;

    // recebe uma imagem via stream
    socketIOStream(socket).on(streamName, function(stream, data) {

        let fileLength = 0;
        let fileBuffer = [];
            
        //console.log(data);
        //console.log(stream);

        //== Receive data
        stream.on('data', function (chunk) {
            fileLength += chunk.length;
            let progress = Math.floor(fileLength / data.size * 100)
            fileBuffer.push(chunk);

            console.log('socketReceiveImage, streaam ('+streamName+'): '+progress);
        });

        stream.on('end', function () {

            filedata = new Uint8Array(fileLength);

            let i = 0;
            //== Loop to fill the final array
            fileBuffer.forEach(function (buff) {
                for (var j = 0; j < buff.length; j++) {
                    filedata[i] = buff[j];
                    i++;
                }
            });

            //console.log(fileBuffer)
            //console.log(filedata)
            //return filedata;

            self.postMessage(b64(filedata));
             
        });

    });


}

export function socketReceiveTxt(self, streamName) {
  
    // recebe uma imagem via stream
    socketIOStream(socket).on(streamName, function(stream, data) {

        //console.log("opa");
        let fileLength = 0;
        let fileBuffer = [];
        
        
        //console.log(data);
        //console.log(stream);

        //== Receive data
        stream.on('data', function (chunk) {
            fileLength += chunk.length;
            let progress = Math.floor(fileLength / data.size * 100)
            fileBuffer.push(chunk);

            console.log('socketReceiveTxt, streaam ('+streamName+'): '+progress);
        });

        

        stream.on('end', function () {
            
            self.postMessage(fileBuffer);

        });

    });
}


export function socketSend(self, file) {


    let stream = socketIOStream.createStream();

    //console.log(file)

    // upload a file to the server.
    socketIOStream(socket).emit('FromClient-image', stream, {size: file.size, name: file.name});
    let blobStream = socketIOStream.createBlobReadStream(file);
    let size = 0;

    let uploadStatus = 0;
    blobStream.on('data', function(chunk) {
        size += chunk.length;
        uploadStatus = Math.floor(size / file.size * 100)
        //console.log(uploadStatus);
        // -> e.g. '42%'
    });

    stream.on('end', function () {
        console.log('end upload');
        self.postMessage(uploadStatus);
    });

    blobStream.pipe(stream)



}