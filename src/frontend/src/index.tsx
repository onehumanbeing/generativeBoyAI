import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

import { WagmiConfig, chain, createClient } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'GBA',
    infuraId: process.env.REACT_APP_INFURA_ID,
    chains: [chain.sepolia],
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="soft">
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

reportWebVitals();
