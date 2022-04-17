const nearAPI = require("near-api-js")
const sha256 = require("js-sha256")
const express = require("express")
const app = express()
const port = 8080

const DEFAULT_FUNC_CALL_GAS = 30000000000000

//https://docs.near.org/docs/tutorials/create-transactions#low-level----create-a-transaction
const sender = "msaudi.testnet"
const receiver = "friendbook.msaudi.testnet"
const networkId = "testnet"

connInfo = new nearAPI.utils.web.ConnectionInfo()
// sets up a NEAR API/RPC provider to interact with the blockchain
const provider = new nearAPI.providers.JsonRpcProvider(connInfo)

// creates keyPair used to sign transaction
//const privateKey =
//  "4e37480242c4e1eab3d6fa2c9fd6cb1bb240ed074818366e9e45f78a2d33778b" //taken from credential files
const keyRandom = nearAPI.KeyPair.fromRandom("ed25519")

//const privateKey = //keyRandom.secretKey
//const publicKey = //keyRandom.publicKey.toString()

publicKey = "ed25519:4CANUusKpFWWHFLHNkwY9P6sXnExayXib86JBfT2VUNb"
privateKey =
  "ed25519:5hryxVbR2Ui22kE5BnNA8eXqWHr1UAFJHwo2Xizg1v4N1NoMeDbaeVCBJgZfpxEJWgeymGoTMkEzkDPvhqMkMDNX"

console.log(privateKey)
console.log(publicKey)

app.get("/", async (req, res) => {
  const result = await main()
  res.send(result)
})

async function main() {
  console.log("Processing transaction...")
  // gets sender's public key information from NEAR blockchain
  const accessKey = await provider
    .query(`access_key/${sender}/${publicKey.toString()}`, "")
    .catch((e) => {
      console.log(e)
    })
  // checks to make sure provided key is a full access key
  /*if (accessKey.permission !== "FullAccess") {
    return console.log(
      `Account [ ${sender} ] does not have permission to send tokens using key: [ ${publicKey} ]`
    )
  }*/
  // each transaction requires a unique number or nonce
  // this is created by taking the current nonce and incrementing it
  const nonce = ++accessKey.nonce
  // constructs actions that will be passed to the createTransaction method below
  const args1 = { message: "Best of luck", toWho: "mhassanist.testnet" }
  const args = new TextEncoder().encode(args1.toString())
  const actions = [
    nearAPI.transactions.functionCall(
      "writeSomething",
      args1,
      DEFAULT_FUNC_CALL_GAS,
      0
    ),
  ]

  // converts a recent block hash into an array of bytes
  // this hash was retrieved earlier when creating the accessKey (Line 26)
  // this is required to prove the tx was recently constructed (within 24hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    accessKey.block_hash
  )

  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    sender,
    publicKey,
    receiver,
    nonce,
    actions,
    recentBlockHash
  )
  // before we can sign the transaction we must perform three steps...
  // 1) serialize the transaction in Borsh
  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA,
    transaction
  )
  // 2) hash the serialized transaction using sha256
  const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx))
  // 3) create a signature using the hashed transaction
  const signature = keyPair.sign(serializedTxHash)
  // now we can sign the transaction :)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: signature.signature,
    }),
  })
  // send the transaction!
  try {
    // encodes signed transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode()
    const encodedTransaction =
      Buffer.from(signedSerializedTx).toString("base64")
    console.log(encodedTransaction)
    return encodedTransaction

    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    /* const result = await provider.sendJsonRpc(
       'broadcast_tx_commit',
       [Buffer.from(signedSerializedTx).toString('base64')]
     ).catch((e) => {
        console.log(e)
     });
     // console results :)
     console.log('Transaction Results: ', result.transaction);
     console.log('--------------------------------------------------------------------------------------------');
     console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
     console.log(`$https://explorer.${networkId}.near.org/transactions/${result.transaction.hash}`);
     console.log('--------------------------------------------------------------------------------------------');*/
  } catch (error) {
    console.log(error)
  }
}

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
)

//wallet.testnet.near.org/login/?success_url=https%3A%2F%2Fgoogle.com%2F&failure_url=https%3A%2F%2Fyahoo.com%2F&contract_id=friendbook.msaudi.testnet&public_key=ed25519:D5Z9EPV5ERAbuuxqqhttsyem7zJXd7dTojBfj5sgbxUh&methodNames=writeSomething

https: app.get("/", async (req, res) => {
  const result = await main()
  res.send(result)
})

