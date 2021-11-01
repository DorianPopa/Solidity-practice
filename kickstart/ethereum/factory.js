import web3 from "./web3";
import { CAMPAIGN_FACTORY_ADDRESS } from "../config/config";
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
	campaignFactory.abi,
	CAMPAIGN_FACTORY_ADDRESS
);

export default instance;
