import connector from './connector';
import { CAMPAIGN_FACTORY_ADDRESS } from '../config/config';
import compiledFactory from '../ethereum/build/CampaignFactory.json';

const ethers = require('ethers');

let providerOrSigner = connector.signer ?? connector.provider;

const instance = new ethers.Contract(CAMPAIGN_FACTORY_ADDRESS, compiledFactory.abi, providerOrSigner );

export default instance;
