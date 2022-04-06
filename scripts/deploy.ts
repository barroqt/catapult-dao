import { 
  Contract, 
  ContractFactory 
} from "ethers";
import { ethers } from "hardhat";
import * as fs from "fs";

const main = async(): Promise<any> => {

  const DAOToken = await ethers.getContractFactory('DAOToken');
  const USDC = await ethers.getContractFactory('USDC');

  const daoToken = await DAOToken.deploy(ethers.BigNumber.from('1000000000'));
  const usdc = await USDC.deploy(ethers.BigNumber.from('1000000000'));
  await daoToken.deployed();
  await usdc.deployed();
  console.log(`DAOToken deployed to: ${daoToken.address}`)
  console.log(`USDC deployed to: ${usdc.address}`)

  const Investment: ContractFactory = await ethers.getContractFactory("Investment");
  const investment: Contract = await Investment.deploy();
  await investment.deployed();
  console.log(`Investment deployed to: ${investment.address}`)

  const InvestmentFactory: ContractFactory = await ethers.getContractFactory("InvestmentFactory");
  const investmentFactory: Contract = await InvestmentFactory.deploy(investment.address);
  await investmentFactory.deployed()
  console.log(`InvestmentFactory deployed to: ${investmentFactory.address}`)

  saveDAppFiles('InvestmentFactory', investmentFactory);
  saveDAppFiles('Investment', investment);
}

// Store metadata for the dApp
const saveDAppFiles = async (name, contract=null): Promise<any> => {
    // Store the artifacts/contract into front 
    const path = __dirname + `/../artifacts/contracts/${name}.sol/${name}.json`;
    const frontPath = __dirname + `/../front/src/contracts/${name}.json`;
    if (fs.existsSync(path)) {
      try {
        const artifact = JSON.parse(fs.readFileSync(path).toString());
        fs.writeFileSync(
          frontPath,
          JSON.stringify(artifact, null, 2)
        );
        console.log("Stored", name, "in", frontPath);
      } catch (e) {
        console.error(e);
      }
    } else console.log("Artifact", name, "not found.");

    // Store the contract address
    if (contract) {
      const contractsDir = __dirname + "/../front/src/contracts";
      if (!fs.existsSync(contractsDir)) {
          fs.mkdirSync(contractsDir);
      }

      const addressFileName = `${contractsDir}/${name}_address.json`;
      fs.writeFileSync(
          addressFileName,
          JSON.stringify({ Contract: contract.address }, undefined, 2)
      );
      console.log("Stored address", name, "in", addressFileName);
    }
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})