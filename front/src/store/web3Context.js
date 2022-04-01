import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

import config from "../config.js";

import InvestmentFactory from "../contracts/DAOFundingFactory.json";

const Web3Context = React.createContext({
    web3: null,
    signer: null,
    investmentDAO: null,
    factoryContract: null,
    approve: () => {},
    loading: false,
    initWeb3Modal: () => {},
    createDAO: () => {},
    getInvestment: () => {},
    doParticipate: () => {},
    participation: null,
    investment: null
});

export const Web3ContextProvider = (props) => {
    const [web3, setWeb3] = useState(null);
    const [signer, setSigner] = useState(null);
    const [investment, setInvestment] = useState(null);
    const [investmentDAO, setInvestmentDAO] = useState(null);
    const [participation, setParticipation] = useState(null);
    const [factoryContract, setFactoryContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDAO, setLoadingDAO] = useState(false);

    useEffect(() => {
        const initData = async () => {
            await getInvestments(0);
        }
        factoryContract && initData();

    }, [factoryContract])

    useEffect(() => {
        const initUrlWeb3 = async () => {
            setLoading(true)
            try {
                const provider = new ethers.providers.JsonRpcProvider(config.PROD.RPC);
                setWeb3(provider);
                console.log("No web3 instance injected, using Local web3.");

                const investmentFactory = new ethers.Contract(
                    config.PROD.FACTORY_ADDRESS,
                    InvestmentFactory.abi,
                    provider);

                setFactoryContract(investmentFactory);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }

        !web3 && initUrlWeb3()
    }, [web3]);

    const initWeb3Modal = async () => {
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
            const signer = provider.getSigner();

            const investmentFactory = new ethers.Contract(
                config.PROD.FACTORY_ADDRESS,
                InvestmentFactory.abi,
                signer);

            setWeb3(provider);
            setSigner(signer);
            setFactoryContract(investmentFactory);

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    }

    const doParticipate = async (amount) => {
        try {
            await factoryContract.createDAOFunding(10);
            const addr = await signer.getAddress();
            setParticipation({
                key: 1,
                address: addr,
                amount
            });
        } catch (e) {
            console.log(e)
        }
    }

    const getInvestments = async (i) => {
        try {
            const invest = await factoryContract.investments(i);
            setInvestment(invest);
        } catch (e) {
            console.log(e)
        }
    }

    const createDAO = async (data) => {
        try {
            setLoadingDAO(true);
            console.log({ data });
            await factoryContract.createDAOFunding(10);
        } catch (e) {
            console.log(e);
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
                investmentDAO,
                factoryContract,
                loading,
                loadingDAO,
                approve,
                initWeb3Modal,
                createDAO,
                investment,
                participation,
                doParticipate
            }}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Web3Context;