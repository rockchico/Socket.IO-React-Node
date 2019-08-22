import work from "webworkify-webpack";

const worker = work(require.resolve("./worker.js"));

function WW_socketReceive() {
    return new Promise((resolve, reject) => {
        
        //console.time('zabbix-worker')
        worker.addEventListener("message", event => {
            //console.timeEnd('zabbix-worker')
            console.log(event.data)

            resolve(event.data);
        });

        worker.addEventListener("error", e => {
            console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`);
            reject(e);
        });

        //start the worker
        worker.postMessage({
            command: "soketReceive"
        });
    });
}

function WW_socketSend(file) {
    return new Promise((resolve, reject) => {
        
        worker.addEventListener("message", event => {
            //console.timeEnd('zabbix-worker')
            resolve(event.data);
        });

        worker.addEventListener("error", e => {
            console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`);
            reject(e);
        });

        //start the worker
        worker.postMessage({
            command: "soketSend",
            file: file
        });
    });
}

export async function socketReceive() {

    return new Promise((resolve, reject) => {
        WW_socketReceive()
        .then(result => {

            //console.log(result) 
            //console.log(lastUpdate) 

            resolve(result);
        })
        .catch(err => {
            console.warn(err);
            reject(err);
        })
        .finally(() => {
            // Finaliza o Worker
            //worker.terminate();
            // libera memória
            //worker = null;
            //console.log('finally');
        });
    });
}


export async function socketSend(file) {

    return new Promise((resolve, reject) => {
        WW_socketSend(file)
        .then(result => {

            //console.log(result) 
            //console.log(lastUpdate) 

            resolve(result);
        })
        .catch(err => {
            console.warn(err);
            reject(err);
        })
        .finally(() => {
            // Finaliza o Worker
            //worker.terminate();
            // libera memória
            //worker = null;
            //console.log('finally');
        });
    });
}