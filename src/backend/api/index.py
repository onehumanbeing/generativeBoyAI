from flask import Flask
from flask_cors import CORS
import requests
import json
import os

API_ENDPOINT = "https://api.openai.com/v1/chat/completions"
API_KEY = os.getenv("OPENAI", 'your_password')
account = os.getenv("GASTANK_ACCOUNT", 'your_password')
private_key = os.getenv("GASTANK_PK", 'your_password')

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

    if response.status_code == 200:
        return response_json['choices'][0]['message']['content'].strip()
    else:
        print(f"Error {response.status_code}: {response_json['error']['message']}")
        return None

# if __name__ == "__main__":
#     messages = PROMPTS
#     while True:
#         user_input = input("You: ")
#         if user_input.lower() in ['quit', 'exit']:
#             break
#         messages.append({
#             "role": "user",
#             "content": user_input
#         })

#         response = ask_gpt3(messages)
#         if response.startswith("@pix2pix"):
#             print(response)
#         else:
#             print(f"GPT-3.5: {response}")
#             messages.append({
#                 "role": "assistant",
#                 "content": response
#             })

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/about')
def about():
    return 'About'