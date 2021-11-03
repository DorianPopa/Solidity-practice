import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import { useRouter } from "next/router";
import Link from "next/link";

const RequestNew = (props) => {
	const router = useRouter();

	const [state, setState] = useState({
		loading: false,
		description: "",
		value: "",
		recipient: "",
		errorMessage: "",
	});

	const onChangeDescription = (e) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, description: value }));
	};

	const onChangeValue = (e) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, value: value }));
	};

	const onChangeRecipient = (e) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, recipient: value }));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		// If there's already an operation in progress, don't do anything
		if (state.loading) return;

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));

		const campaign = Campaign(props.address);
		const { description, value, recipient } = state;

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods
				.createRequest(
					description,
					web3.utils.toWei(value, "ether"),
					recipient
				)
				.send({
					from: accounts[0],
				});

			router.push(`/campaigns/${props.address}/requests`);
		} catch (err) {
			setState((prev) => ({ ...prev, errorMessage: err.message }));
		}

		setState((prev) => ({ ...prev, loading: false }));
	};

	return (
		<>
			<Link href={`/campaigns/${props.address}/requests`}>
				<a>Back</a>
			</Link>
			<h3>Create a Request</h3>
			<Form onSubmit={onSubmit} error={state.errorMessage.length !== 0}>
				<Form.Field>
					<label>Description</label>
					<Input
						placeholder="Description"
						value={state.description}
						onChange={onChangeDescription}
					/>
				</Form.Field>

				<Form.Field>
					<label>Amount in Ether</label>
					<Input
						label="ether"
						labelPosition="right"
						placeholder="Amount in Ether"
						value={state.value}
						onChange={onChangeValue}
					/>
				</Form.Field>

				<Form.Field>
					<label>Recipient</label>
					<Input
						label="address"
						labelPosition="right"
						placeholder="Recipient"
						value={state.recipient}
						onChange={onChangeRecipient}
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

RequestNew.getInitialProps = async (props) => {
	return {
		address: props.query.address,
	};
};

export default RequestNew;
