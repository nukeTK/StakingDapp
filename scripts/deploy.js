const main = async () => {
  const nukeToken = await ethers.getContractFactory("TokenNuke");
  const nukeTokenDeploy = await nukeToken.deploy();
  await nukeTokenDeploy.deployed();
  console.log("Address:", nukeTokenDeploy.address);
  const stakingContract = await ethers.getContractFactory("Staking");
  const stakingDeploy = await stakingContract.deploy(nukeTokenDeploy.address);
  await stakingDeploy.deployed();
  console.log("Address:", stakingDeploy.address);
  await nukeTokenDeploy.transfer(stakingDeploy.address,1000);  
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
