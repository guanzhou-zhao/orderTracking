var bcrypt = require('bcrypt')
const saltRounds = 10

var salt = bcrypt.genSaltSync(saltRounds)

var hash = function (myPlaintextPassword) {
  return bcrypt.hashSync(myPlaintextPassword, salt)
}

var compareHash = function (myPlaintextPassword, hash) {
  return bcrypt.compareSync(myPlaintextPassword, hash)
}

module.exports = {
  hash: hash,
  compareHash: compareHash
}
