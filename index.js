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
  sender = req.body.sender
  receiver = req.body.receiver
  privateKey = req.body.private_key //TODO Consider securing the private key plain transmission
  methodName = req.body.method_name
  methodArgs = req.body.method_args
  networkId = req.body.network_id
  action = req.body.action_type
  amountString = req.body.amount

  //TODO add validation to the above fields.
  let connInfo = { url: "https://rpc." + networkId + ".near.org" }
  // sets up a NEAR API/RPC provider to interact with the blockchain
  const provider = new nearAPI.providers.JsonRpcProvider(connInfo)

  //generate keypair from the private key sent to the request
  const keyPair = nearAPI.utils.key_pair.KeyPairEd25519.fromString(privateKey)
  const publicKey = keyPair.getPublicKey()

  //check the pubic key exsists in the user access keys.
  //you should call this url to add the key to the user's set of keys before making transactions
  // https://wallet.{NETWORK_ID_HERE}.near.org/login/?success_url={SUCCESS_URL_HERE}&failure_url={FAILURE_URL_HERE}&contract_id={CONTRACT_HERE}&public_key={KEY_HERE}

  console.log(publicKey.toString())
  const accessKey = await provider
    .query(`access_key/${sender}/${publicKey.toString()}`, "")
    .catch((e) => {
      res.send(e)
    })
  const nonce = ++accessKey.nonce //unique number required for each transaction signed with an access key

  // constructs actions that will be passed to the createTransaction method below
  //currently supports function call only.
  actions = null
  if (action == "transfer") {
    const amount = nearAPI.utils.format.parseNearAmount(amountString)
    actions = [nearAPI.transactions.transfer(amount)]
  } else if (action == "function_call") {
    actions = [
      nearAPI.transactions.functionCall(
        methodName,
        methodArgs,
        DEFAULT_FUNC_CALL_GAS,
        0
      ),
    ]
  }

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

  res.send(encodedTransaction)
})

app.listen(port, () => console.log(`Waiting for requests on port ${port}!`))
