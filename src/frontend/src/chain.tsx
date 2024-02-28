import { Chain } from "wagmi";

export const artelaTestNet: Chain = {
    id: 11822,
    name: "Artela TestNet",
    network: "Artela TestNet",
    nativeCurrency: {
        name: "Artela",
        symbol: "ART",
        decimals: 18,
    },
    rpcUrls: {
        default: "https://betanet-rpc2.artela.network",
    },
    blockExplorers: {
        default: {
            name: "Artela TestNet Explorer",
            url: "https://betanet-scan.artela.network/",
        },
    },
    testnet: true,
};
