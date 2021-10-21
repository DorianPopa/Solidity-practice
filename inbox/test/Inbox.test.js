const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3"); // Builder
const web3 = new Web3(ganache.provider()); // Instance
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
const INITIAL_STRING = "Hi there!";

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	// Use one of those accounts to deploy
	// the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: [INITIAL_STRING],
		})
		.send({
			from: accounts[0],
			gas: "1000000",
		});
});

describe("Inbox", () => {
	it("deploys a contract", () => {
		assert.ok(inbox.options.address);
	});

	it("has a default message", async () => {
		const message = await inbox.methods.message().call();
		assert.strictEqual(message, INITIAL_STRING);
	});

	it("can change the message", async () => {
		const newMessage = "Bye There!";
		await inbox.methods.setMessage(newMessage).send({
			from: accounts[0],
		});

		const actualMessage = await inbox.methods.message().call();
		assert.strictEqual(actualMessage, newMessage);
	});
});
