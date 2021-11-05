import connector from './connector';
import compiledCampaign from '../ethereum/build/Campaign.json';
import {ethers} from 'ethers';


let providerOrSigner = connector.signer ?? connector.provider;


export default (address: string) => {
    return new ethers.Contract(address, compiledCampaign.abi, providerOrSigner)
} 
