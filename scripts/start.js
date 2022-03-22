async function main() {
  const [ownwer, otherSigner] = await hre.ethers.getSigners();
  const KeyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
  const contract = await KeyboardsContractFactory.deploy();
  await contract.deployed();

  console.log(`Contract deployed to ${contract.address}`);

  let keyboards = await contract.getKeyboards();
  console.log('We got the keyboards! ', keyboards);

  const txn1 = await contract.create("Potato!");
  await txn1.wait();

  const txn2 = await contract.connect(otherSigner).create("Tomato!")
  await txn2.wait();

  // const keyboard = await contract.createdKeyboards(0);
  // console.log("The single keyboard is", keyboard);
  
  keyboards = await contract.getKeyboards();
  console.log('We got the keyboards again! ', keyboards);

  keyboards = await contract.connect(otherSigner).getKeyboards();
  console.log("The other signer got: ", keyboards);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
   console.error(err);
   process.exit(1);
 });