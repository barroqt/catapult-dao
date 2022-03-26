const { expect } = require('chai');
const { BigNumber, utils } = require('ethers');
const { ethers } = require('hardhat');

describe('InvestmentFactory', function () {
    let user01 // this should be ADMIN user
    let owner
    let signers
    let investor1
    let investor2
    
    before(async function () {
        // TODO: need to chagen signer to load form private key.

                /**
                 * Investor call depositAllocation
                 * Account #15: 0xcd3b766ccdd6ae721141f452c550ca635964ce71 (10000 ETH)
                 * Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61
                 */

        // // const network = 'http://127.0.0.1:8545/';
        // const network = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        // const provider = ethers.providers.getDefaultProvider(network);
        
        // const privateKey = '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61'
        // const walletSigner = new ethers.Wallet(privateKey, provider);


        const signers = await ethers.getSigners();

        const [owner, signer, ] = signers
        user01 = signer
        investor1 = signers[2]
        investor2 = signers[3]

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
                await expect(investmentChildContract.connect(user01).createAllocation(
                    investorAddr,
                    1000
                )).to.be.revertedWith('Caller is not an Admin')
            })

            it('should pass  if called by user with ADMIN role ', async function () {
                const adminArgs = [...args]
                adminArgs[0] = user01.getAddress()
                await this.investmentFactory.createDAOFunding(...adminArgs);
                const investmentChildAddress = this.investmentFactory.investments(0);
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

                
                const [owner, investor1] = await ethers.getSigners();
                const x = await investmentChildContract.connect(investor1).createAllocation(
                    '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199',
                    1000
                )
                
            })
        })

        // describe("#depositAllocation", function () {
        //     // it('throw error if called by user without ADMIN role ', async function () {
        //     //     await this.investmentFactory.createDAOFunding(...args);
        //     //     const investmentChildAddress = this.investmentFactory.investments(0);
        //     //     const investmentChildContract = this.investment.attach(investmentChildAddress);
        //     //     const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
        //     //     await expect(investmentChildContract.connect(user01).createAllocation(
        //     //         investorAddr,
        //     //         1000
        //     //     )).to.be.revertedWith('Caller is not an Admin')
        //     // })

        //     it('should pass if called by user with ADMIN role ', async function () {
        //         const adminArgs = [...args]
        //         adminArgs[0] = user01.getAddress()
        //         await this.investmentFactory.createDAOFunding(...adminArgs);
        //         const investmentChildAddress = this.investmentFactory.investments(0);
        //         const investmentChildContract = this.investment.attach(investmentChildAddress);
        //         // const investorAddr = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
        //         // TODO FIX this test
        //         const investorAddrs = ['0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', '0xdd2fd4581271e230360230f9337d5c0430bf44c0']
        //         for (let i = 0; i < investorAddrs.length; i++) {
        //             const investorAddr = investorAddrs[i]
        //             expect(await investmentChildContract.connect(user01).createAllocation(
        //                 investorAddr,
        //                 1000
        //             )).to.have.property('hash')
        //             const expectedAlloc = (await investmentChildContract.connect(user01).allocations(i))
        //             expect(expectedAlloc.length).to.eq(3)
        //             expect(expectedAlloc.allocationSize).to.eq(1000)
        //             expect(expectedAlloc.investor.toLowerCase()).to.eq(investorAddr.toLowerCase())
        //             expect(expectedAlloc.fundedSize).to.eq(0)
    
        //             const investorIdx = (await investmentChildContract.connect(user01).allocationsMap(investorAddr))
        //             expect(investorIdx).to.eq(i)

        //         }
        //     })
        // })        
    });

    //////////////////////////////
    //  Investment
    //////////////////////////////
    describe("Investment", function () {

    });
});