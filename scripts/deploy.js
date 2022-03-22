async function main() {
  const KeyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
  const contract = await KeyboardsContractFactory.deploy();
  await contract.deployed();

  console.log(`The contract is deployed! ${contract.address}`);

  const keyboards = await contract.getKeyboards();
  console.log('We got the keyboards! ', keyboards);
}

main()
.then(() => process.exit(0))
.catch((err) => {
  console.error(err);
  process.exit(1);
})