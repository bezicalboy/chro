import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseGwei } from 'viem';
import { MINTPAD_ADDRESS } from '../constants/nft-contracts';

// Convert string to hex (without 0x prefix)
const stringToHex = (str) => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
};

// Generate random names and symbols
const generateRandomName = () => {
  const names = ['CoolNFT', 'AwesomeArt', 'MegaToken', 'SuperNFT', 'EpicArt', 'UltraNFT', 'FireNFT', 'RareGem'];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomSymbol = () => {
  const symbols = ['CNT', 'ART', 'MTA', 'SNT', 'EPA', 'UNT', 'FNT', 'RGM'];
  return symbols[Math.floor(Math.random() * symbols.length)];
};

export default function NFTMinter() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const [nftData, setNftData] = useState({
    name: generateRandomName(),
    symbol: generateRandomSymbol(),
  });
  
  const [gasSettings, setGasSettings] = useState({
    gasLimit: '350000',
    gasPrice: '20',
  });
  
  const { sendTransaction, data: hash, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const mintNFTRaw = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    
    try {
      // Your original WORKING transaction hex data (replace this with your actual hex)
      let originalHex = "0x40c10f19000000000000000000000000" + address.slice(2).toLowerCase() + "00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000006736361727979000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035343410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c68747470733a2f2f697066732e696f2f697066732f516d596f757248617368486572650000000000000000000000000000000000000000000000000000000000";
      
      // Original values in hex
      const originalNameHex = stringToHex('scaryy');  // 736361727979
      const originalSymbolHex = stringToHex('SCA');    // 534341
      
      // New values in hex
      const newNameHex = stringToHex(nftData.name);
      const newSymbolHex = stringToHex(nftData.symbol);
      
      console.log('Original name hex:', originalNameHex);
      console.log('New name hex:', newNameHex);
      console.log('Original symbol hex:', originalSymbolHex);
      console.log('New symbol hex:', newSymbolHex);
      
      // Replace the hex portions
      let modifiedHex = originalHex;
      
      // Replace name (pad with zeros to maintain length)
      const paddedNewName = newNameHex.padEnd(12, '0'); // Pad to 6 bytes (12 hex chars)
      const paddedOriginalName = originalNameHex.padEnd(12, '0');
      modifiedHex = modifiedHex.replace(paddedOriginalName, paddedNewName);
      
      // Replace symbol (pad with zeros to maintain length)
      const paddedNewSymbol = newSymbolHex.padEnd(6, '0'); // Pad to 3 bytes (6 hex chars)
      const paddedOriginalSymbol = originalSymbolHex.padEnd(6, '0');
      modifiedHex = modifiedHex.replace(paddedOriginalSymbol, paddedNewSymbol);
      
      console.log('Original hex length:', originalHex.length);
      console.log('Modified hex length:', modifiedHex.length);
      
      // Send the modified transaction
      await sendTransaction({
        to: MINTPAD_ADDRESS,
        data: modifiedHex,
        gas: BigInt(gasSettings.gasLimit),
        gasPrice: parseGwei(gasSettings.gasPrice),
        value: 0n,
      });
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new random values
  const randomizeValues = () => {
    setNftData({
      name: generateRandomName(),
      symbol: generateRandomSymbol(),
    });
  };

  if (!hasMounted) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Raw NFT Mint</h1>
          <p className="text-gray-400 text-sm">Using Original Transaction Data</p>
        </div>

        {/* Random Values Display */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">NFT Name</p>
              <p className="text-xl text-white font-medium">{nftData.name}</p>
            </div>
            <button
              onClick={randomizeValues}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🎲</span>
              <span>Random</span>
            </button>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-300">Symbol</p>
            <p className="text-xl text-white font-medium">{nftData.symbol}</p>
          </div>
        </div>

        {/* Hex Conversion Preview */}
        <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Hex Conversion Preview</h3>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-gray-400">Name:</span>
              <span className="text-blue-400 font-mono text-right">{stringToHex(nftData.name)}</span>
              <span className="text-gray-500">({nftData.name.length} chars)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <span className="text-gray-400">Symbol:</span>
              <span className="text-blue-400 font-mono text-right">{stringToHex(nftData.symbol)}</span>
              <span className="text-gray-500">({nftData.symbol.length} chars)</span>
            </div>
          </div>
        </div>

        {/* Gas Settings */}
        <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Gas Configuration</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Gas Limit</label>
              <input
                type="text"
                value={gasSettings.gasLimit}
                onChange={(e) => setGasSettings(prev => ({...prev, gasLimit: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="350000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Gas Price (Gwei)</label>
              <input
                type="text"
                value={gasSettings.gasPrice}
                onChange={(e) => setGasSettings(prev => ({...prev, gasPrice: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="20"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Est. Cost: {(parseInt(gasSettings.gasLimit) * parseInt(gasSettings.gasPrice) / 1e9).toFixed(6)} XOS
          </div>
        </div>

        {/* Connection Status & Mint Button */}
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Connect wallet to mint NFT</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connected Address */}
            <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">Connected</span>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            {/* Mint Button */}
            <button
              onClick={mintNFTRaw}
              disabled={isLoading || isConfirming}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 text-gray-900 font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading || isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Minting NFT...</span>
                </div>
              ) : (
                'Mint with Raw Data'
              )}
            </button>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">❌ {error.message}</p>
              </div>
            )}
            
            {isSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-400 text-sm">✅ NFT minted successfully!</p>
                </div>
              </div>
            )}
            
            {hash && (
              <div className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Transaction Hash</p>
                <a 
                  href={`https://explorer.helioschainlabs.org/tx/${hash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs font-mono break-all transition-colors underline"
                >
                  {hash}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
