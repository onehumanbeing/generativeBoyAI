import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

import { WagmiConfig, createClient } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { artelaTestNet } from './chain';

const client = createClient(
  getDefaultClient({
    appName: 'GBA',
    infuraId: process.env.REACT_APP_INFURA_ID,
    chains: [artelaTestNet],
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
