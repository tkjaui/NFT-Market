import "../styles/globals.css";
import Link from "next/link";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [currentAccount, setCurrentAccount] = useState();

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) return alert("Please install metmask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log(accounts[0]);
      } else {
        console.log("no accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <div className="gradient-bg">
      <nav className="border-b p-6 text-white text-center">
        <p className="text-4xl font-bold ">🌟NFT Market🌟</p>
        <div className="mt-4 ">
          <Link href="/">
            <a className="mr-6 ">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 ">Create NFT</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 ">My NFT</a>
          </Link>

          {/* <Link href="/send-crypto">
            <a className="mr-6 ">Send Crypto</a>
          </Link> */}
          <Link href="/creator-dashboard">
            <a className="mr-6 ">Dashboard</a>
          </Link>
          {!currentAccount && (
            <button
              type="button"
              className="items-center my-5 bg-[#2952e3] p-3 rounded-xl cursor-pointer hover:bg-[#2546bd] "
              onClick={connectWallet}
            >
              <p className="text-white font-semibold">Connect Wallet</p>
            </button>
          )}
        </div>

        <div className="flex  flex-row-reverse">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {currentAccount && currentAccount.slice(0, 6) + "....."}
                </p>
                <p className="text-white semi-bold text-lg mt-1">Ethereum</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />

      <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
        <div className="w-full  sm:flex-row  text-center my-4 ">
          <div className="mt-4  text-white">
            <Link href="/">
              <a className="mr-6 ">Home</a>
            </Link>
            <Link href="/create-item">
              <a className="mr-6 ">Create NFT</a>
            </Link>
            <Link href="/my-assets">
              <a className="mr-6 ">My NFT</a>
            </Link>

            {/* <Link href="/send-crypto">
              <a className="mr-6 ">Send Crypto</a>
            </Link> */}
            <Link href="/creator-dashboard">
              <a className="mr-6 ">Dashboard</a>
            </Link>
            {!currentAccount && (
              <button
                type="button"
                className="items-center my-5 bg-[#2952e3] p-3 rounded-xl cursor-pointer hover:bg-[#2546bd] "
                onClick={connectWallet}
              >
                <p className="text-white font-semibold">Connect Wallet</p>
              </button>
            )}
          </div>
        </div>

        <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />
        <div className="sm:w-[90%] w-full flex justify-between items-center mt-3 ">
          <p className="text-white text-sm text-center  ">@Taku</p>
          <p className="text-white text-sm text-center  ">
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyApp;
