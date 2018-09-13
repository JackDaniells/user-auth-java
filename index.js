var CryptoJS = require('crypto-js');
var _ = require('underscore');
var mongoose = require('mongoose');
const Schema = mongoose.Schema; 

//mongoose.connect('mongodb://localhost/authJS');

//schema salvo no banco
const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});


var keySize = 32; //32 Bytes
var iteractions = 10000;


var password = '1234'
var salt = CryptoJS.lib.WordArray.random(keySize);

// criptografa a senha
function encrypt(password, salt) {
  var hashKey = CryptoJS.PBKDF2(password, salt, { keySize: keySize, iterations: iteractions }).toString();
  var hashPassword =  CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(salt + password, hashKey));
  return hashPassword;
}

// comparação lenta
function slowEquals(a, b) {
  var diff = a.length ^ b.length;
  for(var i = 0; i < a.length && i < b.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

var passwordHash = encrypt(password, salt);



// console.log("Digite sua senha:")
// var stdin = process.openStdin();
// stdin.addListener("data", function(d) {
   
// });

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite sua senha: ', (answer) => {
  var loginHash = encrypt(answer, salt);
  if(slowEquals(loginHash, passwordHash)) {
    console.log('usuario logado');
  } else {
    console.log('senha inválida');
  }
  rl.close();
});
// var encrypted = CryptoJS.AES.encrypt(myString, myPassword);
// var decrypted = CryptoJS.AES.decrypt(encrypted, myPassword);