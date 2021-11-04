import connector from './connector';
import compiledCampaign from '../ethereum/build/Campaign.json';

const ethers = require('ethers');

let providerOrSigner = connector.signer ?? connector.provider;

export default (address: string | string[]) => {
    return new ethers.Contract(address, compiledCampaign.abi, providerOrSigner)
} 
