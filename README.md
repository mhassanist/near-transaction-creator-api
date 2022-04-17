# near-transaction-creator-api

## How to use?
1. Call BASE_URL/keys to gerneate new key pair
2. Response should be something like that
```javascript
{
    "public_key": "ed25519:AuXcisoKN7wLnuQMXwn7aX3UGitZ3NKtmV6rAcg7WS41",
    "private_key": "45y7nvsQwTrr1VFD9K89wqnYM3So3b9VHwS21ny1tz5C3RsT61evYirrDFmzFetN4UHHvTn5NMiVw8g3VP4PBeUR"
}
```
3. Call this url and pass the required parameters including the public key you got from step 2
```https://wallet.{NETWORK_ID_HERE}.near.org/login/?success_url={SUCCESS_URL_HERE}&failure_url={FAILURE_URL_HERE}&contract_id={CONTRACT_HERE}&public_key={KEY_HERE}```

For example:
```https://wallet.testnet.near.org/login/?success_url=https://google.com&failure_url=https://yahoo.com&contract_id=friendbook.msaudi.testnet&public_key=d25519:AuXcisoKN7wLnuQMXwn7aX3UGitZ3NKtmV6rAcg7WS41```


This should open the wallet for authentication and it should add the key to the user's list of keys when you approve. Now the key is added, you can create transaction with the private key

4. Call ```BASE_URL/transactions``` passing the required paramters to create a transaction 



This request should return a signed encoded transaction ready to be submitted like that:
DgAAAG1zYXVkaS50ZXN0bmV0AElVNHz63svr9aqC13v0+BEZJSHm/3Ty4LLlEV889WNiAphXqqdPAAAZAAAAZnJpZW5kYm9vay5tc2F1ZGkudGVzdG5ldNyi3FGZZgXLbuAdcjFR7aMJAG4RvzXwcf6WS5p0GtmWAQAAAAIOAAAAd3JpdGVTb21ldGhpbmc3AAAAeyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwidG9XaG8iOiJtaGFzc2FuaXN0LnRlc3RuZXQifQDgV+tIGwAAAAAAAAAAAAAAAAAAAAAAAAA1UoCHwOV7eBbLM1V0sNb3M2P1CwLpfd0LTwnGBs53XQRZua+oFB7yrQP7lLvpH2LAnHHNczMfellpp4W+O9AA


5. You can submit this transaction via normal RPC call like that 
```
POST https://rpc.testnet.near.org
{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "broadcast_tx_async",
  "params": [
    "DgAAAG1zYXVkaS50ZXN0bmV0AElVNHz63svr9aqC13v0+BEZJSHm/3Ty4LLlEV889WNiAphXqqdPAAAZAAAAZnJpZW5kYm9vay5tc2F1ZGkudGVzdG5ldNyi3FGZZgXLbuAdcjFR7aMJAG4RvzXwcf6WS5p0GtmWAQAAAAIOAAAAd3JpdGVTb21ldGhpbmc3AAAAeyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwidG9XaG8iOiJtaGFzc2FuaXN0LnRlc3RuZXQifQDgV+tIGwAAAAAAAAAAAAAAAAAAAAAAAAA1UoCHwOV7eBbLM1V0sNb3M2P1CwLpfd0LTwnGBs53XQRZua+oFB7yrQP7lLvpH2LAnHHNczMfellpp4W+O9AA"
  ]
}
```
Response will include the result hash like that:
```
{
    "jsonrpc": "2.0",
    "result": "G37dJ6yoeCykAo5eQmYvF4XEZyGUpEi7fxvXYXqquhin",
    "id": "dontcare"
}
```
6. You can validate the hash from the explorer by searching for that transaction hash or by calling the below url:
POST https://rpc.testnet.near.org
{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "tx",
  "params": [
    "G37dJ6yoeCykAo5eQmYvF4XEZyGUpEi7fxvXYXqquhin","msaudi.near"
  ]
}

