import { 
  Contract, 
  ContractFactory 
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {

  const DAOToken = await ethers.getContractFactory('DAOToken');
  const USDC = await ethers.getContractFactory('USDC');

  const daoToken = await DAOToken.deploy(ethers.BigNumber.from('1000000000'));
  const usdc = await USDC.deploy(ethers.BigNumber.from('1000000000'));
  await daoToken.deployed();
  await usdc.deployed();

  const Investment: ContractFactory = await ethers.getContractFactory("Investment");
  const investment: Contract = await Investment.deploy();
  await investment.deployed();
  console.log(`Investment deployed to: ${investment.address}`)

  const InvestmentFactory: ContractFactory = await ethers.getContractFactory("InvestmentFactory");
  const investmentFactory: Contract = await InvestmentFactory.deploy(investment.address);

  await investmentFactory.deployed()
  console.log(`InvestmentFactory deployed to: ${investmentFactory.address}`)
  console.log(`DAOToken deployed to: ${daoToken.address}`)
  console.log(`USDC deployed to: ${usdc.address}`)
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})