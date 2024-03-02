// Import necessary utilities from ethers.js if you're using it
import { ethers } from 'ethers';
import { ABI, DAIAddress, spender } from './permit';

// Example function to call the verify endpoint with required parameters
const handleVerify = async (verifyData: {
    spender: any; answer: string; bountyId: number; from: string 
}) => {
    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answer: verifyData.answer,
                bountyId: verifyData.bountyId,
                from: verifyData.from,
                spender: verifyData.spender
            }),
        });

        const responseData = await response.json();
        console.log("Verification response", responseData);
        // Handle the response data as needed
    } catch (error) {
        console.error('Error sending verification data: ', error);
    }
};



export async function signVerify(signer: any, userAddress: string, value: string, deadline: string) {
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

    const verifyData = {
        answer: "answerA",
        bountyId: 1, // Example bountyId
        from: transactionData.from,
        spender: spender,
    };

    handleVerify(verifyData);
    console.log('Bountry:', transactionData);
}


// // Example usage of handleVerify
// // You would call this function when you want to send verification data to your backend
// const verifyData = {
//     answer: "yourAnswerHere",
//     bountyId: 1, // Example bountyId
//     from: ,
// };
// handleVerify(verifyData);