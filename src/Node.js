import crypto from "crypto";

class Node {
    #blockchain;
    #private_key;

    constructor (blockchain, private_key) {
        this.#blockchain = blockchain;
        this.#private_key = private_key;
    }

    mine_block (transactions) {
        let block, hash, nonce = 0;

        const last_block = this.#blockchain.get_last_block();
        const difficulty = last_block.difficulty;
        
        const target = Array(difficulty + 1).join("0");
        do {
            block = this.#blockchain.generate_block(transactions, this.#private_key);
            block.nonce = nonce;
            hash = crypto.createHash("SHA256")
                .update(`${block.timestamp}${block.transactions.map(tx => tx.signature).join("")}${block.previous_hash}${block.nonce}`)
                .digest("hex");

            nonce++;
        } while (hash.substring(0, difficulty) !== target);

        block.hash = hash;
        return block;
    }
}

export default Node;