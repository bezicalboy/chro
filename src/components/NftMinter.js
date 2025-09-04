import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseGwei } from 'viem';
import { MINTPAD_ADDRESS, MINTPAD_ABI } from '../constants/nft-contracts';

export default function NFTMinter() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const [nftData, setNftData] = useState({
    name: 'MyNFT',
    symbol: 'MNFT',
    uri: 'https://ipfs.io/ipfs/QmYourHashHere'
  });
  
  const [gasSettings, setGasSettings] = useState({
    gasLimit: '350000',
    gasPrice: '20',
  });
  
  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const mintNFT = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    
    try {
      writeContract({
        address: MINTPAD_ADDRESS,
        abi: MINTPAD_ABI,
        functionName: 'mint',
        args: [address, nftData.name, nftData.symbol, nftData.uri],
        gas: BigInt(gasSettings.gasLimit),
        gasPrice: parseGwei(gasSettings.gasPrice),
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasMounted) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-light text-white mb-2">Mintpad</h1>
          <p className="text-gray-400 text-sm">Helios NFT Minter</p>
        </div>

        {/* NFT Form */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">NFT Name</label>
            <input
              type="text"
              value={nftData.name}
              onChange={(e) => setNftData(prev => ({...prev, name: e.target.value}))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="My Awesome NFT"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Symbol</label>
            <input
              type="text"
              value={nftData.symbol}
              onChange={(e) => setNftData(prev => ({...prev, symbol: e.target.value.toUpperCase()}))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="MNFT"
              maxLength="10"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Metadata URI</label>
            <input
              type="text"
              value={nftData.uri}
              onChange={(e) => setNftData(prev => ({...prev, uri: e.target.value}))}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none text-xs"
              placeholder="https://ipfs.io/ipfs/..."
            />
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
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Gas Price (Gwei)</label>
              <input
                type="text"
                value={gasSettings.gasPrice}
                onChange={(e) => setGasSettings(prev => ({...prev, gasPrice: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Connection & Mint */}
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Connect wallet to mint NFT</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Connected</span>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            <button
              onClick={mintNFT}
              disabled={isLoading || isConfirming}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 text-gray-900 font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading || isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Minting NFT...</span>
                </div>
              ) : (
                'Mint NFT'
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error.message}</p>
              </div>
            )}
            
            {isSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-400 text-sm">NFT minted successfully!</p>
                </div>
              </div>
            )}
            
            {hash && (
              <div className="p-4 bg-gray-800/30 border border-gray-700/30 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Transaction</p>
                <a 
                  href={`https://explorer.helioschainlabs.org/tx/${hash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs font-mono break-all transition-colors"
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
