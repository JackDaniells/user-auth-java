var CryptoJS = require('crypto-js');
var crypto = require('crypto');

var config = {
  keySize: 512,
  iterations: 10000,
}

// calcula um valor de salt aleatório
function getRandomSalt() {
  var salt = CryptoJS.lib.WordArray.random(config.keySize/8);
  return CryptoJS.enc.Base64.stringify(salt);
}

// comparação lenta
function slowEquals(a, b) {
  var diff = a.length ^ b.length;
  for(var i = 0; i < a.length && i < b.length; i++) 
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// criptografa a senha
function hash(password, salt) {
  //calcula a chave derivada utilizada no algoritmo do hash
  var hashKey = CryptoJS.PBKDF2(password, salt, {keySize: config.keySize/32, iterations: config.interations}).toString();
  // calcula o MAC da senha utilizando a chave derivada calculada acima
  var hashPassword = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(salt + password, hashKey));
  return hashPassword;
}

function authentication(password, salt, hashPass) {
  var hashAuth = hash(password, salt);
  console.log(hashAuth)
  console.log(hashPass)
  return slowEquals(hashAuth, hashPass);
}


//   var password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
//   var iv = '60iP0h6vJoEa'

// function encryptWithAES(text, key) {
//   var key = CryptoJS.PBKDF2(text, iv, config).toString();
//   var cipher = crypto.createCipheriv('aes-256-gcm', key)
//   var encrypted = cipher.update(text, 'utf8', 'hex')
//   encrypted += cipher.final('hex');
//   return encrypted 
// }

// function decryptWithAES(encrypted) {
//   var decipher = crypto.createDecipheriv('aes-256-gcm', iv)
//   decipher.setAuthTag(encrypted.tag);
//   var dec = decipher.update(encrypted.content, 'hex', 'utf8')
//   dec += decipher.final('utf8');
//   return dec;
// }



module.exports = {
  authentication, 
  getRandomSalt,
  hash,
  // encryptWithAES,
  // decryptWithAES
}


