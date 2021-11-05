import React from "react";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";

import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

const { Header, Row, HeaderCell, Body } = Table;

const RequestsIndex = (props) => {
	const renderRows = () => {
		return props.requests.map((request, index) => {
			return (
				<RequestRow
					key={index}
					id={index}
					request={request}
					address={props.address}
					approversCount={props.approversCount}
				/>
			);
		});
	};

	return (
		<>
			<h3>Request List</h3>
			<Link href={`/campaigns/${props.address}/requests/new`}>
				<a>
					<Button
						primary
						floated="right"
						style={{ marginBottom: "10px" }}
					>
						Add Request
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
			<h4>Found {props.requestsCount} Requests</h4>
		</>
	);
};

RequestsIndex.getInitialProps = async (props) => {
	const { address } = props.query;
	const campaign = Campaign(address);
	const requestsCount = await campaign.methods.requestsCount().call();
	const approversCount = await campaign.methods.approversCount().call();

	const requests = await Promise.all(
		Array(parseInt(requestsCount))
			.fill()
			.map((element, index) => {
				return campaign.methods.requests(index).call();
			})
	);
	console.log(requests);
	return { address, approversCount, requests, requestsCount };
};

export default RequestsIndex;
