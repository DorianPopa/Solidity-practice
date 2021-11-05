import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Campaign from "../../../../ethereum/campaign";
import { utils } from "ethers";
import Link from "next/link";
import { Button, Form, Input, Message } from "semantic-ui-react";

type NewRequestPage = {
	address: string;
};

const NewRequestPage: NextPage<NewRequestPage> = ({ address }) => {
	const router = useRouter();

	const [state, setState] = useState({
		loading: false,
		description: "",
		value: "",
		recipient: "",
		errorMessage: "",
	});

	const onChangeDescription = (e: any) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, description: value }));
	};

	const onChangeValue = (e: any) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, value: value }));
	};
	const onChangeRecipient = (e: any) => {
		let value = e.target.value;
		setState((prev) => ({ ...prev, recipient: value }));
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();

		if (state.loading) return;

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));

		const campaign = Campaign(address);
		const { description, value, recipient } = state;

		try {
			let tx = await campaign.createRequest(
				description,
				utils.parseEther(value),
				recipient
			);
			let rx = await tx.wait();

			router.push(`/campaigns/${address}/requests`);
		} catch (err: any) {
			setState((prev) => ({ ...prev, errorMessage: err.message }));
		}

		setState((prev) => ({ ...prev, loading: false }));
	};

	return (
		<>
			<Link href={`/campaigns/${address}/requests`}>
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

NewRequestPage.getInitialProps = async (props) => {
	const address = props.query.address?.toString() ?? "";

	return { address };
};

export default NewRequestPage;
