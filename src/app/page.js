'use client';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ChronosApp from '../components/ChronosApp';
import NFTMinter from '../components/NFTMinter';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chronos'); // chronos or nft

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">H</span>
            </div>
            <span className="text-white font-light">Helios Tools</span>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="px-6 mb-8">
        <div className="max-w-md mx-auto">
          <div className="flex bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('chronos')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chronos'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              ⏰ Chronos
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'nft'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              🎨 NFT Mint
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 pb-12">
        {activeTab === 'chronos' ? <ChronosApp /> : <NFTMinter />}
      </main>
    </div>
  );
}
