import { parentPort, workerData } from "node:worker_threads";

import ESSerializer from "esserializer";

import Blockchain from "../Blockchain.js";
import Transaction from "../Transaction.js";

import Node from "../Node.js";

const blockchain = ESSerializer.deserialize(workerData.blockchain, [Blockchain]);
const transactions = ESSerializer.deserialize(workerData.transactions, [Transaction]);

const node = new Node(
    blockchain,
    workerData.private_key
);

const mined_block = node.mine_block(transactions);
parentPort.postMessage({ 
    id: workerData.node_id,
    mined_block_string: mined_block.to_string()
});