var _ = require('underscore');
var app = require('./app.js');

var CryptoJS = require('crypto-js');

// var salt = CryptoJS.lib.WordArray.random(128/8); 
// console.log(salt)
// var key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 128/32 });
// console.log(key128Bits.toString())

app.init();

// var text = 'teste1234'
// var encrypted = auth.encryptWithAES(text);
// console.log(auth.decryptWithAES(encrypted));
// var salt = auth.getRandomSalt();
// var passwordHash = auth.hash(password, salt);

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Digite sua senha: ', (answer) => {
//   if(auth.authentication(answer, salt, passwordHash)) {
//     console.log('usuario logado');
//   } else {
//     console.log('senha inválida');
//   }
//   rl.close();
// });
