var express = require('express')
var bodyParser = require('body-parser')
var controller = require('./controller.js')

var port = 80;

function init() {

  console.log('iniciando API')
  var app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  // cria a conta
  app.post('/api/signup', function (req, res) {
    console.log('signup')
    controller.signup(req.body)
      .then((message) => {
        res.send(message)
      }).catch((err) => {
        res.status(400).send(err)
      })
  })
 
  app.post('/api/signin', function (req, res) {
    console.log('signin')
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

  app.post('/api/update', function (req, res) {
    console.log('update')
    controller.update(req.body)
      .then((message) => {
        res.send(message)
      }).catch((err) => {
        res.status(400).send(err)
      })
  })

  app.post('/api/read', function (req, res) {
    console.log('read')
    controller.read(req.body)
      .then((message) => {
        res.send(message)
      }).catch((err) => {
        res.status(400).send(err)
      })
  })
  
  app.listen(port)
  console.log('listening in port ' + port)

}

module.exports = {init}
