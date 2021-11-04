import { ethers } from "ethers";
import {INFURA_ENDPOINT_KOVAN} from '../config/config';


let signer;

const provider = new ethers.providers.InfuraProvider('kovan', INFURA_ENDPOINT_KOVAN);

if(typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined"){
    (window as any).ethereum.enable();
    signer = new ethers.providers.Web3Provider((window as any).ethereum)?.getSigner();
} else {

}

export default {provider, signer};
