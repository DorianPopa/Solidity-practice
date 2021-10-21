const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');               // Builder
const web3 = new Web3(ganache.provider());  // Instance

let accounts;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy 
    // the contract
});

describe("Inbox", () => {
    it("deploys a contract", () => {
        console.log(accounts);
    });
});