
/*
	O importScripts pre-carregar� (sincronamente) os scripts passados a ele e aceita uma lista de argumentos, como importScripts('a.js', 'b.js', 'c.js').
*/
//importScripts('ww-functions.js');

import * as workerFunctions from './workerFunctions';

export default function worker (self) {
  
  self.addEventListener('message', (event) => {
      
    switch (event.data.command) {

      case 'soketReceive': {
        
        let result = workerFunctions.soketReceive();
        console.log(result)

        self.postMessage(result);
        //self.close();
        break;
      }

      case 'soketSend': {
        //console.log(event.data.file)
        self.postMessage(workerFunctions.soketSend(event.data.file));
        //self.close();
        break;
      }

      default: {
        break;
      }
    }
  });

};