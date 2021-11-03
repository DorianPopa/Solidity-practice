import React, { Component } from "react";
import factory from "../ethereum/factory";

import Link from "next/link";
import { Card, Button } from "semantic-ui-react";

const CampaignIndex = (props) => {
	const renderCampaigns = () => {
		const items = props.campaigns.map((address) => {
			return {
				header: address,
				description: (
					<Link href={`campaigns/${address}`}>
						<a>View campaign</a>
					</Link>
				),
				fluid: true,
			};
		});

		return <Card.Group items={items} />;
	};

	return (
		<div>
			<h3>Open Campaigns</h3>
			<Link href="/campaigns/new">
				<a>
					<Button
						floated="right"
						content="Create Campaign"
						icon="add circle"
						primary
					/>
				</a>
			</Link>
			{renderCampaigns()}
		</div>
	);
};

CampaignIndex.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();

	return { campaigns };
};

export default CampaignIndex;
