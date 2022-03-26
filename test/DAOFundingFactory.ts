const { expect } = require('chai');
const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

describe('DAOFundingFactory', function () {
    before(async function () {
        const [owner] = await ethers.getSigners();
        this.DAOFunding = await ethers.getContractFactory("DAOFunding", owner);
        this.DAOFundingFactory = await ethers.getContractFactory("DAOFundingFactory", owner);
    });

    beforeEach(async function () {
        this.daoFunding = await this.DAOFunding.deploy();
        this.daoFundingFactory = await this.DAOFundingFactory.deploy(this.daoFunding.address)
        await this.daoFundingFactory.deployed()
    });

    // Test cases

    //////////////////////////////
    //  DAOFundingFactory
    //////////////////////////////
    describe("DAOFundingFactory", function () {
        it('has the DAOFunding address', async function () {
            expect(await this.daoFundingFactory.masterContractAddress())
                .to.eq(this.daoFunding.address);
        });

        it('can create DAOFundings', async function () {
            for (let i = 0; i < 10; i++) {
                await this.daoFundingFactory.createDAOFunding(i);
                const childAddress = this.daoFundingFactory.children(i);
                const childContract = this.daoFunding.attach(childAddress);
                expect(await childContract.x()).to.eq(i);
            }
        });

        it('emits the event', async function () {
            await expect(this.daoFundingFactory.createDAOFunding(10)).to
                .emit(this.daoFundingFactory, 'DAOFundingCreated')
                .withArgs(await this.daoFundingFactory.children(0));
        })
    });

    //////////////////////////////
    //  DAOFunding
    //////////////////////////////
    describe("DAOFunding", function () {

    });
});