export const MINTPAD_ADDRESS = '0xaaae0243007AA3000000d8e8bEeF0a944A0d3900';

export const MINTPAD_ABI = [
  {
    "type": "function", 
    "name": "mint",
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "name", "type": "string"},
      {"name": "symbol", "type": "string"}, 
      {"name": "uri", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
];
