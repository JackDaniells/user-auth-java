var express = require('express')
var bodyParser = require('body-parser')
var controller = require('./controller.js')

var port = 80;

function init() {

  var app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // cria a conta
  app.post('/signup', function (req, res) {

    var user = req.body.username;
    var password = req.body.password;
    console.log('criando usuario')
    controller.signup(user, password)
      .then((message) => {
        res.send(message)
      }).catch((err) => {
        res.status(400).send(err)
      })
  })
 
  app.post('/signin', function (req, res) {
    var user = req.body.username;
    var password = req.body.password;
    console.log('logando')
    controller.signin(user, password)
      .then((message) => {
        res.send('Usuario logado')
      }).catch((err) => {
        res.status(400).send(err)
      })
  })
  
  app.listen(port)
  console.log('listening in port ' + port)

}

module.exports = {init}
