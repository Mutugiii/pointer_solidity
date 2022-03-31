import { useState } from "react";
import SecondaryButton from "./secondary-button";
import { ethers } from "ethers";
import ABI from "../utils/Keyboards.json";

export default function TipButton({ ethereum, index}) {
  const contractAddress = '0x44e5BC28944E72DeAE8771875A9BC0bcb4Bd90ea';
  const contractABI = ABI.abi;

  const [mining, setMining] = useState(false);

  const submitTip = async (e) => {
    if(!ethereum) {
      console.error("Ethereum object is required to tip!");
      return;
    }

    setMining(true);
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Set fixed tip of 0.01 ether
      const tipTxn = await contract.tip(index, { value: ethers.utils.parseEther("0.01")});
      console.log('Tip transaction started...', tipTxn.hash);

      await tipTxn.wait();
      console.log('Sent Tip!', tipTxn.hash);
    } finally {
      setMining(false);
    }
  }

  return <SecondaryButton onClick={submitTip} disabled={mining}>
    {mining ? 'Tipping...' : 'Tip 0.01 eth!'}
  </SecondaryButton>
}