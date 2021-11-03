import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const ContributeForm = (props) => {
	const router = useRouter();
	const [state, setState] = useState({
		value: "",
		loading: false,
		errorMessage: "",
	});

	const onChangeInputValue = (e) => {
		const value = e.target.value;

		setState((prev) => ({ ...prev, value: value }));
	};

	const onSubmitForm = async (e) => {
		console.log(props);

		e.preventDefault();
		let value = web3.utils.toWei(state.value, "ether");

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));

		const campaign = Campaign(props.address);

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: value,
			});
			router.replace(`/campaigns/${props.address}`);
		} catch (err) {
			setState((prev) => ({ ...prev, errorMessage: err.message }));
		}

		setState((prev) => ({ ...prev, loading: false, value: "" }));
	};

	return (
		<Form onSubmit={onSubmitForm} error={state.errorMessage.length !== 0}>
			<Form.Field>
				<label>Amount to Contribute</label>
				<Input
					label="ether"
					labelPosition="right"
					value={state.value}
					onChange={onChangeInputValue}
				/>
			</Form.Field>
			<Message
				error
				header="There was a problem - your transaction was not processed"
				content={state.errorMessage}
			/>
			<Button primary type="submit" loading={state.loading}>
				Contribute!
			</Button>
		</Form>
	);
};

export default ContributeForm;
