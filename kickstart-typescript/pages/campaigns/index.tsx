import React from "react";
import { NextPage } from "next";
import { List, Card } from "semantic-ui-react";

import factoryInstance from "../../ethereum/factory";
import CampaignListItem from "../../components/CampaignListItem";

import styles from "../../styles/Campaigns.module.css";

type CampaignsProps = {
	campaigns: Array<string>;
};

const Campaigns: NextPage<CampaignsProps> = ({ campaigns }) => {
	const renderCampaigns = () => {
		return campaigns.map((address) => {
			return <CampaignListItem address={address} />;
		});
	};

	return (
		<>
			<div className={styles.centeredContainer}>
				<h1 className={styles.title}>Campaigns</h1>
			</div>
			<Card.Group className={styles.centeredContainer}>
				<Card>
					<Card.Content>
						<Card.Header>Steve Sanders</Card.Header>
						<Card.Meta>Friends of Elliot</Card.Meta>
						<Card.Description>
							Steve wants to add you to the group{" "}
							<strong>best friends</strong>
						</Card.Description>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content>
						<Card.Header>Steve Sanders</Card.Header>
						<Card.Meta>Friends of Elliot</Card.Meta>
						<Card.Description>
							Steve wants to add you to the group{" "}
							<strong>best friends</strong>
						</Card.Description>
					</Card.Content>
				</Card>
				<Card>
					<Card.Content>
						<Card.Header>Steve Sanders</Card.Header>
						<Card.Meta>Friends of Elliot</Card.Meta>
						<Card.Description>
							Steve wants to add you to the group{" "}
							<strong>best friends</strong>
						</Card.Description>
					</Card.Content>
				</Card>
			</Card.Group>
			<Card fluid>
				<Card.Content>
					<List divided relaxed size="huge">
						{renderCampaigns()}
					</List>
				</Card.Content>
			</Card>
		</>
	);
};

Campaigns.getInitialProps = async ({}) => {
	const campaigns = await factoryInstance.getDeployedCampaigns();

	return { campaigns };
};

export default Campaigns;
