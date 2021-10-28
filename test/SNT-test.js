const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Test SNT smart contract", () => {
  let Token, token, owner, add1, add2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("SNT");
    token = await Token.deploy(1000000, "Space and Time", 18, "SNT");
    [owner, add1, add2, _] = await ethers.getSigners();
  });

  describe("Deployment", async () => {
    it("Should set right owner", async () => {
      expect(await token.owner()).to.equal(owner.address);
    });
    it("Should assign the total supply of tokens to owner", async () => {
      const onwerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(onwerBalance);
    });
  });

  describe("Transactions", async () => {
    it("Should transfer tokens between accounts", async () => {
      await token.transfer(add1.address, 5);
      const add1Balance = await token.balanceOf(add1.address);
      expect(add1Balance).to.equal(5);

      await token.connect(add1).transfer(add2.address, 2);
      const add2Balance = await token.balanceOf(add2.address);
      expect(add2Balance).to.equal(2);
    });

    it("Should be impossible when balance is not enough", async () => {
      const add1Balance = await token.balanceOf(add1.address);
      const ownerBalance = await token.balanceOf(owner.address);
      await expect(
        token.connect(add1).transfer(owner.address, 6)
      ).to.be.revertedWith("token balance is lower than the value requested");
      expect(await token.balanceOf(add1.address)).to.equal(add1Balance);
      expect(await token.balanceOf(owner.address)).to.equal(ownerBalance);
    });

    it("Should change balance of address after successfull transfer", async () => {
      const AMOUNT = 10;
      const add1Balance = await token.balanceOf(add1.address);
      const ownerBalance = await token.balanceOf(owner.address);
      await token.connect(owner).transfer(add1.address, AMOUNT);
      expect(await token.balanceOf(add1.address)).to.equal(
        add1Balance + AMOUNT
      );
      expect(await token.balanceOf(owner.address)).to.equal(
        ownerBalance - AMOUNT
      );
    });
  });
});
