// This is implemention of blockchain for study perpose.

// library for generating hash
const SHA256 = require('crypto-js/sha256');


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block {
    constructor(timestamp , data , previousHash ) {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash || "0";
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while ( this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash();
        }
        console.log("Block minned with hash : " + this.hash);
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 4;

        this.pendingTransactions = [];

        this.miningReward = 100;
    }
    //first block of the blockchain.
    createGenesis() {
        return new Block("01/01/2017", "Genesis block");
    }

    latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransaction(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.latestBlock().hash);
        block.mineBlock(this.difficulty);
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null , miningRewardAddress, this.miningReward)
        ];
    } 

    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.data) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.latestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    checkValid() {
        for(let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
        }
        return true;
    }
}


// Testing of my blockchain............................................
let jsChain = new Blockchain();
// create two transection.
jsChain.createTransaction(new Transaction('address1', 'address2', 100))
jsChain.createTransaction(new Transaction('address1', 'address2', 200))

console.log("initial blockchain:/n" + JSON.stringify(jsChain, null, 2));

console.log("starting the miner....");
jsChain.minePendingTransaction("shubham");

console.log('Miner balance', jsChain.getBalanceOfAddress("shubham"));

console.log("starting the miner again....");
jsChain.minePendingTransaction("shubham");

console.log('Miner balance', jsChain.getBalanceOfAddress("shubham"));

console.log("starting the miner again....");

console.log(JSON.stringify(jsChain, null, 2));

