const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(abi)
		.deploy({
			data: evm.bytecode.object,
		})
		.send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
	it("deploys a contract", () => {
		assert.ok(lottery.options.address);
	});

	it("allows one account to enter", async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei("0.02", "ether"),
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0],
		});

		assert.strictEqual(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	it("allows multiple accounts to enter", async () => {
		const numberOfAccounts = 3;
		for (let i = 0; i < numberOfAccounts; i++) {
			await lottery.methods.enter().send({
				from: accounts[i],
				value: web3.utils.toWei("0.02", "ether"),
			});
		}

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0],
		});

		assert.equal(numberOfAccounts, players.length);

		for (let i = 0; i < numberOfAccounts; i++) {
			assert.strictEqual(accounts[i], players[i]);
		}
	});

	it("requires a minimal amount of ether to enter", async () => {
		const tooLowAmountOfWei = 69;
		try {
			await lottery.methods.enter().send({
				from: accounts[0],
				value: tooLowAmountOfWei,
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	// Needs checking   assert.throws(fn[, error][, message])
	it("only manager can call pickWinner", async () => {
		// Need to have at least 1 player in order to select a winner
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei("0.02", "ether"),
		});

		try {
			await lottery.methods.pickWinner().send({
				from: accounts[1],
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	it("sends money to the winner and resets the players array", async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei("2", "ether"),
		});

		// Check if the winner gets the prize
		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		assert(difference > web3.utils.toWei("1.8", "ether")); // 1.8 is to cover the pickWinner transaction gas cost

		// Check if the lottery balance is empty
		const lotteryBalance = await web3.eth.getBalance(
			lottery.options.address
		);
		assert.strictEqual(lotteryBalance, "0");

		// Check if the players array is empty
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0],
		});
		assert.strictEqual(players.length, 0);
	});
});
