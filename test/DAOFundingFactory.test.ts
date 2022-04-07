import { expect } from 'chai'; 
import { ethers } from 'hardhat';

describe('InvestmentFactory', function () {
    let adminAddress, owner, investor1, investor2; // roles
    let FundingToken, fundingToken, DaoToken, daoToken; // tokens
    let args; // test params

    beforeEach(async function () {
        [owner, investor1, investor2] = await ethers.getSigners();
        console.log("=== owner address: ", owner.address);

        this.Investment = await ethers.getContractFactory("Investment", owner);
        this.investment = await this.Investment.deploy();
        console.log("=== Investment contract address: ", this.investment.address);

        this.InvestmentFactory = await ethers.getContractFactory("InvestmentFactory", owner);
        this.investmentFactory = await this.InvestmentFactory.deploy(this.investment.address)
        console.log("=== Investment factory contract address: ", this.investmentFactory.address);
        
        FundingToken = await ethers.getContractFactory('USDC');
        fundingToken = await FundingToken.deploy(5000 * 10 ** 6);
        console.log("=== Funding token address: ", fundingToken.address);
        DaoToken = await ethers.getContractFactory('DAOToken');
        daoToken = await FundingToken.deploy(5000 * 10 ** 6);
        console.log("=== dao token address: ", daoToken.address);
        
        adminAddress = await owner.getAddress()
        const name = 'DAOname';
        const description = 'this is a description of the DAO';
        const fundingGoal = 10000;
        const startDate = Math.round(new Date('April 5, 2022 03:24:00').getTime()/1000);
        const endDate = Math.round(new Date('April 29, 2022 03:24:00').getTime()/1000);
        const daoAddress = '0xd71b3bd6E47B3B99aE939fbD75D3aa7002059727';

        args = [
            name,
            description,
            fundingGoal,
            startDate,
            endDate,
            daoToken.address,
            daoAddress,
            fundingToken.address
        ];
    });

    // Test cases

    //////////////////////////////
    //  DAOFundingFactory
    //////////////////////////////
    describe("DAOFundingFactory", function () {
        it('has the Investment address', async function () {
            expect(await this.investmentFactory.masterContractAddress())
                .to.eq(this.investment.address);
        });

        it('can create Investment clones', async function () {
            for (let i = 0; i < 10; i++) {
                await this.investmentFactory.createDAOFunding(...args);
                const investmentChildAddress = this.investmentFactory.investments(i);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                expect(await investmentChildContract.admin()).to.eq(adminAddress);
            }
        });

        it('emits the InvestmentCreated event', async function () {
            await expect(this.investmentFactory.createDAOFunding(...args)).to
                .emit(this.investmentFactory, 'InvestmentCreated')
                .withArgs(await this.investmentFactory.investments(0));
        })
    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Investment", function () {

    });
});