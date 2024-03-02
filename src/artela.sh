rm deploy.log
npm run asbuild:debug
npm run contract:build
npm run contract:deploy -- --abi ./build/contract/GBAToken.abi  --bytecode ./build/contract/GBAToken.bin >> deploy.log
npm run aspect:deploy -- --wasm ./build/debug.wasm --joinPoints preContractCall >> deploy.log
python3 deploy.py
source env.sh
npm run contract:bind -- --contract $CONTRACT_ADDRESS \
                        --abi ./build/contract/GBAToken.abi \
                        --aspectId $ASPECT_ID