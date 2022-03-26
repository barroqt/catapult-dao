const { expect } = require('chai');
const { BigNumber, utils } = require('ethers');
const { ethers } = require('hardhat');

describe('DAOFundingFactory', function () {
    let user01
    let owner
    before(async function () {
        const [owner, signer] = await ethers.getSigners();
        user01 = signer
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
        const adminAddress = '0xdff7b4C69571eCfc041b9434Bb600639Cea175Cc'
        const usdc = '0x45ea5d57BA80B5e3b0Ed502e9a08d568c96278F9'
        const args = [adminAddress,
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
                expect(await investmentChildContract.admin()).to.eq(adminAddress);
            }
        });

        it('emits the InvestmentCreated event', async function () {
            await expect(this.daoFundingFactory.createDAOFunding(...args)).to
                .emit(this.daoFundingFactory, 'InvestmentCreated')
                .withArgs(await this.daoFundingFactory.investments(0));
        })

        // TEST ADMIN RBAC
        describe("#createAllocation", function () {
            it('throw error if called by user without ADMIN role ', async function () {
                await this.daoFundingFactory.createDAOFunding(...args);
                const investmentChildAddress = this.daoFundingFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
                await expect(investmentChildContract.connect(user01).createAllocation(
                    investorAddr,
                    1000
                )).to.be.revertedWith('Caller is not an Admin')
            })

            it('should pass  if called by user with ADMIN role ', async function () {
                const adminArgs = [...args]
                adminArgs[0] = user01.getAddress()
                await this.daoFundingFactory.createDAOFunding(...adminArgs);
                const investmentChildAddress = this.daoFundingFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                // const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
                // TODO FIX this test
                const investorAddrs = ['0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', '0xdd2fd4581271e230360230f9337d5c0430bf44c0']
                for (let i = 0; i < investorAddrs.length; i++) {
                    const investorAddr = investorAddrs[i]
                    expect(await investmentChildContract.connect(user01).createAllocation(
                        investorAddr,
                        1000
                    )).to.have.property('hash')
                    const expectedAlloc = (await investmentChildContract.connect(user01).allocations(i))
                    expect(expectedAlloc.length).to.eq(3)
                    expect(expectedAlloc.allocationSize).to.eq(1000)
                    expect(expectedAlloc.investor.toLowerCase()).to.eq(investorAddr.toLowerCase())
                    expect(expectedAlloc.fundedSize).to.eq(0)
    
                    const investorIdx = (await investmentChildContract.connect(user01).allocationsMap(investorAddr))
                    expect(investorIdx).to.eq(i)

                }
            })
        })
    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Investment", function () {

    });
});