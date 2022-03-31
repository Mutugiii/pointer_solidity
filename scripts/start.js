async function main() {
  const [ownwer, otherSigner] = await hre.ethers.getSigners();
  const KeyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
  const contract = await KeyboardsContractFactory.deploy();
  await contract.deployed();

  console.log(`Contract deployed to ${contract.address}`);

  let keyboards = await contract.getKeyboards();
  console.log('We got the keyboards! ', keyboards);

  const balanceBefore = await hre.ethers.provider.getBalance(otherSigner.address);
  console.log("otherSigner balance before: ", hre.ethers.utils.formatEther(balanceBefore));

  const txn1 = await contract.create(0, true, "sepia");
  await txn1.wait();

  const txn2 = await contract.connect(otherSigner).create(1, false, "grayscale");
  await txn2.wait();

  // const keyboard = await contract.createdKeyboards(0);
  // console.log("The single keyboard is", keyboard);
  
  keyboards = await contract.getKeyboards();
  console.log('We got the keyboards again! ', keyboards);

  // keyboards = await contract.connect(otherSigner).getKeyboards();
  // console.log("The other signer got: ", keyboards);
  
  const tipTxn = await contract.tip(1, {value: hre.ethers.utils.parseEther("1000")});
  await tipTxn.wait()

  const balanceAfter = await hre.ethers.provider.getBalance(otherSigner.address);
  console.log("otherSigner balance after: ", hre.ethers.utils.formatEther(balanceAfter));

}

main()
  .then(() => process.exit(0))
  .catch((err) => {
   console.error(err);
   process.exit(1);
 });