import React from "react";
import { NextPage } from "next";
import styles from "../../styles/Campaigns.module.css";

type CampaignsProps = {
	campaigns: Array<string>;
};

const Campaigns: NextPage<CampaignsProps> = ({ campaigns }) => {
	return <h3>Open Campaigns: {JSON.stringify(campaigns)}</h3>;
};

Campaigns.getInitialProps = async ({}) => {
	const campaigns = ["a", "b", "c"];

	return { campaigns };
};

export default Campaigns;
