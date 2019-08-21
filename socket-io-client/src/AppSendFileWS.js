import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";


class AppSendFileWS extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      uploadStatus: false,
      imageFromAPI: false
    };
  }

  b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));

    let self = this;
    
    // recebe uma imagem via stream
    socketIOStream(socket).on('FromAPI-image', function(stream, data) {

      let fileLength = 0;
      let fileBuffer = [];

      console.log("opa");
      //console.log(data.buffer);
      //console.log(stream);

      //== Receive data
      stream.on('data', function (chunk) {
          fileLength += chunk.length;
          let progress = Math.floor(fileLength / data.size * 100) + '%'
          //progress = Math.max(progress - 2, 1);
          fileBuffer.push(chunk);

          //console.log(progress);
      });

      stream.on('end', function () {

        let filedata = new Uint8Array(fileLength);
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
        

        let img = <img alt={"teste"} src={"data:image/png;base64,"+self.b64(filedata)}></img>

        self.setState({ imageFromAPI: img })

        //console.log(filedata);

    });



      

      //var filename = path.basename(data.name);
      //stream.pipe(fs.createWriteStream(filename));
  });


  }

  _handleChange = (event) => {
    const socket = socketIOClient(endpoint);
    
    console.log(event.target.files)

    let file = event.target.files[0];
    let stream = socketIOStream.createStream();
 
    // upload a file to the server.
    socketIOStream(socket).emit('profile-image', stream, {size: file.size, name: file.name});
    let blobStream = socketIOStream.createBlobReadStream(file);
    let size = 0;

    let self = this;
    blobStream.on('data', function(chunk) {
      size += chunk.length;
      let uploadStatus = Math.floor(size / file.size * 100) + '%'
      console.log(uploadStatus);
      self.setState({ uploadStatus: uploadStatus })
      // -> e.g. '42%'
    });

    blobStream.pipe(stream)
    
  }


  render() {

    const { response } = this.state;
    const { uploadStatus } = this.state;
    const { imageFromAPI } = this.state;

    return (
        <div style={{ textAlign: "center" }}>

          <div>
            {response
                ? <p>
                  The temperature in Florence is: {response} °F
                </p>
                : <p>Loading...</p>}

            {uploadStatus
                ? <p>
                  upload: {uploadStatus}
                </p>
                : <p>upload %</p>}


            {imageFromAPI
                ? <p>
                  {imageFromAPI}
                </p>
                : <p>imagem da API</p>}

              <input type="file" onChange={this._handleChange}/>
          </div>

        </div>
          
    );
  }
}
export default AppSendFileWS;