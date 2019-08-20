import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const endpoint = "http://127.0.0.1:4001";
const socket = socketIOClient(endpoint);

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,      
      messageInput: "",
      messages: []
    };
  }
  componentDidMount() {

    const { messages } = this.state;
    
    socket.on("chat message", data => messages.push(data));

    this.setState({messages: messages});

  }

  _handleChange = (event) => {
    console.log(event.target.value)
    this.setState({messageInput: event.target.value});
  }

  _handleSubmit = (event) => {
    
    
    const { messageInput } = this.state;
  
    console.log(messageInput)

    socket.emit('chat message', messageInput);
      
    this.setState({messageInput: ''});

    event.preventDefault(); // prevents page reloading
  }



  render() {

    const { messageInput } = this.state;

    const { messages } = this.state;

    

    console.log(messages)


    return (
        <div style={{ textAlign: "center" }}>
          <ul id="messages">
            {messages.map((m, i) => (

                <li key={i}>{m}</li>
          
            ))}
          </ul>
          <form onSubmit={this._handleSubmit}>
            <input id="m" autoComplete="off" value={messageInput} onChange={this._handleChange} /><button>Send</button>
          </form>
        </div>
          
    );
  }
}
export default App;