const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('InvestmentFactory', function () {
    before(async function () {
        const [owner] = await ethers.getSigners();
        this.Investment = await ethers.getContractFactory("Investment", owner);
        this.InvestmentFactory = await ethers.getContractFactory("InvestmentFactory", owner);
    });

    beforeEach(async function () {
        this.investment = await this.Investment.deploy();
        this.investmentFactory = await this.InvestmentFactory.deploy(this.investment.address)
        await this.investmentFactory.deployed()
    });

    // Test cases

    //////////////////////////////
    //  InvestmentFactory
    //////////////////////////////
    describe("InvestmentFactory", function () {
        it('has the Investment address', async function () {
            expect(await this.investmentFactory.masterContractAddress())
                .to.eq(this.investment.address);
        });

        it('can create Investment clones', async function () {
            for (let i = 0; i < 10; i++) {
                await this.investmentFactory.createDAOFunding(i);
                const investmentChildAddress = this.investmentFactory.investments(i);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                expect(await investmentChildContract.x()).to.eq(i);
            }
        });

        it('emits the event', async function () {
            await expect(this.investmentFactory.createDAOFunding(10)).to
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