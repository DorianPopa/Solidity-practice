import React from "react";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";

import Link from "next/link";
import { Card, Grid, Button } from "semantic-ui-react";

import ContributeForm from "../../../components/ContributeForm";

const ViewCampaign = (props) => {
	const renderCards = () => {
		const {
			balance,
			manager,
			minimumContribution,
			requestsCount,
			approversCount,
		} = props;

		const items = [
			{
				header: manager,
				description:
					"The manager created this campaign and can create requests to withdraw money",
				meta: "Address of Manager",
				style: { overflowWrap: "break-word" },
			},
			{
				header: minimumContribution,
				description:
					"You must contribute at least this much wei to become an approver",
				meta: "Minimum Contribution (wei)",
			},
			{
				header: requestsCount,
				description:
					"A request tries to withdraw money from the campaign. Requests must be approved by approvers",
				meta: "Number of Requests",
			},
			{
				header: approversCount,
				description:
					"Number of people who have already donated to this campaign",
				meta: "Number of approvers",
			},
			{
				header: web3.utils.fromWei(balance, "ether"),
				description:
					"The balance is how much money this campaign has left to spend",
				meta: "Campaign Balance (ETH)",
			},
		];

		return <Card.Group items={items} />;
	};

	return (
		<>
			<h3>Campaign Details</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={10}>{renderCards()}</Grid.Column>
					<Grid.Column width={6}>
						<ContributeForm address={props.address} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link href={`/campaigns/${props.address}/requests`}>
							<a>
								<Button primary>View Requests</Button>
							</a>
						</Link>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</>
	);
};

ViewCampaign.getInitialProps = async (props) => {
	const campaign = Campaign(props.query.address);

	const summary = await campaign.methods.getSummary().call();

	return {
		address: props.query.address,
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
	};
};

export default ViewCampaign;
