var CryptoJS = require('crypto-js');
var _ = require('underscore');

var keySize = 32*8; //32 Bytes
var iteractions = 1000;

var hashKey = 'VE8e4zL37HMju4D6m5ShPXqsHXABhmB3U6du3AMv42Aj'

//HMAC256
var hash = CryptoJS.HmacSHA256("message", hashKey);
var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
console.log(hashInBase64)

//PBKDF2
var salt = CryptoJS.lib.WordArray.random(keySize); 
var key512Bits1000Iterations = CryptoJS.PBKDF2(hashInBase64, salt, { keySize: keySize, iterations: iteractions });
//console.log(key512Bits1000Iterations)
