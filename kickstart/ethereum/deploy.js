const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");

const {
	TEST_ACCOUNT_MNEMONIC,
	INFURA_ENDPOINT_KOVAN,
} = require("../config/config");

provider = new HDWalletProvider(TEST_ACCOUNT_MNEMONIC, INFURA_ENDPOINT_KOVAN);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log("Attempting to deploy from account", accounts[0]);

	const result = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({
			data: compiledFactory.evm.bytecode.object,
			arguments: ["100"],
		})
		.send({ gas: "5000000", from: accounts[0] });

	console.log("Contract deployed to", result.options.address);
	provider.engine.stop();
};

deploy();
