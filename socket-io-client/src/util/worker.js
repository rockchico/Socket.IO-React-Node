
/*
	O importScripts pre-carregar� (sincronamente) os scripts passados a ele e aceita uma lista de argumentos, como importScripts('a.js', 'b.js', 'c.js').
*/
//importScripts('ww-functions.js');
import * as workerFunctions from './workerFunctions';
import socketIOClient from "socket.io-client";
import socketIOStream from "socket.io-stream";

const endpoint = "http://127.0.0.1:4001";
const socket = socketIOClient(endpoint);





export default function worker (self) {
  
  self.addEventListener('message', (event) => {
      
    switch (event.data.command) {

      case 'socketReceive': {
        workerFunctions.socketReceive(self);
        //self.close();
        break;
      }

      case 'socketSend': {
        //console.log(event.data.file)
        workerFunctions.socketSend(self, event.data.file);
        //self.close();
        break;
      }

      default: {
        break;
      }
    }
  });

  

};