async function main() {
  console.log("Processing transaction...")

  sender = "msaudi.testnet"
  receiver = "friendbook.msaudi.testnet"
  networkId = "testnet"

  let connInfo = { url: "https://rpc." + networkId + ".near.org" }
  // sets up a NEAR API/RPC provider to interact with the blockchain
  const provider = new nearAPI.providers.JsonRpcProvider(connInfo)

  // creates keyPair used to sign transaction
  /* const privateKey =
      nearAPI.utils.key_pair.KeyPairEd25519.fromRandom().secretKey
    const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)
  */
  privateKey =
    "51f2b1dSowpMzGXkAyfTRGkuvYnn9urSK7p6iqoGEqVz92PHTuqDZCJQpp8ty9gfGaWrzRFrUBWGTduut4WZraMo"
  const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)

  console.log(privateKey)
  console.log(keyPair.getPublicKey().toString())

  // gets sender's public key
  const publicKey = keyPair.getPublicKey()
  // gets sender's public key information from NEAR blockchain
  const accessKey = await provider
    .query(`access_key/${sender}/${publicKey.toString()}`, "")
    .catch((e) => {
      console.log(e)
    })
  // checks to make sure provided key is a full access key
  // if (accessKey.permission !== "FullAccess") {
  //   return console.log(
  //     `Account [ ${sender} ] does not have permission to send tokens using key: [ ${publicKey} ]`
  //   )
  // }
  // each transaction requires a unique number or nonce
  // this is created by taking the current nonce and incrementing it
  const nonce = ++accessKey.nonce
  // constructs actions that will be passed to the createTransaction method below
  const args1 = { message: "Best of luck", toWho: "mhassanist.testnet" }
  const args = new TextEncoder().encode(args1.toString())
  const actions = [
    nearAPI.transactions.functionCall(
      "writeSomething",
      args1,
      DEFAULT_FUNC_CALL_GAS,
      0
    ),
  ]

  // converts a recent block hash into an array of bytes
  // this hash was retrieved earlier when creating the accessKey (Line 26)
  // this is required to prove the tx was recently constructed (within 24hrs)
  const recentBlockHash = nearAPI.utils.serialize.base_decode(
    accessKey.block_hash
  )

  // create transaction
  const transaction = nearAPI.transactions.createTransaction(
    sender,
    publicKey,
    receiver,
    nonce,
    actions,
    recentBlockHash
  )
  // before we can sign the transaction we must perform three steps...
  // 1) serialize the transaction in Borsh
  const serializedTx = nearAPI.utils.serialize.serialize(
    nearAPI.transactions.SCHEMA,
    transaction
  )
  // 2) hash the serialized transaction using sha256
  const serializedTxHash = new Uint8Array(sha256.sha256.array(serializedTx))
  // 3) create a signature using the hashed transaction
  const signature = keyPair.sign(serializedTxHash)
  // now we can sign the transaction :)
  const signedTransaction = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: signature.signature,
    }),
  })
  // send the transaction!
  try {
    // encodes signed transaction to serialized Borsh (required for all transactions)
    const signedSerializedTx = signedTransaction.encode()
    const encodedTransaction =
      Buffer.from(signedSerializedTx).toString("base64")
    console.log(encodedTransaction)
    return encodedTransaction

    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    /* const result = await provider.sendJsonRpc(
         'broadcast_tx_commit',
         [Buffer.from(signedSerializedTx).toString('base64')]
       ).catch((e) => {
          console.log(e)
       });
       // console results :)
       console.log('Transaction Results: ', result.transaction);
       console.log('--------------------------------------------------------------------------------------------');
       console.log('OPEN LINK BELOW to see transaction in NEAR Explorer!');
       console.log(`$https://explorer.${networkId}.near.org/transactions/${result.transaction.hash}`);
       console.log('--------------------------------------------------------------------------------------------');*/
  } catch (error) {
    console.log(error)
  }
}


https://docs.near.org/docs/api/rpc

https://docs.near.org/docs/tools/near-cli#near-generate-key 

https://docs.near.org/docs/api/rpc


https://wallet.testnet.near.org/login/?success_url=https%3A%2F%2Fgoogle.com%2F&failure_url=https%3A%2F%2Fyahoo.com%2F&contract_id=friendbook.msaudi.testnet&public_key=ed25519:4ZdVoF6NJoKvYQNRRE3vVnVvM6tmPzjfiWJhdF5GCUnC


https://wallet.testnet.near.org/sign?transactions=DgAAAG1zYXVkaS50ZXN0bmV0AGNQqm7XXSqWijPSJjG/5WJvK05UEGzZjHhkaF1kYlmyz5ZE8n9HAAASAAAAbWhhc3NhbmlzdC50ZXN0bmV0pJ63jAYIybbgzQ9C76pXgL+wrlWVgZZwwgCsAX07oqQBAAAAAwAAgHFkM7Ypoz0BAAAAAAAABR/ibIN8fvYbL40btTuAxjJYuZm6lPL4Ytn6gHW8ntxzFL9zEs/cXIgYSVrPeWnKzxmxfVsXx3miBbhS5eR9Aw==&callbackUrl=https://google.com


https://wallet.testnet.near.org/sign?transactions=DgAAAG1zYXVkaS50ZXN0bmV0AGNQqm7XXSqWijPSJjG/5WJvK05UEGzZjHhkaF1kYlmyz5ZE8n9HAAASAAAAbWhhc3NhbmlzdC50ZXN0bmV0pJ63jAYIybbgzQ9C76pXgL+wrlWVgZZwwgCsAX07oqQBAAAAAwAAgHFkM7Ypoz0BAAAAAAAABR/ibIN8fvYbL40btTuAxjJYuZm6lPL4Ytn6gHW8ntxzFL9zEs/cXIgYSVrPeWnKzxmxfVsXx3miBbhS5eR9Aw==&callbackUrl=https%3A%2F%2Fnear-examples.github.io%2Fguest-book%2F
DgAAAG1zYXVkaS50ZXN0bmV0AElVNHz63svr9aqC13v0+BEZJSHm/3Ty4LLlEV889WNiA5hXqqdPAAASAAAAbWhhc3NhbmlzdC50ZXN0bmV0ejKgwq8KBOODWlu1wF4peTOgLrarbav7pi3ENcW7tPIBAAAAAwAAgHFkM7Ypoz0BAAAAAAAA3X7uGjLyqbecJXyj+L4ypFMp6ILXu6nwZQHXlkkjroDnVzJTdpmr0LCsYyRsQmXNH5n+bRSJGXuymUqmmARECA==



"public_key": "ed25519:2ddZi41k1rTxCPPTx6epdt5whJRa6KfabCxCPRsnZHGb",
"private_key": "2fjkgQZnD5rkwnUkHVekaBvxu6L9bGZ7uorRrAGy8oNYJkdEjt55NWuPy8GbHp3wrY4tFYnjuGn23NQ3BWodWn4F"