The result should be something like that:
{
    "jsonrpc": "2.0",
    "result": {
        "receipts_outcome": [
            {
                "block_hash": "CLBpf6LYaQiyWGrEBni9dZ7aXqb54Bxkzj49eWRUaU93",
                "id": "EEnzhrzsSzx4KdfXtPb3RqNbhwSeEvUk4m2uW7oA5BNW",
                "outcome": {
                    "executor_id": "friendbook.msaudi.testnet",
                    "gas_burnt": 5014454075952,
                    "logs": [],
                    "metadata": {
                        "gas_profile": [
                            {
                                "cost": "BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "3971521665"
                            },
                            {
                                "cost": "CONTRACT_COMPILE_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "35445963"
                            },
                            {
                                "cost": "CONTRACT_COMPILE_BYTES",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "11356399500"
                            },
                            {
                                "cost": "READ_MEMORY_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "26098632000"
                            },
                            {
                                "cost": "READ_MEMORY_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "1030161243"
                            },
                            {
                                "cost": "READ_REGISTER_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "7551495558"
                            },
                            {
                                "cost": "READ_REGISTER_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "13995804"
                            },
                            {
                                "cost": "STORAGE_HAS_KEY_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "108079793250"
                            },
                            {
                                "cost": "STORAGE_HAS_KEY_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "307908450"
                            },
                            {
                                "cost": "STORAGE_READ_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "56356845750"
                            },
                            {
                                "cost": "STORAGE_READ_KEY_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "154762665"
                            },
                            {
                                "cost": "STORAGE_READ_VALUE_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "409603365"
                            },
                            {
                                "cost": "STORAGE_WRITE_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "192590208000"
                            },
                            {
                                "cost": "STORAGE_WRITE_EVICTED_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "2376680718"
                            },
                            {
                                "cost": "STORAGE_WRITE_KEY_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "986760138"
                            },
                            {
                                "cost": "STORAGE_WRITE_VALUE_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "4900929162"
                            },
                            {
                                "cost": "TOUCHING_TRIE_NODE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "2044948402602"
                            },
                            {
                                "cost": "WASM_INSTRUCTION",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "101262340212"
                            },
                            {
                                "cost": "WRITE_MEMORY_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "8411384583"
                            },
                            {
                                "cost": "WRITE_MEMORY_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "386775624"
                            },
                            {
                                "cost": "WRITE_REGISTER_BASE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "14327612430"
                            },
                            {
                                "cost": "WRITE_REGISTER_BYTE",
                                "cost_category": "WASM_HOST_COST",
                                "gas_used": "821137824"
                            }
                        ],
                        "version": 1
                    },
                    "receipt_ids": [
                        "5iDUmUJFTM8BuKmJehawp8yVJZ6b2RZKd2dphXXLrfrU"
                    ],
                    "status": {
                        "SuccessValue": "eyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwic2VuZGVyIjoibXNhdWRpLnRlc3RuZXQiLCJyZWNlaXZlciI6Im1oYXNzYW5pc3QudGVzdG5ldCJ9"
                    },
                    "tokens_burnt": "501445407595200000000"
                },
                "proof": []
            },
            {
                "block_hash": "F1crxcdiyRQ3AXuwVxpYkS1aRWUnM7Exnr2DfsqWguTw",
                "id": "5iDUmUJFTM8BuKmJehawp8yVJZ6b2RZKd2dphXXLrfrU",
                "outcome": {
                    "executor_id": "msaudi.testnet",
                    "gas_burnt": 223182562500,
                    "logs": [],
                    "metadata": {
                        "gas_profile": [],
                        "version": 1
                    },
                    "receipt_ids": [],
                    "status": {
                        "SuccessValue": ""
                    },
                    "tokens_burnt": "0"
                },
                "proof": [
                    {
                        "direction": "Left",
                        "hash": "7PGgr7tkS6nMCRP6EpfE8LEGJd1hqm7U8u92K994uB8i"
                    }
                ]
            }
        ],
        "status": {
            "SuccessValue": "eyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwic2VuZGVyIjoibXNhdWRpLnRlc3RuZXQiLCJyZWNlaXZlciI6Im1oYXNzYW5pc3QudGVzdG5ldCJ9"
        },
        "transaction": {
            "actions": [
                {
                    "FunctionCall": {
                        "args": "eyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwidG9XaG8iOiJtaGFzc2FuaXN0LnRlc3RuZXQifQ==",
                        "deposit": "0",
                        "gas": 30000000000000,
                        "method_name": "writeSomething"
                    }
                }
            ],
            "hash": "G37dJ6yoeCykAo5eQmYvF4XEZyGUpEi7fxvXYXqquhin",
            "nonce": 87581536000002,
            "public_key": "ed25519:5wG7pwTXVsX5whPkj8bBbRzZTBZRFbzc4XwBRacrQr49",
            "receiver_id": "friendbook.msaudi.testnet",
            "signature": "ed25519:24qJbTvRqKqbdZHYNzkB9L49Ge5ELmzTtnN2ra7bNxFY1nsvz96G2RskSDvPxNukCXCdnJjSvUmFM22AUjdMogGo",
            "signer_id": "msaudi.testnet"
        },
        "transaction_outcome": {
            "block_hash": "3r6y4o2dRfqt6k7iCo1UwAjffcoWefpqTvJB22QAC3tg",
            "id": "G37dJ6yoeCykAo5eQmYvF4XEZyGUpEi7fxvXYXqquhin",
            "outcome": {
                "executor_id": "msaudi.testnet",
                "gas_burnt": 2428075279446,
                "logs": [],
                "metadata": {
                    "gas_profile": null,
                    "version": 1
                },
                "receipt_ids": [
                    "EEnzhrzsSzx4KdfXtPb3RqNbhwSeEvUk4m2uW7oA5BNW"
                ],
                "status": {
                    "SuccessReceiptId": "EEnzhrzsSzx4KdfXtPb3RqNbhwSeEvUk4m2uW7oA5BNW"
                },
                "tokens_burnt": "242807527944600000000"
            },
            "proof": [
                {
                    "direction": "Right",
                    "hash": "9iMa1E81jh6i4svYLhFRTRhHPv2NJRx1KBYsLWhAQgpZ"
                }
            ]
        }
    },
    "id": "dontcare"
}

