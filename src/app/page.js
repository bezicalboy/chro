'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ChronosApp from '../components/ChronosApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">H</span>
            </div>
            <span className="text-white font-light">Helios</span>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 pb-12">
        <ChronosApp />
      </main>
    </div>
  );
}
