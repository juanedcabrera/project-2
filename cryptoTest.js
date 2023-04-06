// node.js's built in crypto lib
const crypto = require ('crypto')
const cryptoJs = require ('crypto-js')

// hashing
// one way process -- a string that has been hashed
// regardless of the input, the hash is always the same size
// cannot be 'un hashed'

// sha256
// const hash = crypto.createHash('sha256')

// hash.update('a')

// const digest = hash.digest('hex')
// console.log('sha256', digest)
// encryption

// const bcrypt = require('bcrypt')

// const userPassword = 'hello123'

// const hashedPassword = bcrypt.hashSync(userPassword, 12)

// console.log(bcrypt.compareSync('hello123', hashedPassword))

// hashing is one way process 
// encryption is two way process where data is locked in encrypted string and using key could remove the data from the string



const stringToEncrypt = 'hello i am a secret message'

const encryptionKey = 'myKey'

// Advanced Encryption Standard
const myEncryption = cryptoJs.AES.encrypt(stringToEncrypt, encryptionKey)
console.log(myEncryption.toString())

const decryptedMessage = cryptoJs.AES.decrypt(myEncryption.toString(), encryptionKey).toString(cryptoJs.enc.Utf8)
console.log(decryptedMessage)
