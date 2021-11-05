import React, { useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";

type NewCampaignPageProps = {};

const NewCampaignPage: NextPage<NewCampaignPageProps> = ({}) => {
	const router = useRouter();

	const [state, setState] = useState({
		minimumContribution: "0",
		errorMessage: "",
		loading: false,
	});

	const onChangeMinimumContribution = (e: any) => {
		let newValue = e.target.value;
		if (newValue === "") newValue = "0";

		setState((prev) => ({ ...prev, minimumContribution: newValue }));
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();

		if (state.loading) return;

		setState((prev) => ({ ...prev, loading: true, errorMessage: "" }));

		try {
			const tx = await factory.createCampaign(state.minimumContribution);
			const rx = await tx.wait();

			router.push("/campaigns");
		} catch (err: any) {
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

NewCampaignPage.getInitialProps = async (props) => {
	return {};
};

export default NewCampaignPage;
