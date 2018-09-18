var CryptoJS = require('crypto-js');
const CryptoGcm = require('crypto-gcm');
var crypto = require('crypto');

var config = {
  keySize: 512,
  iterations: 10000,
  masterKey: '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
}

// calcula um valor de salt aleatório
function getRandomSalt() {
  var salt = CryptoJS.lib.WordArray.random(config.keySize/32);
  var saltBase64 = CryptoJS.enc.Base64.stringify(salt);
  return saltBase64
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


function encryptWithAES(text) {
  var iv = Buffer.from(wordArrayToByteArray(CryptoJS.SHA256(config.masterKey), 32))
  const cg = new CryptoGcm({
    key: iv,
    encoding : {
      plaintext : 'utf8', // also supported: ascii, buffer
      payload : 'base64'  // also supported: base64, hex
    }
  })
  const payload = cg.encrypt(text);
  

  cg.destroy();

  return payload;
}

function decryptWithAES(enc) {
  var iv = Buffer.from(wordArrayToByteArray(CryptoJS.SHA256(config.masterKey), 32))
  const cg = new CryptoGcm({
    key: iv,
    encoding : {
      plaintext : 'utf8', // also supported: ascii, buffer
      payload : 'base64'  // also supported: base64, hex
    }
  })

  const decrypted = cg.decrypt(enc);
  cg.destroy();

  return decrypted;
}

//aux functions

function wordToByteArray(word, length) {
	var ba = [],
		i,
		xFF = 0xFF;
	if (length > 0)
		ba.push(word >>> 24);
	if (length > 1)
		ba.push((word >>> 16) & xFF);
	if (length > 2)
		ba.push((word >>> 8) & xFF);
	if (length > 3)
		ba.push(word & xFF);

	return ba;
}

function wordArrayToByteArray(wordArray, length) {
	if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
		length = wordArray.sigBytes;
		wordArray = wordArray.words;
	}

	var result = [],
		bytes
		i = 0;
	while (length > 0) {
		bytes = wordToByteArray(wordArray[i], Math.min(4, length));
		length -= bytes.length;
		result.push(bytes);
		i++;
	}
	return [].concat.apply([], result);
}



module.exports = {
  authentication, 
  getRandomSalt,
  hash,
  slowEquals,
  encryptWithAES,
  decryptWithAES
}


