import { ethers } from "ethers";

import ABI from "./Keyboards.json";

const contractAddress = '0xdA0EaE97cf6ff5B1378C2d6263578FcaFbF83945';
const contractABI = ABI.abi;


export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}