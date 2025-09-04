import { Providers } from '../components/providers';
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

export const metadata = {
  title: 'Helios Chronos App',
  description: 'Interact with Helios Chronos precompiled contract',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
