import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class CampaignNew extends Component {
	state = {
		minimumContribution: "0",
		errorMessage: "",
		loading: false,
	};

	onChangeMinimumContribution = (e) => {
		let newValue = e.target.value;
		if (newValue === "") newValue = "0";

		this.setState({ minimumContribution: newValue });
	};

	onSubmit = async (e) => {
		e.preventDefault();
		// If there's already an operation in progress, don't do anything
		if (this.state.loading) return;

		this.setState({ loading: true, errorMessage: "" });

		try {
			const accounts = await web3.eth.getAccounts();
			await factory.methods
				.createCampaign(this.state.minimumContribution)
				.send({
					from: accounts[0],
				});
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<>
				<h3>Create a Campaign</h3>
				<Form
					onSubmit={this.onSubmit}
					error={this.state.errorMessage.length !== 0}
				>
					<Form.Field>
						<label>Minimum Contribution</label>
						<Input
							label="wei"
							labelPosition="right"
							placeholder="Minimum Contribution"
							value={this.state.minimumContribution}
							onChange={this.onChangeMinimumContribution}
						/>
					</Form.Field>
					<Message
						error
						header="There was a problem with your submission"
						content={this.state.errorMessage}
					/>
					<Button primary type="submit" loading={this.state.loading}>
						Create
					</Button>
				</Form>
			</>
		);
	}
}

export default CampaignNew;
