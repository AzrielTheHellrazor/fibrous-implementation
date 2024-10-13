"use client";

import { useState, useEffect } from "react";
import { Call } from "starknet";
import { connect } from "@argent/get-starknet";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers";
import "./App.css";

// Assuming FibrousRouter is correctly imported and configured
import { Router as FibrousRouter } from "./router/router.ts";

// Define a type for the token object
interface Token {
  address: string;
  decimals: number;
  // Add other properties as needed
}

export default function SwapApp() {
  const [token1, setToken1] = useState<string>("ETH");
  const [token2, setToken2] = useState<string>("DAI");
  const [amount, setAmount] = useState<string>("");
  const [tokens, setTokens] = useState<{ [key: string]: Token }>({});
  const fibrous = new FibrousRouter();

  useEffect(() => {
    const fetchTokens = async () => {
      const tokenData = await fibrous.supportedTokens("starknet");
      setTokens(tokenData);
    };

    fetchTokens();
  }, []);

  const handleSwap = () => {
    setToken1(token2);
    setToken2(token1);
  };

  const handleExecute = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const starknet = await connect({ showList: false });
      await starknet.enable();

      if (starknet.isConnected) {
        const tokenInAddress = tokens[token1]?.address;
        const tokenOutAddress = tokens[token2]?.address;
        const tokenInDecimals = tokens[token1]?.decimals;

        const inputAmount = BigNumber.from(parseUnits(amount, 18));

        const slippage = 0.01; // 1%
        const receiverAddress = starknet.selectedAddress;

        const approveCall: Call = await fibrous.buildApproveStarknet(
          inputAmount,
          tokenInAddress
        );

        const swapCall = await fibrous.buildTransaction(
          inputAmount,
          tokenInAddress,
          tokenOutAddress,
          slippage,
          receiverAddress,
          "starknet"
        );

        await starknet.account.execute([approveCall, swapCall]);
        alert(`Successfully swapped ${amount} ${token1} to ${token2}`);
      }
    } catch (error) {
      console.error("An error occurred during the swap:", error);
      alert("An error occurred during the swap.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <select
            value={token1}
            onChange={(e) => setToken1(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(tokens).map((token) => (
              <option key={token} value={token}>
                {token.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            ↔
          </button>
          <select
            value={token2}
            onChange={(e) => setToken2(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(tokens).map((token) => (
              <option key={token} value={token}>
                {token.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleExecute}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Execute Swap
        </button>
      </div>
    </div>
  );
}
