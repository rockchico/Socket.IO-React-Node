import React, { Component } from "react";

import * as Functions from './util/functions';


class App extends Component {
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
    
    let self = this
    Functions.socketReceive('image', 'FromAPI-image').then(filedata => {
      console.log(filedata)

      // recebe uma imagem via stream
      let img = <img alt={"teste"} src={"data:image/png;base64,"+filedata}></img>
      self.setState({ imageFromAPI: img })
    }).finally(() => {      
      //console.log('fim socketReceive')
    });


    Functions.socketReceive('txt', 'FromAPI-txt').then(filedata => {
      console.log(filedata)

      // recebe uma imagem via stream
      //let img = <img alt={"teste"} src={"data:image/png;base64,"+filedata}></img>
      //self.setState({ imageFromAPI: img })
    }).finally(() => {      
      //console.log('fim socketReceive')
    });

    
    
    


  }

  _handleChange = (event) => {
    
    

    let file = event.target.files[0];
    //console.log(file)

    Functions.socketSend(file).then(result => {

      console.log(result)

    }).finally(() => {
      
      console.log('fim')

    });

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
                  WS: {response}
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
export default App;