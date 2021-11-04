import React from "react";
import { NextPage } from "next";
import Campaign from "../../../ethereum/campaign";

import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";

import styles from "../../../styles/ViewCampaign.module.css";
import ContributeForm from "../../../components/ContributeForm";

type ViewCampaignPageProps = {
	address: string | string[];
	minimumContribution: string;
	balance: string;
	requestsCount: string;
	approversCount: string;
	manager: string;
};

const ViewCampaignPage: NextPage<ViewCampaignPageProps> = ({
	address,
	minimumContribution,
	balance,
	requestsCount,
	approversCount,
	manager,
}) => {
	const renderCards = () => {
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
				header: balance,
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
						<ContributeForm address={address} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link href={`/campaigns/${address}/requests`}>
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

ViewCampaignPage.getInitialProps = async (props) => {
	const address = props.query.address ?? "";

	const campaign = Campaign(address);
	const summary = await campaign.getSummary();

	return {
		address: address,
		minimumContribution: BigNumber.from(summary[0]).toString(),
		balance: utils.formatEther(BigNumber.from(summary[1])),
		requestsCount: BigNumber.from(summary[2]).toString(),
		approversCount: BigNumber.from(summary[3]).toString(),
		manager: summary[4],
	};
};

export default ViewCampaignPage;
