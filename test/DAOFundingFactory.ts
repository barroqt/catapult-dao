import { expect } from 'chai'; 
import{ Contract } from 'ethers'; 
import { ethers } from 'hardhat';

describe('InvestmentFactory', function () {
    let adminUser // this should be ADMIN user
    let owner
    let signers
    let investor1
    let investor2
    let usdc
    let args
    let adminAddress
    let testCoin
    before(async function () {
        const signers = await ethers.getSigners();
        owner = signers[0]
        adminUser = signers[1]
        investor1 = signers[2]
        investor2 = signers[3]

        this.Investment = await ethers.getContractFactory("Investment", owner);
        this.InvestmentFactory = await ethers.getContractFactory("InvestmentFactory", owner);
        this.TestCoin = await ethers.getContractFactory("TestToken", owner);
    });

    beforeEach(async function () {
        this.investment = await this.Investment.deploy();
        this.investmentFactory = await this.InvestmentFactory.deploy(this.investment.address)
        await this.investmentFactory.deployed()

        testCoin = await this.TestCoin.deploy(5000)
        await testCoin.deployed()
        console.log("#testCoin", testCoin.address)
        
        usdc = testCoin.address
        adminAddress = await adminUser.getAddress()
        args = [
            adminAddress,
            1000,
            usdc,
            100,
            200]
            const inv1Address = await investor1.getAddress()
        await testCoin.transfer(inv1Address, 900)
        console.log('#inv1Address balance ', await testCoin.balanceOf(inv1Address))
        console.log('#owner balance ', await testCoin.balanceOf(await owner.getAddress()))
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

        // TEST ADMIN RBAC
        describe("#createAllocation", function () {
            it('throw error if called by user without ADMIN role ', async function () {
                await this.investmentFactory.createDAOFunding(...args);
                const investmentChildAddress = this.investmentFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
                await expect(investmentChildContract.connect(adminUser).createAllocation(
                    investorAddr,
                    1000
                )).to.be.revertedWith('Caller is not an Admin')
            })

            it('should pass  if called by user with ADMIN role ', async function () {
                const adminArgs = [...args]
                adminArgs[0] = adminUser.getAddress()
                await this.investmentFactory.createDAOFunding(...adminArgs);
                const investmentChildAddress = this.investmentFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                // const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
                // TODO FIX this test

                const investorAddrs = ['0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', '0xdd2fd4581271e230360230f9337d5c0430bf44c0']
                
                for (let i = 0; i < investorAddrs.length; i++) {
                    const investorAddr = investorAddrs[i]
                    expect(await investmentChildContract.connect(adminUser).createAllocation(
                        investorAddr,
                        1000
                    )).to.have.property('hash')
                    const expectedAlloc = (await investmentChildContract.connect(adminUser).allocations(i))
                    expect(expectedAlloc.length).to.eq(3)
                    expect(expectedAlloc.allocationSize).to.eq(1000)
                    expect(expectedAlloc.investor.toLowerCase()).to.eq(investorAddr.toLowerCase())
                    expect(expectedAlloc.fundedSize).to.eq(0)
    
                    const investorIdx = (await investmentChildContract.connect(adminUser).allocationsMap(investorAddr))
                    expect(investorIdx).to.eq(i)
                }
            })

            // 

        })



        describe("#depositAllocation", function () {
            it('throw error if called by user without INVESTOR role ', async function () {
                const adminArgs = [...args]
                adminArgs[0] = adminUser.getAddress()
                await this.investmentFactory.createDAOFunding(...adminArgs);
                const investmentChildAddress = this.investmentFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                
                const investorAddr = await investor1.getAddress()
                expect(await investmentChildContract.connect(adminUser).createAllocation(
                    investorAddr,
                    1000
                )).to.have.property('hash')
                const expectedAlloc = (await investmentChildContract.connect(adminUser).allocations(0))
                expect(expectedAlloc.length).to.eq(3)
                expect(expectedAlloc.allocationSize).to.eq(1000)
                await expect(investmentChildContract.connect(adminUser).depositAllocation(1000)).to.be.revertedWith('Caller is not an Investor')
            })

            it('should pass  if called by user with INVESTOR role ', async function () {
                const adminArgs = [...args]
                adminArgs[0] = adminUser.getAddress()
                await this.investmentFactory.createDAOFunding(...adminArgs);
                const investmentChildAddress = this.investmentFactory.investments(0);
                const investmentChildContract = this.investment.attach(investmentChildAddress);
                
                const investorAddr = await investor1.getAddress()
                expect(await investmentChildContract.connect(adminUser).createAllocation(
                    investorAddr,
                    1000
                )).to.have.property('hash')

                const expectedAlloc = (await investmentChildContract.connect(investorAddr).allocations(0))
                expect(expectedAlloc.length).to.eq(3)
                expect(expectedAlloc.allocationSize).to.eq(1000)
                
                const result = await investmentChildContract.connect(investor1).depositAllocation(10)

                expect(result).to.eq(1)
            })


        })
      
    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Investment", function () {

    });
});