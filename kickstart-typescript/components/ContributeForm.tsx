import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Campaign from "../ethereum/campaign";
import { ethers, utils } from "ethers";

type ContributeFromProps = {
	address: string | string[];
};

const ContributeForm: React.FC<ContributeFromProps> = ({ address }) => {
	const router = useRouter();

	const [state, setState] = useState({
		value: "",
		errorMessage: "",
		loading: false,
	});

	const onSubmitForm = async (e: React.FormEvent) => {
		e.preventDefault();

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));
		let value = utils.parseEther(state.value);
		const campaign = Campaign(address);

		try {
			let transaction = await campaign.contribute({ value: value });
			const receipt = await transaction.wait();
			router.replace(`/campaigns/${address}`);
		} catch (err: any) {
			console.log(err);
			setState((prev) => ({ ...prev, errorMessage: err.message }));
		}

		setState((prev) => ({ ...prev, loading: false, value: "" }));
	};

	const onChangeInputValue = (e: any) => {
		let value = e.target.value;

		setState((prev) => ({ ...prev, value: value }));
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
