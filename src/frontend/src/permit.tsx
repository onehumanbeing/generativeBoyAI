import { ethers } from 'ethers';
export const ABI = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
export const DAIAddress = '0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357'
export const spender = '0x605940167e2555e90f45435d4e591518838a15d6'

export async function getBalance(address: string) {
    const provider = new ethers.providers.InfuraProvider('sepolia', '7437313d862044f09dda3a0c84d05276');  
    const tokenContract = new ethers.Contract(DAIAddress, ABI, provider);
    const balance = await tokenContract.balanceOf(address);  
    console.log(`The balance is: ${balance.toString()}`);
    return balance
}

// send necessary data to backend
const handleSubmit = async (transactionData: { token: string; amount: string; ticketAmount: number; ipfsHash: string; deadline: string; from: string; v: number; r: string; s: string; }) => {
    try {
        const response = await fetch('/permit', { // Make sure the endpoint matches your Flask route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: transactionData.amount,
                deadline: transactionData.deadline,
                v: transactionData.v,
                r: transactionData.r,
                s: transactionData.s,
                sender: transactionData.from,
                daiAddress: DAIAddress
            }),
        });

        console.log("$$$$$", JSON.stringify({
            amount: transactionData.amount,
            deadline: transactionData.deadline,
            v: transactionData.v,
            r: transactionData.r,
            s: transactionData.s,
            sender: transactionData.from,
            daiAddress: DAIAddress
          }));

        console.log("response", await response.json());
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
  };



export async function signPermit(signer: any, userAddress: string, value: string, deadline: string) {
    console.log(deadline)
    const provider = new ethers.providers.InfuraProvider('sepolia', '7437313d862044f09dda3a0c84d05276');  
    const contract = new ethers.Contract(DAIAddress, ABI, provider);
    const nonce = await contract.nonces(userAddress);
    const domain = {
        name: 'DAI',
        version: '1',
        chainId: await provider.getNetwork().then(net => net.chainId),
        verifyingContract: DAIAddress
    };
    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ]
    };
    const message = {
        owner: userAddress,
        spender,
        value,
        nonce: nonce.toString(),
        deadline
    };
    const signature = await signer._signTypedData(domain, types, message);
    console.log("Signed", signature, message);
    const sig = ethers.utils.splitSignature(signature);
    const transactionData = {
        token: DAIAddress,
        amount: value,
        ticketAmount: 100,
        ipfsHash: 'QmZbFz3Kt4m8tHc5rXe2q5b8q2Y8hYh9y7K1x4r8w7',
        deadline: deadline,
        from: userAddress,
        v: sig.v,
        r: sig.r,
        s: sig.s,
        daiAddress: DAIAddress,
    }
    handleSubmit(transactionData);
    console.log('Bountry:', transactionData);
}

// amount: amount
//     deadline: deadline
//     v
//     r
//     s
//     sender (from)