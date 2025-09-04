import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useEstimateGas } from 'wagmi';
import { parseGwei, formatEther } from 'viem';
import { CHRONOS_ADDRESS, CHRONOS_ABI, TARGET_CONTRACT } from '../constants/contracts';

export default function ChronosApp() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [gasSettings, setGasSettings] = useState({
    gasLimit: '200000', // Increased from 100000
    gasPrice: '20', // 20 gwei
  });
  
  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const createCronJob = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    
    try {
      const params = {
        contractAddress: TARGET_CONTRACT.address,
        abi: TARGET_CONTRACT.abi,
        methodName: 'increment',
        params: [],
        frequency: 100n,
        expirationBlock: 28800n,
        gasLimit: 500000n,       // Fixed: Gas for increment() execution
        maxGasPrice: 20000000000n 
      };
      
      writeContract({
        address: CHRONOS_ADDRESS,
        abi: CHRONOS_ABI,
        functionName: 'createCron',
        args: [
          params.contractAddress,
          params.abi,
          params.methodName,
          params.params,
          params.frequency,
          params.expirationBlock,
          params.gasLimit,
          params.maxGasPrice
        ],
        gas: BigInt(gasSettings.gasLimit), // Set transaction gas limit
        gasPrice: parseGwei(gasSettings.gasPrice), // Set transaction gas price
      });
    } catch (err) {
      console.error('Error creating cron job:', err);
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
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-gray-900/50 backdrop-blur border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Chronos</h1>
          <p className="text-gray-400 text-sm">Helios Scheduler</p>
        </div>

        {/* Gas Settings - NEW */}
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
                placeholder="200000"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Gas Price (Gwei)</label>
              <input
                type="text"
                value={gasSettings.gasPrice}
                onChange={(e) => setGasSettings(prev => ({...prev, gasPrice: e.target.value}))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Settings Preview */}
        <div className="mb-8 p-6 bg-gray-800/30 border border-gray-700/30 rounded-xl">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Configuration</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Contract</span>
              <span className="text-gray-300 font-mono">{TARGET_CONTRACT.address.slice(0, 8)}...{TARGET_CONTRACT.address.slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Function</span>
              <span className="text-blue-400">increment()</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frequency</span>
              <span className="text-gray-300">100 blocks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Est. Cost</span>
              <span className="text-green-400">{(parseInt(gasSettings.gasLimit) * parseInt(gasSettings.gasPrice) / 1e9).toFixed(6)} XOS</span>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Connect wallet to continue</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connected Address */}
            <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Connected</span>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            {/* Deploy Button */}
            <button
              onClick={createCronJob}
              disabled={isLoading || isConfirming}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 text-gray-900 font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading || isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Deploying...</span>
                </div>
              ) : (
                'Deploy Cron Job'
              )}
            </button>

            {/* Status Messages */}
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
                  <p className="text-green-400 text-sm">Cron job deployed successfully</p>
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
