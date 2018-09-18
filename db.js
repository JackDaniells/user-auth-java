var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//conecta no banco
mongoose.connect('mongodb://localhost/authJS');

//schema da tabela de usuários
const UserSchema = new Schema({
  name: { 
    type: String, 
    // required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  salt: { 
    type: String, 
    required: true 
  }
});

mongoose.model('User', UserSchema);

var User = mongoose.model('User');

//cria o usuario no banco
function create(username, password, salt) {
  console.log(`${username} - ${password} - ${salt}`)
  return new Promise ((resolve, reject) => {
    var user = new User()
    user.username = username;
    user.password = password;
    user.salt = salt;

    user.save((err) => {
      if (err) reject(err);
      else resolve(user);
    })
  })
}

//busca o usuario no banco
function read(username) {
  return new Promise ((resolve, reject) => {
    User.findOne({username: username}).exec((err, user) => {
      if(err) reject(err)
      else resolve(user)
    })
  });
}

//busca o usuario no banco
function find() {
  return new Promise ((resolve, reject) => {
    User.find({}).exec((err, users) => {
      if(err) reject(err)
      else resolve(users)
    })
  });
}

//atualiza o usuario no banco
function update(username, password, salt) {
  return new Promise ((resolve, reject) => {
    User.findOne({username: username}).exec((err, user) => {
      if(err) reject(err)
      else if (!user) reject('Usuário não encontrado');
      else {
        // user.username = username;
        user.password = password;
        user.salt = salt;

        user.save((err) => {
          if (err) reject(err);
          else resolve(user);
        })

      }
    })
  })
}

//remove o usuario no banco
function remove(username) {
  return new Promise ((resolve, reject) => {
    User.findOne({username: username}).exec((err, user) => {
      if(err) reject(err)
      else if (!user) reject('Usuário não encontrado');
      else {
        user.remove((err) => {
          if (err) reject(err)
          else resolve(user)
        })
      }
    })
  });
}

module.exports = {
  create,
  read,
  update,
  remove,
  find
}