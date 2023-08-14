import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  // console.log({
  //   provider,
  //   signer,
  //   transactionContract
  // })
  return transactionContract;
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
 // const [ connectedAccount, setConnectedAccount ] = useState('');
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
   const [isLoading, setIsLoading] = useState(false);
   const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
   const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try{
      if(!ethereum) return alert("Please install metamask");
      const transactionsContract = getEthereumContract();
      
      const availableTransactions = await transactionsContract.getAllTransactions();
      
      // console.log(availableTransactions);

      const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

      console.log(structuredTransactions);
      setTransactions(structuredTransactions);

    } catch (error){
       console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try{
       if(!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if(accounts.length){
      setCurrentAccount(accounts[0]);

      getAllTransactions()
      }

      console.log(accounts);
    }
    catch (error){
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  const checkIfTransactionsExists = async () => {
    try{
      const transactionsContract = getEthereumContract();
      const transactionsCount = await transactionsContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    }catch (error){
      console.log(error);

      throw new Error("No ethereum object");
    }
  }
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      console.log(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  const sendTransaction = async() => {
    try{
      if(!ethereum) return alert("Please install metamask");

      // get the data from form
      const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());

    }catch(error){
      console.log(error);

      throw new Error("No ethereum object");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
  }, []);


  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction, transactions, isLoading }}>
      {children}
    </TransactionContext.Provider>
  )
}