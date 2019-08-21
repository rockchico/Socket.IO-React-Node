import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";


class AppSendFileWS extends Component {
  constructor() {
    super();
    this.state = {
      response: false
    };
  }

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  _handleChange = (event) => {
    const socket = socketIOClient(endpoint);
    
    console.log(event.target.files)

    var file = event.target.files[0];
    var stream = socketIOStream.createStream();
 
    // upload a file to the server.
    socketIOStream(socket).emit('profile-image', stream, {size: file.size, name: file.name});
    socketIOStream.createBlobReadStream(file).pipe(stream);
    
  }


  render() {

    const { response } = this.state;

    return (
        <div style={{ textAlign: "center" }}>

          <div>
            {response
                ? <p>
                  The temperature in Florence is: {response} °F
                </p>
                : <p>Loading...</p>}

              <input type="file" onChange={this._handleChange}/>
          </div>

        </div>
          
    );
  }
}
export default AppSendFileWS;