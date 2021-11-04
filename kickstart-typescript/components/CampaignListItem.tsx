import React from "react";
import { List } from "semantic-ui-react";
import Link from "next/link";

type CampaignListItemProps = {
	address: string;
};

const CampaignListItem: React.FC<CampaignListItemProps> = ({ address }) => {
	return (
		<List.Item>
			<List.Content>
				<List.Header>
					<Link href={`/campaigns/${address}`}>
						<a>{address}</a>
					</Link>
				</List.Header>
				<List.Description as="a">Description</List.Description>
			</List.Content>
		</List.Item>
	);
};

export default CampaignListItem;
