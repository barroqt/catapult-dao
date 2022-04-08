import { expect } from 'chai'; 
import { ethers } from 'hardhat';

describe('InvestmentFactory', function () {
    let adminAddress, owner, investor1, investor2, investors; // roles
    let FundingToken, fundingToken, DaoToken, daoToken; // tokens
    let args; // test params
    let investmentDeployed, investmentFactoryDeployed;

    beforeEach(async function () {
        [owner, investor1, investor2, ...investors] = await ethers.getSigners();

        const investment = await ethers.getContractFactory("Investment", owner);
        investmentDeployed = await investment.deploy();

        const investmentFactory = await ethers.getContractFactory("InvestmentFactory", owner);
        investmentFactoryDeployed = await investmentFactory.deploy(investmentDeployed.address)

        FundingToken = await ethers.getContractFactory('USDC');
        fundingToken = await FundingToken.deploy(5000 * 10 ** 6);
        DaoToken = await ethers.getContractFactory('DAOToken');
        daoToken = await FundingToken.deploy(5000 * 10 ** 6);
        
        adminAddress = await owner.getAddress()
        const name = 'DAOname';
        const description = 'this is a description of the DAO';
        const fundingGoal = 10000;
        const startDate = Math.round(new Date('April 5, 2022 03:24:00').getTime()/1000);
        const endDate = Math.round(new Date('April 29, 2022 03:24:00').getTime()/1000);
        const daoAddress = '0xd71b3bd6E47B3B99aE939fbD75D3aa7002059727';

        args = [
            adminAddress,
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
            expect(await investmentFactoryDeployed.masterContractAddress())
                .to.eq(investmentDeployed.address);
        });

        it('can create an Investment', async function () {
            await investmentFactoryDeployed.createDAOFunding(...args.slice(1));
            const investmentChildAddress = investmentFactoryDeployed.investments(0);
            const investmentChildContract = investmentDeployed.attach(investmentChildAddress);
            expect(await investmentChildContract.admin()).to.eq(adminAddress);
        });

        it('can create Investment clones', async function () {
            console.log({ args });
            for (let i = 0; i < 10; i++) {
                await investmentFactoryDeployed.createDAOFunding(...args);
                const investmentChildAddress = investmentFactoryDeployed.investments(i);
                const investmentChildContract = investmentDeployed.attach(investmentChildAddress);
                expect(await investmentChildContract.admin()).to.eq(adminAddress);
            }
        });

        it('emits the InvestmentCreated event', async function () {
            await expect(investmentFactoryDeployed.createDAOFunding(...args)).to
                .emit(investmentFactoryDeployed, 'InvestmentCreated')
                .withArgs(await investmentFactoryDeployed.investments(0));
        });

    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Deposit funding tokens", function () {
        it('should fail when it receives 0 token', async () => {

        });

        it('should fail if investor does not have enough tokens', async () => {
            await investmentFactoryDeployed.createDAOFunding(...args);
            const investmentChildAddress = investmentFactoryDeployed.investments(0);
            const investmentChildContract = investmentDeployed.attach(investmentChildAddress);
            await fundingToken.transfer(investor1.address, 50);
            const investorBalance = await fundingToken.balanceOf(investor1.address);
            expect(investorBalance).to.equal(50);

            await expect(
                investmentChildContract.connect(investor1).depositAllocation(100)
            ).to.be.revertedWith('Not enough tokens');
            
            expect(
                await fundingToken.balanceOf(owner.address)
            ).to.equal(investorBalance);
        });

        it('should not allow an investor to participate twice', async () => {

        });

        it('should not receive more than the campaign goal', async () => {

        });

        it('should be called after the starting date and before the ending date', async () => {

        });

        it('should add the investor to the campaign', async () => {

        });

        it('should flag the investor as someone who invested in the campaign', async () => {

        });

        it('should update the balances after transfer', async () => {

        });
    });
    describe("Distribute DAO tokens", function () {
        it('should be called after the campaign is over', async () => {

        });

        it('should have reached the campaign goal', async () => {

        });

        it('should transfer the right amount of token to the investors', async () => {

        });
    });
    describe("Extend campaign duration", function () {
        it('should be called when the campaign is over', async () => {

        });

        it('should be called when the campaign goal has not been reached', async () => {

        });

        it('should set the campaign end date one week later', async () => {

        });
    });
});