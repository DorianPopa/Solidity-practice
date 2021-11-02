import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const CampaignNew = () => {
	const router = useRouter();

	const [state, setState] = useState({
		minimumContribution: "0",
		errorMessage: "",
		loading: false,
	});

	const onChangeMinimumContribution = (e) => {
		let newValue = e.target.value;
		if (newValue === "") newValue = "0";

		setState((prev) => ({ ...prev, minimumContribution: newValue }));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		// If there's already an operation in progress, don't do anything
		if (state.loading) return;

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));

		try {
			const accounts = await web3.eth.getAccounts();
			await factory.methods
				.createCampaign(state.minimumContribution)
				.send({
					from: accounts[0],
				});

			router.push("/");
		} catch (err) {
			setState((prev) => ({ ...prev, errorMessage: err.message }));
		}

		setState((prev) => ({ ...prev, loading: false }));
	};

	return (
		<>
			<h3>Create a Campaign</h3>
			<Form onSubmit={onSubmit} error={state.errorMessage.length !== 0}>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						placeholder="Minimum Contribution"
						value={state.minimumContribution}
						onChange={onChangeMinimumContribution}
					/>
				</Form.Field>
				<Message
					error
					header="There was a problem with your submission"
					content={state.errorMessage}
				/>
				<Button primary type="submit" loading={state.loading}>
					Create
				</Button>
			</Form>
		</>
	);
};

export default CampaignNew;
