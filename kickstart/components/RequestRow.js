import React from "react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Table, Button } from "semantic-ui-react";

const { Row, Cell } = Table;

const RequestRow = (props) => {
	const { id, request, approversCount, address } = props;
	const readyToFinalize = request.approvalCount > approversCount / 2;

	const onClickApprove = async () => {
		const campaign = Campaign(address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.approveRequest(id).send({
			from: accounts[0],
		});
	};

	const onClickFinalize = async () => {
		const campaign = Campaign(address);
		const accounts = await web3.eth.getAccounts();
		await campaign.methods.finalizeRequest(id).send({
			from: accounts[0],
		});
	};

	return (
		<Row
			key={id}
			disabled={request.complete}
			positive={readyToFinalize && !request.complete}
		>
			<Cell>{id}</Cell>
			<Cell>{request.description}</Cell>
			<Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
			<Cell>{request.recipient}</Cell>
			<Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
			<Cell>
				{request.complete ? null : (
					<Button positive basic onClick={onClickApprove}>
						Approve
					</Button>
				)}
			</Cell>
			<Cell>
				{request.complete ? null : (
					<Button negative basic onClick={onClickFinalize}>
						Finalize
					</Button>
				)}
			</Cell>
		</Row>
	);
};

export default RequestRow;
