source env.sh
npm run contract:send -- --contract $CONTRACT_ADDRESS \
                          --abi ./build/contract/GBAToken.abi  \
                          --method permit \
                          --gas 9000000 \
                          --args  "0x376b40c51E96AbCE9F00a2d7aAf6b6e5519a7898" "0x283CE84778AB0010714525b6b599a2627ef4Ba31" "1000" "1809354250" "28" "0x6b1a2195d09f90a8b3cd1f37b2b966e0a5887d8e02f7e4e2dfdc797373ff3203" "0x34822017615fc6b358415ccc8b2e16f03c09c032e47f28bcdbed0e2946ad69bd"
                          