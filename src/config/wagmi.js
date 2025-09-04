import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const heliosTestnet = {
  id: 42000,
  name: 'Helios Testnet',
  network: 'helios-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Helios',
    symbol: 'HLS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet1.helioschainlabs.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Helios Explorer',
      url: 'https://explorer.helioschainlabs.org',
    },
  },
};

export const config = getDefaultConfig({
  appName: 'Helios Chronos App',
  projectId: 'b9074071c581ac6c458ea8f0d3d66f06', // Get from https://cloud.walletconnect.com
  chains: [heliosTestnet],
});
