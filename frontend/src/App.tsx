import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [token1, setToken1] = useState<string>("ETH");
  const [token2, setToken2] = useState<string>("DAI");
  const [amount, setAmount] = useState<number | string>("");

  const handleSwap = () => {
    const temp = token1;
    setToken1(token2);
    setToken2(temp);
  };

  const handleExecute = () => {
    alert(`Swapping ${amount} ${token1} to ${token2}`);
  };

  return (
    <div className="swap-container">
      <div className="token-select">
        <label htmlFor="token1">Token 1:</label>
        <select
          id="token1"
          value={token1}
          onChange={(e) => setToken1(e.target.value)}
        >
          <option value="ETH">ETH</option>
          <option value="DAI">DAI</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <button id="swap-button" onClick={handleSwap}>
        ↔
      </button>

      <div className="token-select">
        <label htmlFor="token2">Token 2:</label>
        <select
          id="token2"
          value={token2}
          onChange={(e) => setToken2(e.target.value)}
        >
          <option value="DAI">DAI</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="amount-input">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button id="execute-button" onClick={handleExecute}>
        Execute Swap
      </button>
    </div>
  );
};

export default App;
