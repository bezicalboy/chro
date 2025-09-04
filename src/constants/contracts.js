export const CHRONOS_ADDRESS = '0x0000000000000000000000000000000000000830';

export const CHRONOS_ABI = [
  {
    "type": "function",
    "name": "createCron",
    "inputs": [
      {"name": "contractAddress", "type": "address"},
      {"name": "abi", "type": "string"},
      {"name": "methodName", "type": "string"},
      {"name": "params", "type": "string[]"},
      {"name": "frequency", "type": "uint64"},
      {"name": "expirationBlock", "type": "uint64"},
      {"name": "gasLimit", "type": "uint64"},
      {"name": "maxGasPrice", "type": "uint64"}
    ],
    "outputs": [{"name": "success", "type": "bool"}],
    "stateMutability": "nonpayable"
  }
];

export const TARGET_CONTRACT = {
  address: '0xFfcc21F45b9456DFB0A7AC24A6444c67aAc66cE8',
  abi: JSON.stringify([
    {
      "inputs": [],
      "name": "count",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "increment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ])
};
