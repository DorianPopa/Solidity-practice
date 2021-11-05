import React from "react";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import { NextPage } from "next";
import Campaign from "../../../../ethereum/campaign";
import { BigNumber } from "ethers";
import RequestRow from "../../../../components/RequestRow";

const { Header, Row, HeaderCell, Body } = Table;

type Request = {
	description: string;
	value: number;
	recipient: string;
	complete: boolean;
	approvalCount: number;
};

type RequestsPageProps = {
	requests: Array<Request>;
	address: string;
	approversCount: number;
	requestsCount: number;
};

const RequestsPage: NextPage<RequestsPageProps> = ({
	requests,
	address,
	approversCount,
	requestsCount,
}) => {
	const renderRows = () => {
		return requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={address}
					approversCount={approversCount}
				/>
			);
		});
	};

	return (
		<>
			<h3>Request List</h3>
			<Link href={`/campaigns/${address}/requests/new`}>
				<a>
					<Button
						primary
						floated="right"
						style={{ marginBottom: "10px" }}
					>
						New Request
					</Button>
				</a>
			</Link>
			<Table>
				<Header>
					<Row>
						<HeaderCell>Id</HeaderCell>
						<HeaderCell>Description</HeaderCell>
						<HeaderCell>Amount (ETH)</HeaderCell>
						<HeaderCell>Recipient</HeaderCell>
						<HeaderCell>Approval Count</HeaderCell>
						<HeaderCell>Approve</HeaderCell>
						<HeaderCell>Finalize</HeaderCell>
					</Row>
				</Header>
				<Body>{renderRows()}</Body>
			</Table>
			<h4>Found {requestsCount} Requests</h4>
		</>
	);
};

RequestsPage.getInitialProps = async (props) => {
	const address = props.query.address?.toString() ?? "";
	const campaign = Campaign(address);

	let requestsCount: BigNumber = await campaign.requestsCount();
	let approversCount: BigNumber = await campaign.approversCount();

	const requests: Array<Request> = await Promise.all(
		Array.from(Array(requestsCount.toNumber())).map(
			async (element, index) => {
				const response = await campaign.requests(index);
				return {
					description: response[0],
					value: response[1].toNumber(),
					recipient: response[2],
					complete: response[3],
					approvalCount: response[4].toNumber(),
				};
			}
		)
	);

	return {
		address: address,
		approversCount: approversCount.toNumber(),
		requestsCount: requestsCount.toNumber(),
		requests: requests,
	};
};

export default RequestsPage;
