# NEAR Transaction Creator Api (beta)
# :_NO_ENTRY: USE WITH CAUTION | SHARING PRIVATE KEYS IS A SECURITY ISSUE
A simple API to generate keys and create transaction on the NEAR Protocol. This can be useful if you are developing for platform that does not have supported SDK yet (for example a mobile app).

## Using this API You can
1. Generate KeyPair
2. Genarate a  __function-call__ or __transfer__ transactions
3. Submit transactinos and check the results. 

## How to use?
1. Call ```BASE_URL/keys``` to gerneate new key pair
2. Response should be something like that
```javascript
{
    "public_key": "ed25519:AuXcisoKN7wLnuQMXwn7aX3UGitZ3NKtmV6rAcg7WS41",
    "private_key": "45y7nvsQwTrr1VFD9K89wqnYM3So3b9VHwS21ny1tz5C3RsT61evYirrDFmzFetN4UHHvTn5NMiVw8g3VP4PBeUR"
}
```
3. Call this url to add the generated key to the user's list of keys. This will add the key as a FunctionCall Key
```https://wallet.{NETWORK_ID_HERE}.near.org/login/?success_url={SUCCESS_URL_HERE}&failure_url={FAILURE_URL_HERE}&contract_id={CONTRACT_HERE}&public_key={KEY_HERE}```

Call this url if you want to the key as a FullAccess Key
```https://wallet.{NETWORK_ID_HERE}.near.org/login/?success_url={SUCCESS_URL_HERE}&failure_url={FAILURE_URL_HERE}&public_key={KEY_HERE}```


For example:
```https://wallet.testnet.near.org/login/?success_url=https://google.com&failure_url=https://yahoo.com&contract_id=friendbook.msaudi.testnet&public_key=d25519:AuXcisoKN7wLnuQMXwn7aX3UGitZ3NKtmV6rAcg7WS41```


This should open the wallet for authentication and it should add the key to the user's list of keys when you approve. Now the key is added, you can create transaction with the private key

4. Call ```BASE_URL/transactions``` passing the below paramters to create a function-call transaction 

```
{
    "action_type":"function_call",
    "sender": "msaudi.testnet",
    "private_key": "51f2b1dSowpMzGXkAyfTRGkuvYnn9urSK7p6iqoGEqVz92PHTuqDZCJQpp8ty9gfGaWrzRFrUBWGTduut4WZraMo",
    "receiver": "friendbook.msaudi.testnet",
    "method_name": "writeSomething",
    "network_id": "testnet",
    "method_args": {
        "message": "Best of luck",
        "toWho": "mhassanist.testnet"
    }
}
```
or the below parameters to create a transfer transaction 

```
{
    "action_type":"transfer",
    "sender": "msaudi.testnet",
    "private_key": "2fjkgQZnD5rkwnUkHVekaBvxu6L9bGZ7uorRrAGy8oNYJkdEjt55NWuPy8GbHp3wrY4tFYnjuGn23NQ3BWodWn4F",
    "amount":"1",
    "receiver": "mhassanisti.testnet",
    "network_id": "testnet"
    
}
```

This request should return a signed encoded transaction ready to be submitted like that:
```DgAAAG1zYXVkaS50ZXN0bmV0AElVNHz63svr9aqC13v0+BEZJSHm/3Ty4LLlEV889WNiAphXqqdPAAAZAAAAZnJpZW5kYm9vay5tc2F1ZGkudGVzdG5ldNyi3FGZZgXLbuAdcjFR7aMJAG4RvzXwcf6WS5p0GtmWAQAAAAIOAAAAd3JpdGVTb21ldGhpbmc3AAAAeyJtZXNzYWdlIjoiQmVzdCBvZiBsdWNrIiwidG9XaG8iOiJtaGFzc2FuaXN0LnRlc3RuZXQifQDgV+tIGwAAAAAAAAAAAAAAAAAAAAAAAAA1UoCHwOV7eBbLM1V0sNb3M2P1CwLpfd0LTwnGBs53XQRZua+oFB7yrQP7lLvpH2LAnHHNczMfellpp4W+O9AA```


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
```
POST https://rpc.testnet.near.org
{
  "jsonrpc": "2.0",
  "id": "dontcare",
  "method": "tx",
  "params": [
    "G37dJ6yoeCykAo5eQmYvF4XEZyGUpEi7fxvXYXqquhin","msaudi.near"
  ]
}
```
The result should be something like that:
```
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
```
