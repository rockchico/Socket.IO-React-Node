import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";
const socket = socketIOClient(endpoint);

export function soketReceive() {
  
  
  let filedata;

  // recebe uma imagem via stream
  socketIOStream(socket).on('FromAPI-image', function(stream, data) {

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

        //console.log(progress);
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
        return filedata;
        
        
    });

  });

  return ['sim']    

}


export function soketSend(file) {

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
    console.log(uploadStatus);
    // -> e.g. '42%'
  });

  stream.on('end', function () {
    console.log('end upload');
  });

  blobStream.pipe(stream)

  return uploadStatus

}