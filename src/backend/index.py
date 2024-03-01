from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from web3 import Web3, HTTPProvider
import redis
import os

API_ENDPOINT = "https://api.openai.com/v1/chat/completions"
API_KEY = os.getenv("OPENAI_API_KEY", 'your_password')
account = os.getenv("GASTANK_ACCOUNT", 'your_password')
private_key = os.getenv("GASTANK_PK", 'your_password')
CACHE = redis.Redis(host='localhost', port=6379, db=0)
ABI = [{"inputs":[{"internalType":"address payable","name":"_bot","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"approved","type":"address"},{"indexed":True,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"operator","type":"address"},{"indexed":False,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":True,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"from","type":"address"},{"indexed":True,"internalType":"address","name":"to","type":"address"},{"indexed":True,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"activeBounties","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bot","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bounties","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"ticketAmount","type":"uint256"},{"internalType":"contract IERC20Permit","name":"token","type":"address"},{"internalType":"address payable","name":"creator","type":"address"},{"internalType":"bytes32","name":"hashedAnswer","type":"bytes32"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"bool","name":"claimed","type":"bool"},{"internalType":"uint256","name":"salt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getActiveBounties","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"ticketAmount","type":"uint256"},{"internalType":"contract IERC20Permit","name":"token","type":"address"},{"internalType":"address payable","name":"creator","type":"address"},{"internalType":"bytes32","name":"hashedAnswer","type":"bytes32"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"bool","name":"claimed","type":"bool"},{"internalType":"uint256","name":"salt","type":"uint256"}],"internalType":"struct GameBoy.Bounty[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextBountyId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20Permit","name":"token","type":"address"},{"internalType":"address payable","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"answer","type":"string"},{"internalType":"contract IERC20Permit","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"ticketAmount","type":"uint256"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"address payable","name":"from","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permitWithCreateBounty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_bot","type":"address"}],"name":"setBot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bountyId","type":"uint256"},{"internalType":"string","name":"answer","type":"string"}],"name":"verify","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}
provider_url = 'https://sepolia.infura.io/v3/' + os.getenv("INFURA", 'your_password')
w3 = Web3(HTTPProvider(provider_url))

def ask_gpt3(messages):
    data = {
        'messages': messages,
        "model": "gpt-3.5-turbo"
    }
    response = requests.post(API_ENDPOINT, headers=headers, json=data)
    response_json = response.json()

    if response.status_code == 200:
        return response_json['choices'][0]['message']['content'].strip()
    else:
        print(f"Error {response.status_code}: {response_json['error']['message']}")
        return None

app = Flask(__name__)
CORS(app)

@app.route('/permit', methods=['POST'])
def permit():
    speed = 1
    gas_price = int(w3.eth.gas_price * speed)
    txn = request.json() 
    value = int(txn.amount)
    deadline = int(txn.deadline)
    signature = json.loads(txn.extra)
    v = int(signature['v']) 
    r = signature['r']
    s = signature['s']
    contract_address = ''
    owner = txn.sender
    spender = account
    prefix = 0
    contract = w3.eth.contract(address=contract_address, abi=ABI)
    permit_txn = contract.functions.permit(owner, spender, value, deadline, v, r, s).build_transaction({
        'nonce': w3.eth.get_transaction_count(account) + prefix,
        'gas': gas_limit,
        'gasPrice': gas_price
    })
    gas_limit = 1000000
    signed_permit_txn = w3.eth.account.sign_transaction(permit_txn, private_key)
    tx_permit_hash = w3.eth.send_raw_transaction(signed_permit_txn.rawTransaction)
    tx_permit_hash_hex = tx_permit_hash.hex()
    r = w3.eth.wait_for_transaction_receipt(tx_permit_hash)
    print("permit success", tx_permit_hash_hex)
    return jsonify({'response': tx_permit_hash_hex}), 200

@app.route('/agent', methods=['POST'])
def agent():
    data = request.json()
    messages = data['messages']
    bountry = int(data['bountry'])
    prompt = CACHE.get(key="prompt_bountry_%d" % bountry)
    if prompt is not None:
        messages = prompt + messages
    response = ask_gpt3(messages)
    messages.append({
        "role": "assistant",
        "content": response
    })
    return jsonify({'response': response, 'messages': messages}), 200

@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.json()
    bountry = int(data['bountry'])
    prompt = data['prompt']
    CACHE.put(key="prompt_bountry_%d" % bountry, value=prompt)
    return jsonify({'response': 'success'}), 200

@app.route('/')
def about():
    return 'Gameboy'

if __name__ == '__main__':
    app.run(debug=True, port=6000)