import "./App.css";
import React from "react";
import web3 from "./web3";

import lottery from "./lottery";

class App extends React.Component {
	state = {
		manager: "",
		players: [],
		balance: "",
		value: "",
		message: "",
	};

	fetchStats = async () => {
		const players = await lottery.methods.getPlayers().call();
		const balance = await web3.eth.getBalance(lottery.options.address);

		this.setState((prev) => ({
			...prev,
			players: players,
			balance: balance,
		}));
	};

	async componentDidMount() {
		const manager = await lottery.methods.manager().call();
		this.setState((prev) => ({
			...prev,
			manager: manager,
		}));

		await this.fetchStats();
	}

	// Arrow functions will bind to this
	onSubmit = async (event) => {
		event.preventDefault();

		const accounts = await web3.eth.getAccounts();

		this.setState({ message: "Waiting on transaction success..." });

		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(this.state.value, "ether"),
		});
		await this.fetchStats();

		this.setState({ message: "You have been entered!", value: "" });
	};

	onClick = async () => {
		const accounts = await web3.eth.getAccounts();

		this.setState({ message: "Waiting on transaction success..." });
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});

		const winner = await lottery.methods.lastWinner().call();
		await this.fetchStats();
		this.setState({ message: `A winner has been picked: ${winner}` });
	};

	render() {
		return (
			<div>
				<h2>Lottery Contract</h2>
				<p>This contract is managed by {this.state.manager}.</p>
				<p>
					There are currently {this.state.players.length} entries with
					the total prize of{" "}
					{web3.utils.fromWei(this.state.balance, "ether")} ether
				</p>
				<hr />

				<form onSubmit={this.onSubmit}>
					<h4>Want to try your luck?</h4>
					<div>
						<label>Amount of ether to enter</label>
						<input
							value={this.state.value}
							onChange={(e) =>
								this.setState({ value: e.target.value })
							}
						/>
					</div>
					<button>Enter</button>
				</form>
				<hr />

				<h4>Ready to pick a winner?</h4>
				<button onClick={this.onClick}>Pick a winner!</button>

				<hr />

				<h1>{this.state.message}</h1>
			</div>
		);
	}
}
export default App;
