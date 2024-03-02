import re

with open('deploy.log', 'r') as file:
    data = file.read()

# Define the regular expression patterns
aspectID_pattern = r'== deploy aspectID == (\w+)'
contractAddress_pattern = r'contract address:  (\w+)'

# Find all matches
aspectID_matches = re.findall(aspectID_pattern, data)
contractAddress_matches = re.findall(contractAddress_pattern, data)

# Open the env.sh file and write the matches
with open('env.sh', 'w') as file:
    if aspectID_matches:
        file.write(f'export ASPECT_ID={aspectID_matches[0]}\n')
    if contractAddress_matches:
        file.write(f'export CONTRACT_ADDRESS={contractAddress_matches[0]}\n')