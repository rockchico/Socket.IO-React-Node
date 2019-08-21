import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";


class AppSendFileWS extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      uploadStatus: false
    };
  }

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
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

    return (
        <div style={{ textAlign: "center" }}>

          <div>
            {response
                ? <p>
                  The temperature in Florence is: {response} °F
                </p>
                : <p>Loading...</p>}

            {response
                ? <p>
                  upload: {uploadStatus}
                </p>
                : <p>upload %</p>}

              <input type="file" onChange={this._handleChange}/>
          </div>

        </div>
          
    );
  }
}
export default AppSendFileWS;