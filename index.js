const nearAPI = require("near-api-js")
const sha256 = require("js-sha256")
const express = require("express")
const app = express()
const port = 8080
const DEFAULT_FUNC_CALL_GAS = 30000000000000

async function generateKeys() {
  const privateKey =
    nearAPI.utils.key_pair.KeyPairEd25519.fromRandom().secretKey
  const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)

  return {
    public_key: keyPair.getPublicKey().toString(),
    private_key: privateKey,
  }
}

//Endpoints
//generate new keypair
app.post("/keys", async (req, res) => {
  const result = await generateKeys()
  res.send(result)
})

app.post("/transactions", express.json({ type: "*/*" }), async (req, res) => {
  sender = req.body.sender_account
  receiver = req.body.receiver
  privateKey = req.body.private_key
  methodName = req.body.method_name
  methodArgs = req.body.method_args
  networkId = req.body.network_id

  let connInfo = { url: "https://rpc." + networkId + ".near.org" }
  // sets up a NEAR API/RPC provider to interact with the blockchain
  const provider = new nearAPI.providers.JsonRpcProvider(connInfo)

  const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)
  const publicKey = keyPair.getPublicKey()
  const accessKey = await provider
    .query(`access_key/${sender}/${publicKey}`, "")
    .catch((e) => {
      res.send(e)
    })
  const nonce = ++accessKey.nonce

  // constructs actions that will be passed to the createTransaction method below
  const actions = [
    nearAPI.transactions.functionCall(
      methodName,
      methodArgs,
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
  const signedSerializedTx = signedTransaction.encode()
  const encodedTransaction = Buffer.from(signedSerializedTx).toString("base64")
  console.log(encodedTransaction)
  encodedTransaction

  res.send(encodedTransaction)
})

app.listen(port, () => console.log(`Waiting for requests on port ${port}!`))
