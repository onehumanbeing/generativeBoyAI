from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
# from vercel_kv import KV, Opts
import os

API_ENDPOINT = "https://api.openai.com/v1/chat/completions"
API_KEY = os.getenv("OPENAI", 'your_password')
account = os.getenv("GASTANK_ACCOUNT", 'your_password')
private_key = os.getenv("GASTANK_PK", 'your_password')
# CACHE = KV()

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

def ask_gpt3(messages):
    data = {
        'messages': messages,
        "model": "gpt-3.5-turbo"
    }
    response = requests.post(API_ENDPOINT, headers=headers, json=data)
    response_json = response.json()
    print("response_json", response_json)
    if response.status_code == 200:
        print("ask_gpt return value:",response_json['choices'][0]['message']['content'].strip())
        return response_json['choices'][0]['message']['content'].strip()
    else:
        print(f"Error {response.status_code}: {response_json['error']['message']}")
        return None

app = Flask(__name__)
CORS(app)

@app.route('/permit', methods=['POST'])
def permit():
    data = request.json() 

@app.route('/agent', methods=['POST'])
def agent():
    data = request.json
    messages = data['messages']
    bountry = int(data['bountry'])
    # prompt = CACHE.get(key="prompt_bountry_%d" % bountry)
    # if prompt is not None:
    # messages = prompt + messages
    response = ask_gpt3(messages)
    messages.append({
        "role": "assistant",
        "content": response
    })
    return jsonify({'response': response, 'messages': messages}), 200

@app.route('/prompt', methods=['POST'])
def prompt():
    data = request.json
    bountry = int(data['bountry'])
    prompt = data['prompt']
    # CACHE.put(key="prompt_bountry_%d" % bountry, value=prompt)
    return jsonify({'response': 'success'}), 200

@app.route('/')
def about():
    return 'Gameboy'