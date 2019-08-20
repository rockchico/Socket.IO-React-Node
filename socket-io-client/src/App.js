import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const endpoint = "http://127.0.0.1:4001";


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

    const socket = socketIOClient(endpoint);
    const { messages } = this.state;
    
    socket.on("FromAPI-Message", data => {

      messages.push(data)

      this.setState({messages: messages});

    });

    


    //const { endpoint } = this.state;
    
    socket.on("FromAPI", data => this.setState({ response: data }));

  }

  _handleChange = (event) => {
    console.log(event.target.value)
    this.setState({messageInput: event.target.value});
  }

  _handleSubmit = (event) => {
    
    const socket = socketIOClient(endpoint);
    
    const { messageInput } = this.state;
  
    console.log(messageInput)

    socket.emit('FromClient-Message', messageInput);
      
    this.setState({messageInput: ''});

    event.preventDefault(); // prevents page reloading    
  }



  render() {

    const { messageInput } = this.state;

    const { messages } = this.state;

    const { response } = this.state;

    

    console.log(messages)


    return (
        <div style={{ textAlign: "center" }}>

          <div>
            {response
                ? <p>
                  The temperature in Florence is: {response} °F
                </p>
                : <p>Loading...</p>}
          </div>

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