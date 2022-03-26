import { 
  Contract, 
  ContractFactory 
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {

  const Investment: ContractFactory = await ethers.getContractFactory("Investment");
  const investment: Contract = await Investment.deploy();
  await investment.deployed();
  console.log(`Investment deployed to: ${investment.address}`)

  const InvestmentFactory: ContractFactory = await ethers.getContractFactory("InvestmentFactory");
  const daoFundingFactory: Contract = await InvestmentFactory.deploy(investment.address);

  await daoFundingFactory.deployed()
  console.log(`InvestmentFactory deployed to: ${daoFundingFactory.address}`)
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})
