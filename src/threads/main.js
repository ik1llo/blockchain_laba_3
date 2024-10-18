import { Worker } from "node:worker_threads";

import ESSerializer from "esserializer";

const workers = [];
const create_worker = (node_id, blockchain, transactions, private_key) => {
    return new Promise((resolve, _) => {
        const worker = new Worker(
            "./src/threads/worker.js",
            {
                workerData: {
                    node_id,
                    blockchain: ESSerializer.serialize(blockchain),
                    transactions: ESSerializer.serialize(transactions),
                    private_key,
                }
            }
        );

        worker.on("message", (result) => {
            workers.forEach(w => w.terminate());
            resolve(result);
        });

        workers.push(worker);
    });
}

export { create_worker };