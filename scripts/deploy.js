const { ethers } = require("hardhat");
const fs = require("fs");

console.log(ethers);
async function main() {
  const [owner, _] = await ethers.getSigners();
  console.log(`Deploy contract SNT with account: ${owner.address}`);

  const balanceEth = await owner.getBalance();
  console.log(`Account balance: ${balanceEth.toString()} ETH`);

  const Token = await ethers.getContractFactory("SNT");
  const token = await Token.deploy(1000000, "Space and Time", 18, "SNT");
  console.log(`Smart contract address: ${token.address}`);

  const data = {
    contractAddress: token.address,
    owner: await token.owner(),
    abi: JSON.parse(token.interface.format("json")),
  };
  fs.writeFileSync("front-end/src/SNT.json", JSON.stringify(data));
}

main()
  .then((result) => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
