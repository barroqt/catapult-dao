import { 
  Contract, 
  ContractFactory 
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {
  
  const [owner, signer] = await ethers.getSigners();
  const Investment = await ethers.getContractFactory("Investment", owner);
  const InvestmentFactory = await ethers.getContractFactory("InvestmentFactory", owner);
  
  const investment = await Investment.deploy();
  const investmentFactory = await InvestmentFactory.deploy(investment.address)
  await investmentFactory.deployed()

  const Coin: ContractFactory = await ethers.getContractFactory("TestToken")
  const coin: Contract = await Coin.deploy(1000 * 10 ** 6)
  await coin.deployed()
  console.log(`Coin deployed to: ${coin.address}`)
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})
