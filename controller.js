var _ = require('underscore');
var auth = require('./auth.js');
var db = require('./db.js');

validateFields = function(user) {
  return new Promise ((resolve, reject) => {
    if (user.username.length < 3) return reject('Usuario deve ter no mínimo 3 caracteres')
    if (user.password.length < 8) return reject('Senha deve ter no mínimo 8 caracteres')
    resolve()
  })

}

function signup (user) {
  return new Promise ((resolve, reject) => {
    // var userCrypt = auth.encryptWithAES(username);

    validateFields(user).then(() => {

      var salt = auth.getRandomSalt()
      var passCrypt = auth.hash(user.password, salt);

      db.read(username).then((user) => {

        if(!user) {
          console.log('nenhum usuario encontrado')
          db.create(user.username, passCrypt, salt)
            .then((userSaved) => resolve('Usuario criado'))
            .catch((err)=>reject(err))

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
    
    db.find().then((users) => {

      _.each(users, (user) => {

        if(username === user.username) {
          var logged = auth.authentication(password, user.salt, user.password);
          if (logged) resolve(user)
          else reject('Senha incorreta')
        }
      })

      reject('Usuario não encontrado')

    }).catch((err)=>reject(err))

  })
}

function update (user) {
  return new Promise ((resolve, reject) => {
    
    signin(user.username, user.oldPassword).then((user) => {
      
    }).catch((err)=>reject(err))

  })
}



module.exports = {
  signin, signup
}