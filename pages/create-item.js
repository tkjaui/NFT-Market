import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import Image from "next/image";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      //try uploading the file
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      //file saved in the url path below
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileUrl(url);
    } catch (error) {
      console.log(error);
    }
  }

  //create item and upload to ipfs
  async function createItem() {
    //get the value from the form input
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      //pass the url to save on chain after it has been uploaded to IPFS
      createSale(url);
    } catch (error) {
      console.log(error);
    }
  }

  //List item for sale
  async function createSale(url) {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //sign the transaction
    const signer = provider.getSigner();
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    //get the tokenid from the transaction that occured above
    //there events array that is returned, the first item from that event
    //is the event, third item is the token id
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    //get a reference to the price entered in the form
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);

    //get the listing price
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });

    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-2 blue-glassmorphism">
        <input
          placeholder="Asset Name"
          className="my-2 mx-2 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset description"
          className="my-2 mx-2 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in ETH"
          className="my-2 mx-2 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
          type="number"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <label>
          <input
            type="file"
            name="Asset"
            className="items-center rounded-xl "
            onChange={onChange}
          />
          Select File
        </label>
        {/* <p className="text-white text-center">file does not selected.</p> */}

        {fileUrl && (
          <Image
            src={fileUrl}
            alt="Picture of the author"
            className="rounded mt-4 mx-2"
            width={250}
            height={300}
          />
        )}
        <button
          onClick={createItem}
          className="font-bold mx-2 mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
