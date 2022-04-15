import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

import config from "../config.js";

import InvestmentFactoryArtifact from "../contracts/InvestmentFactory.json";
import InvestmentFactoryAddress from "../contracts/InvestmentFactory_address.json";

import InvestmentArtifact from "../contracts/Investment.json";
import InvestmentAddress from "../contracts/Investment_address.json";

const dataTest = {
    funds: [{
            addr: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c669',
            owner: '0x1c0EafcD1656CA92e841e10889F3209a905aee77',
            name: 'Fund my goal',
            desc: 'Project to help something grow',
            startDate: '2022-03-30',
            endDate: '2022-04-20',
            currency: 'USDC',
            current: '200',
            goal: '10000',
            participants: [{
                key: 1,
                address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c500',
                amount: '50',
            }, {
                key: 2,
                address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c599',
                amount: '150',
            }]
        }, {
            addr: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c670',
            owner: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c671',
            name: 'Fund my goal 2',
            desc: 'Project to help something grow to the sky',
            startDate: '2022-03-30',
            endDate: '2022-04-20',
            currency: 'USDC',
            current: '0',
            goal: '35000',
        },
    ],
};

const Web3Context = React.createContext({
    web3: null,
    signer: null,
    account: null,
    loading: false,
    factoryContract: null,

    loadingDAO: false,
    successDAO: false,
    errorDAO: false,
    createDAO: () => {},

    approve: () => {},
    initWeb3Modal: () => {},
    doParticipate: () => {},

    getCampaign: () => {},
    getFundings: () => {},
    fundings: null,
    fundData: null,
});

export const Web3ContextProvider = (props) => {
    const [web3, setWeb3] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDAO, setLoadingDAO] = useState(false);
    const [successDAO, setSuccessDAO] = useState(false);
    const [errorDAO, setErrorDAO] = useState(false);
    const [fundings, setFundings] = useState(null);
    const [fundData, setFundData] = useState(null);

    const [factoryContract, setFactoryContract] = useState(null);

    useEffect(() => {
        const initData = async () => {
            const count = await factoryContract.sizeInvestment();
            console.log({ count: parseInt(count.toString()) });
            if (parseInt(count.toString()) > 0) {
                await getFundings();
            }
        }
        factoryContract && signer && initData();

    }, [factoryContract])

    useEffect(() => {
        const initUrlWeb3 = async () => {
            console.log('initUrlWeb3');
            setLoading(true)
            try {
                const provider = new ethers.providers.JsonRpcProvider(config.PROD.RPC);
                setWeb3(provider);
                console.log("No web3 instance injected, using Local web3.");
                initContracts(provider);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }

        !web3 && initUrlWeb3()
    }, [web3]);

    useEffect(() => {
       window.ethereum.on('accountsChanged', accounts => window.location.reload())
       window.ethereum.on('chainChanged', () => window.location.reload())
       window.ethereum.on('connect', (connectInfo) => { console.log({connectInfo}); })
    }, [])

    const initContracts = (provider) => {
        const signer = provider.getSigner();
        const investmentFactory = new ethers.Contract(
            InvestmentFactoryAddress.Contract,
            InvestmentFactoryArtifact.abi,
            signer);
        setFactoryContract(investmentFactory);
    }

    const initWeb3Modal = async () => {
        console.log('initWeb3Modal');
        try {
            setLoading(true)
            const providerOptions = {
                walletlink: {
                    package: CoinbaseWalletSDK,
                    options: {
                        appName: "CatapultDAO",
                        infuraId: process.env.INFURA_KEY
                    }
                },
                walletconnect: {
                    package: WalletConnect,
                    options: {
                        infuraId: process.env.INFURA_KEY
                    }
                }
            };

            const web3Modal = new Web3Modal({
                cacheProvider: true, // optional
                providerOptions // required
            });

            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const network = await provider.getNetwork();
            const signer = provider.getSigner();
            const balance = await signer.getBalance();
            const address = await signer.getAddress();
            const txCount = await signer.getTransactionCount();
            const newAcc = {
                balance: ethers.utils.formatEther(balance._hex),
                address,
                txCount,
                network,
            };
            console.log(newAcc);
            setWeb3(provider);
            setSigner(signer);
            setAccount(newAcc);
            initContracts(provider);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    }

    const doParticipate = async (/*amount*/) => {
        console.log('doParticipate');
        if (!fundData) return false;
        try {
            console.log({ fundData });
            const investment = new ethers.Contract(
                fundData.addr,
                InvestmentArtifact.abi,
                signer);

            console.log({ investment });
            const deposit = await investment.depositAllocation(10);
            console.log({ deposit });
            /*const addr = await signer.getAddress();
            setParticipation({
                key: 1,
                address: addr,
                amount
            });*/
        } catch (e) {
            console.log(e);
        }
    }

    const getFundings = async () => {
        const campaigns = [];
        const count = await factoryContract.sizeInvestment();
        for (let i = 0; i < count; i++) {
            const contract = await factoryContract.investments(i);
            const campaign = await getCampaign(contract);
            campaigns.push(campaign);
        }
        console.log({ campaigns });
        setFundings(campaigns);
    }

    const getCampaign = async (contract, save=false) => {
        const investment = new ethers.Contract(
            contract,
            InvestmentArtifact.abi,
            signer);
        const owner = await investment.admin();
        const fundingToken = await investment.fundingToken();
        const result = await investment.campaign();
        const campaign = {
            addr: contract,
            owner: owner,
            name: result._name,
            desc: result._description,
            startDate: result.startDate.toNumber(),
            endDate: result.endDate.toNumber(),
            currency: fundingToken,
            current: result.totalInvestedAmount.toNumber(),
            goal: result.fundingGoal.toNumber(),
            participants: result.investors,
        };

        if (save) setFundData(campaign)
        return campaign;
    }

    const createDAO = async (data) => {
        try {
            const count = await factoryContract.sizeInvestment();
            setSuccessDAO(false);
            setErrorDAO(false);
            setLoadingDAO(true);
            const create = await factoryContract.createDAOFunding(
                data.name, // name
                '', // desc
                data.fundingGoal, // fundingGoal
                data.date, // startDate
                data.enddate, // endDate
                "0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70", // daoToken (avax fuji)
                "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // daoAddress addr
                "0xA048B6a5c1be4b81d99C3Fd993c98783adC2eF70", // fundingToken (avax fuji)
            );
            setSuccessDAO(true);
        } catch (e) {
            console.log(e);
            setErrorDAO(true);
        }
        setLoadingDAO(false);
    }

    const approve = async () => {
        console.log('approve')
    }

    return (
        <Web3Context.Provider
            value={{
                web3,
                signer,
                loading,
                loadingDAO,
                successDAO,
                errorDAO,
                createDAO,
                approve,
                initWeb3Modal,
                fundings,
                doParticipate,
                getFundings,
                getCampaign,
                fundData,
                account,
            }}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Web3Context;