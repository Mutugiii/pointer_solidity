import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";
import TipButton from "../components/tip-button";

import { ethers } from "ethers";
import { useMetaMaskAccount } from "../components/metamask-account-provider";
import { UserCircleIcon } from "@heroicons/react/solid"
import addressesEqual from "../utils/adressesEqual";
import getKeyboardsContract from "../utils/getKeyboardsContract";

export default function Home() {
  const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();

  const [keyboards, setKeyboards] = useState([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contract = getKeyboardsContract(ethereum);

  const getKeyboards = async () => {
    if (contract && connectedAccount) {
      setKeyboardsLoading(true);
      try {
        const keyboards = await contract.getKeyboards();
        console.log('Retrieved keyboards: ', keyboards);
        setKeyboards(keyboards);
      } finally {
        setKeyboardsLoading(false);
      }
    }
  }
  useEffect(() => getKeyboards(), [!!contract, connectedAccount]);

  const addContractEventHandlers = () => {
    if(contract && connectedAccount) {
      contract.on('KeyboardCreated', async (keyboard) => {
        if(connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) {
          toast('Somebody created a new keyboard!', {id: JSON.stringify(keyboard)});
        }
        await getKeyboards();
      });

      contract.on('TipSent', (recipient, amount) => {
        if(addressesEqual(recipient, connectedAccount)) {
          toast(`You have received a tip of ${ethers.utils.formatEther(amount)} eth!`, { id: recipient + amount});
        }
      })
    }
  };
  useEffect(addContractEventHandlers, [!!contract, connectedAccount])

  if (!ethereum) {
    return <p>Please install metamask to connect to the site!</p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect Metamask wallet</PrimaryButton>
  }

  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {keyboards.map(
            ([kind, isPBT, filter, owner], i) => (
              <div key={i} className="relative">
                <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
                <span className="absolute top-1 right-6">
                  {addressesEqual(owner, connectedAccount) ?
                    <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                    <TipButton contract={contract} index={i} />
                  }
                </span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  if (keyboardsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>Loading Keyboards...</p>
      </div>
    )
  }

  // No keyboards yet
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  )
}