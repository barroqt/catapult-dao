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
        it('has the Investment address', async function () {
            expect(await this.daoFundingFactory.masterContractAddress())
                .to.eq(this.investment.address);
        });

        it('can create Investment clones', async function () {
            const admin = '0xdff7b4C69571eCfc041b9434Bb600639Cea175Cc'
            // const i = 0
            for (let i = 0; i < 10; i++) {
                await this.daoFundingFactory.createDAOFunding(admin);
                const investmentChildAddress = this.daoFundingFactory.investments(i);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                // expect(await investmentChildContract.x()).to.eq(i);
                expect(await investmentChildContract.admin()).to.eq(admin);
            }
        });

        it('emits the event', async function () {
            const adminAddress = '0xdff7b4C69571eCfc041b9434Bb600639Cea175Cc'
            await expect(this.daoFundingFactory.createDAOFunding(adminAddress)).to
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