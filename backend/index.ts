import { Router as FibrousRouter } from "fibrous-router-sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers";
import { connect } from "@argent/get-starknet";
import { Call } from "starknet";

const fibrous = new FibrousRouter();

const tokens = await fibrous.supportedTokens("starknet");
const tokenInAddress = tokens["eth"].address;
const tokenOutAddress = tokens["usdc"].address;
const tokenInDecimals = Number(tokens["eth"].decimals);
const inputAmount = BigNumber.from(parseUnits("1", tokenInDecimals));

const starknet = await connect({ showList: false });

await starknet.enable();

if (starknet.isConnected) {
  // Call the buildTransaction method in order to build the transaction
  // slippage: The maximum acceptable slippage of the buyAmount amount.
  const slippage = 1; // %1 slippage
  const receiverAddress = starknet.selectedAddress;

  const approveCall: Call = await fibrous.buildApproveStarknet(
    inputAmount,
    tokenInAddress
  );

  const swapCall: Call = await fibrous.buildTransaction(
    inputAmount,
    tokenInAddress,
    tokenOutAddress,
    slippage,
    receiverAddress,
    "starknet"
  );

  await starknet.account.execute([approveCall, swapCall]);
}
