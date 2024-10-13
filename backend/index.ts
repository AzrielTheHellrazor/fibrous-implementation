import { Router as FibrousRouter } from "./router/router.ts";
import { connect } from "@argent/get-starknet";
import { Account, Provider } from "starknet";
import type { Call } from "starknet";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers";

const fibrous = new FibrousRouter();

const tokens = await fibrous.supportedTokens("starknet");
const tokenInAddress = tokens["eth"].address;
const tokenOutAddress = tokens["usdc"].address;
const tokenInDecimals = tokens["eth"].decimals;
const inputAmount = BigNumber.from(parseUnits("1", tokenInDecimals));

// Usage on your website

const starknet = await connect({ showList: false });

await starknet.enable();

if (starknet.isConnected) {
  // Call the buildTransaction method in order to build the transaction
  // slippage: The maximum acceptable slippage of the buyAmount amount.
  // slippage formula = slippage * 100
  // value 0.005 is %0.5, 0.05 is 5%, 0.01 is %1, 0.001 is %0.1 ...
  const slippage = 0.01; // %1
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
}
