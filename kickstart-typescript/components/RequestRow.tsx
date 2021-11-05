import { BigNumber, utils } from "ethers";
import React from "react";
import Campaign from "../ethereum/campaign";
import { Table, Button } from "semantic-ui-react";

const { Row, Cell } = Table;

type Request = {
	description: string;
	value: number;
	recipient: string;
	complete: boolean;
	approvalCount: number;
};

type RequestRowProps = {
	id: number;
	request: Request;
	approversCount: number;
	address: string;
};

const RequestRow: React.FC<RequestRowProps> = ({
	id,
	request,
	approversCount,
	address,
}) => {
	const readyToFinalize = request.approvalCount > approversCount / 2;

	const onClickApprove = async () => {
		const campaign = Campaign(address);
		console.log("APPROVE");

		try {
			let tx = await campaign.approveRequest(id.toString());
			let rx = await tx.wait();
		} catch (err) {
			console.log("ERROR", err);
		}
	};

	const onClickFinalize = async () => {
		const campaign = Campaign(address);
		console.log("Finalize");
		try {
			let tx = await campaign.finalizeRequest(id.toString());
			let rx = await tx.wait();
		} catch (err) {
			console.log("ERROR", err);
		}
	};

	return (
		<Row
			key={id}
			disabled={request.complete}
			positive={readyToFinalize && !request.complete}
		>
			<Cell>{id}</Cell>
			<Cell>{request.description}</Cell>
			<Cell>{utils.formatEther(request.value)}</Cell>
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
