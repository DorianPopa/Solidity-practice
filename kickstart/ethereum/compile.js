const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// ********************* Path building and cleanup *********************

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
console.log("Removed:", buildPath);

const contractPath = path.resolve(__dirname, "contracts");
const fileNames = fs.readdirSync(contractPath);
console.log(`Found ${fileNames.length} source files:`, fileNames);

// ****************** Compiler config + result *************************
// The desired input format is like this
// const input = {
// 	language: "Solidity",
// 	sources: {
// 		"source1.sol": {
// 			content: "source1 file content",
// 		},
// 		"source2.sol": {
// 			content: "source2 file content",
// 		},
// 	},
// 	settings: {
// 		outputSelection: {
// 			"*": {
// 				"*": ["abi", "evm.bytecode.object"],
// 			},
// 		},
// 	},
// };

const compilerInput = {
	language: "Solidity",
	// Generate a source object for each source file provided
	sources: fileNames.reduce((input, fileName) => {
		const filePath = path.resolve(contractPath, fileName);
		const source = fs.readFileSync(filePath, "utf8");
		return { ...input, [fileName]: { content: source } };
	}, {}),
	settings: {
		outputSelection: {
			"*": {
				"*": ["abi", "evm.bytecode.object"],
			},
		},
	},
};

console.log("Finished building the compiler config object");
const compiled = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
console.log("Compilation finished");
// ****************** Compiler output handling *************************

fs.ensureDirSync(buildPath);
console.log("Directory created:", buildPath);

fileNames.forEach((fileName) => {
	const contracts = Object.keys(compiled.contracts[fileName]);
	contracts.forEach((contract) => {
		const contractPath = path.resolve(buildPath, contract + ".json");
		console.log("Writing file: ", contractPath);
		fs.outputJSONSync(contractPath, compiled.contracts[fileName][contract]);
	});
});
