import crypto from "crypto";

class Block {
    #version;
    #timestamp;
    #difficulty;
    #nonce;
    
    #transactions;
    
    #signature;
    
    #previous_hash;
    #hash;

    #merkle_root;

    constructor (version, timestamp, difficulty, nonce, transactions, signature, previous_hash) {
        this.#version = version;
        this.#timestamp = timestamp;
        this.#difficulty = difficulty;
        this.#nonce = nonce;
        
        this.#transactions = transactions;
        
        this.#signature = signature;
        
        this.#previous_hash = previous_hash;
        this.#hash = this.#generate_hash();

        this.#merkle_root = this.#generate_merkle_root();
    }

    to_string() { 
        return `---------
| Block | 
----------------------------------------------------------------------------
Version: ${ this.#version }
Timestamp: ${ this.#timestamp }
Difficulty: ${ this.#difficulty }
Nonce: ${ this.#nonce }
Transactions: ${ this.#transactions.length } pcs
Signature: ${ this.#signature }
Previous hash: ${ this.#previous_hash }
Hash: ${ this.#hash }
Merkle root: ${ this.#merkle_root }
----------------------------------------------------------------------------\n`
    }

    get version () { return this.#version; }
    get timestamp () { return this.#timestamp; }
    get difficulty () { return this.#difficulty; }
    get nonce () { return this.#nonce; }

    get transactions () { return this.#transactions; }

    get signature () { return this.#signature; }

    get previous_hash () { return this.#previous_hash; }
    get hash () { return this.#hash; }

    get merkle_root () { return this.#merkle_root; }

    set version (value) { this.#version = value; }
    set timestamp (value) { this.#timestamp = value; }
    set difficulty (value) { this.#difficulty = value; }
    set nonce (value) { this.#nonce = value; }

    set transactions (value) { this.#transactions = value; }

    set signature (value) { this.#signature = value; }

    set previous_hash (value) { this.#previous_hash = value; }
    set hash (value) { this.#hash = value; }
    
    set merkle_root (value) { this.#merkle_root = value; }
    
    verify_signature (public_key) {
        const verifier = crypto
            .createVerify("SHA256")
            .update(`${ this.#timestamp }${ this.#transactions.map(tx => tx.signature).join("") }${ this.#previous_hash }`)
            .end();
        
        return verifier.verify(public_key, this.#signature, "hex");
    }

    verify_hash () { return this.#hash === ( this.#generate_hash() ); }

    verify_merkle_root () { return this.#merkle_root === ( this.#generate_merkle_root() ); }

    #generate_hash () {
        const hash = crypto
            .createHash("SHA256")
            .update(`${ this.#timestamp }${ this.#transactions.map(tx => tx.signature).join("") }${ this.#previous_hash }`)
            .digest("hex");

        return hash;
    }

    #generate_merkle_root () {
        if (this.#transactions.length === 0) 
            return "";

        const hashes = this.#transactions.map(tx => tx.hash);
        return this.#build_merkle_tree(hashes);
    }

    #build_merkle_tree (hashes) {
        if (hashes.length === 1)
            return hashes[0];

        const new_hashes = [];
        for (let k = 0; k < hashes.length; k += 2) {
            const left = hashes[k];
            const right = (k + 1 < hashes.length) ? hashes[k + 1] : left;

            const combined_hash = crypto
                .createHash("sha256")
                .update(left + right)
                .digest("hex");

            new_hashes.push(combined_hash);
        }

        return this.#build_merkle_tree(new_hashes);
    }
}

export default Block;