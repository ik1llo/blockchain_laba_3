import crypto from "crypto";

import Transaction from "./Transaction.js";
import Blockchain from "./Blockchain.js";

import { create_worker } from "./threads/main.js";

(async () => {
    const user_01__keys = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    const user_02__keys = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    const user_03__keys = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    const user_04__keys = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

    const transaction_01__input_addr = "user_1";
    const transaction_01__output_addr = "user_2";
    const transaction_01__funds = 10;
    const transaction_01__timestamp = Date.now();
    const transaction_01__signature = crypto
        .createSign("SHA256") 
        .update(`${ transaction_01__input_addr }${ transaction_01__output_addr }${ transaction_01__funds }${ transaction_01__timestamp }`)
        .end() 
        .sign(
            user_01__keys
                .privateKey
                .export({ type: "pkcs1", format: "pem" }), 
            "hex"
        );

    const transaction_02__input_addr = "user_2";
    const transaction_02__output_addr = "user_3";
    const transaction_02__funds = 20;
    const transaction_02__timestamp = Date.now();
    const transaction_02__signature = crypto
        .createSign("SHA256")
        .update( 
            crypto.createHash("SHA256")
                .update(`${ transaction_02__input_addr }${ transaction_02__output_addr }${ transaction_02__funds }${ transaction_02__timestamp }`)
                .digest("hex")
        )
        .sign(user_02__keys.privateKey.export({ type: "pkcs1", format: "pem" }), "hex");
    
    const transaction_03__input_addr = "user_3";
    const transaction_03__output_addr = "user_4";
    const transaction_03__funds = 30;
    const transaction_03__timestamp = Date.now();
    const transaction_03__signature = crypto
        .createSign("SHA256")
        .update( 
            crypto.createHash("SHA256")
                .update(`${ transaction_03__input_addr }${ transaction_03__output_addr }${ transaction_03__funds }${ transaction_03__timestamp }`)
                .digest("hex")
        )
        .sign(user_03__keys.privateKey.export({ type: "pkcs1", format: "pem" }), "hex");
    
    const transaction_04__input_addr = "user_4";
    const transaction_04__output_addr = "user_5";
    const transaction_04__funds = 40;
    const transaction_04__timestamp = Date.now();
    const transaction_04__signature = crypto
        .createSign("SHA256")
        .update( 
            crypto.createHash("SHA256")
                .update(`${ transaction_04__input_addr }${ transaction_04__output_addr }${ transaction_04__funds }${ transaction_04__timestamp }`)
                .digest("hex")
        )
        .sign(user_04__keys.privateKey.export({ type: "pkcs1", format: "pem" }), "hex");
        
    const transaction_01 = new Transaction(transaction_01__input_addr, transaction_01__output_addr, transaction_01__funds, transaction_01__timestamp, transaction_01__signature);
    const transaction_02 = new Transaction(transaction_02__input_addr, transaction_02__output_addr, transaction_02__funds, transaction_02__timestamp, transaction_02__signature);
    const transaction_03 = new Transaction(transaction_03__input_addr, transaction_03__output_addr, transaction_03__funds, transaction_03__timestamp, transaction_03__signature);
    const transaction_04 = new Transaction(transaction_04__input_addr, transaction_04__output_addr, transaction_04__funds, transaction_04__timestamp, transaction_04__signature);

    const blockchain = new Blockchain();

    const user_keys = [user_01__keys, user_02__keys, user_03__keys, user_04__keys];
    const transactions = [transaction_01, transaction_02, transaction_03, transaction_04];

    const worker_promises = [];

    for (let k = 0; k < 3; k++) {
        worker_promises.push(
            create_worker(
                k + 1, 
                blockchain,
                transactions,
                user_keys[k]
                    .privateKey
                    .export({ type: "pkcs1", format: "pem" })
            )
        );  
    }
    
    const result = await Promise.race(worker_promises);

    console.log(`node #${ result.id } found the hash!\n`);
    console.log(result.mined_block_string);

    for (let k = 0; k < 3; k++)
        k + 1 !== result.id ? console.log(`copy of the updated blockchain is sent to the node #${ k + 1 }`) : null;
})(); 