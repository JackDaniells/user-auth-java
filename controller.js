var _ = require('underscore');
var auth = require('./auth.js');
var db = require('./db.js');

validateFields = function(user) {
  return new Promise ((resolve, reject) => {
    if (!user.username || user.username.length < 3) return reject('Usuario deve ter no mínimo 3 caracteres')
    if (!user.password || user.password.length < 8) return reject('Senha deve ter no mínimo 8 caracteres')
    resolve()
  })

}

function signup (user) {
  return new Promise ((resolve, reject) => {
    //valida o usuario
    validateFields(user).then(() => {
      //encripta o usuario
      var userCrypt = auth.encryptWithAES(user.username);
      // ve se nao tem usuario igual no banco
      db.read(userCrypt).then((userDB) => {
        //gera o salt
        var salt = auth.getRandomSalt()
        // cria o hash da senha
        var passCrypt = auth.hash(user.password, salt);
        console.log(passCrypt)
        if(!userDB) {

          var saltCrypt = auth.encryptWithAES(salt);

          console.log('nenhum usuario encontrado')
          //cria o usuario
          db.create(userCrypt, passCrypt, saltCrypt)
            .then((userSaved) => {
              console.log('Usuario criado')
              resolve('Usuario criado')
            }).catch((err)=>{
              console.log('erro ao salvar')
              reject(err)
            })
        } else {
          console.log('Usuario ja existe')
          reject('Usuario ja existe')
        }

      }).catch((err)=>reject(err))

    }).catch((err)=>reject(err))
    
  });
}

function signin (username, password) {
  return new Promise ((resolve, reject) => {
    // console.log(username)
    // var userCrypt = auth.encryptWithAES(username);
    // console.log(userCrypt)
    
    //busca todos os usuarios do banco
    db.find().then((users) => {

      _.each(users, (user) => {

        //decifra o usuario
        var userDecrypted = auth.decryptWithAES(user.username);
        console.log(userDecrypted)
        //caso o usuario digitado e o usuario do banco forem iguais, valida a senha
        if(auth.slowEquals(userDecrypted, username)) {
          //decifra o salt
          var saltDecrypted = auth.decryptWithAES(user.salt);
          console.log(saltDecrypted)
          //funcao de validacao da senha
          var logged = auth.authentication(password, saltDecrypted, user.password);
          //retorna se esta autenticado
          if (logged) resolve(user)
          else reject('Senha incorreta')
        }
      })

      reject('Usuario não encontrado')

    }).catch((err)=>reject(err))

  })
}

function update (body) {
  return new Promise ((resolve, reject) => {
    //autentica o usuario
    signin(body.username, body.oldPassword).then((user) => {
      //caso esteja autenticado, permite atualizar os dados
      if(user) {
        //altera a senha
        if(body.newPassword && auth.slowEquals(body.newPassword, body.retypePassword)) {
          var salt = auth.getRandomSalt();
          user.password = auth.hash(body.newPassword, salt);
          //salva no banco
          user.salt = auth.encryptWithAES(salt);
          
          user.save((err) => {
            if(err) reject(err);
            else resolve('Usuario atualizado');
          })

        } else reject('Senhas não conferem')

      } else reject('Usuario nao encontrado')

    }).catch((err)=>reject(err))

  })
}

function read (body) {
  return new Promise ((resolve, reject) => {
    //valida o usuario
    signin(body.username, body.password).then((user) => {
      
      if(user) {
        //decifra o usuario e a senha
        userDecrypt = auth.decryptWithAES(user.username)
        user.username = userDecrypt
        saltDecrypt = auth.decryptWithAES(user.salt)
        user.salt = saltDecrypt
        resolve(user);
        
      } else reject('Usuario nao encontrado')

    }).catch((err)=>reject(err))

  })
}



module.exports = {
  signin, signup, update, read
}