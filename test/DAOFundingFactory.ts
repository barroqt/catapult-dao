const { expect } = require('chai');
const { BigNumber, utils } = require('ethers');
const { ethers } = require('hardhat');

describe('DAOFundingFactory', function () {
    before(async function () {
        const [owner, admin] = await ethers.getSigners();
        this.Investment = await ethers.getContractFactory("Investment", owner);
        this.DAOFundingFactory = await ethers.getContractFactory("DAOFundingFactory", owner);
    });

    beforeEach(async function () {
        this.investment = await this.Investment.deploy();
        this.daoFundingFactory = await this.DAOFundingFactory.deploy(this.investment.address)
        await this.daoFundingFactory.deployed()
    });

    // Test cases

    //////////////////////////////
    //  DAOFundingFactory
    //////////////////////////////
    describe("DAOFundingFactory", function () {
        const admin = '0xdff7b4C69571eCfc041b9434Bb600639Cea175Cc'
        const usdc = '0x45ea5d57BA80B5e3b0Ed502e9a08d568c96278F9'
        const args = [admin,
            1000,
            usdc,
            100,
            200]
        it('has the Investment address', async function () {
            expect(await this.daoFundingFactory.masterContractAddress())
                .to.eq(this.investment.address);
        });

        it('can create Investment clones', async function () {

            for (let i = 0; i < 10; i++) {
                await this.daoFundingFactory.createDAOFunding(...args);
                const investmentChildAddress = this.daoFundingFactory.investments(i);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                expect(await investmentChildContract.admin()).to.eq(admin);
            }
        });

        it('emits the InvestmentCreated event', async function () {
            const adminAddress = '0xdff7b4C69571eCfc041b9434Bb600639Cea175Cc'
            await expect(this.daoFundingFactory.createDAOFunding(...args)).to
                .emit(this.daoFundingFactory, 'InvestmentCreated')
                .withArgs(await this.daoFundingFactory.investments(0));
        })
    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Investment", function () {

    });
});