const nodemailer = require('nodemailer');
const mysql = require('mysql');
const crypto = require('crypto');

//banco de dados = nome, email, data de nascimento, senha(hash)
// e se tá validado

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

/*

DATABASE - GATUNO

TABLE - tb_user

COLUNAS - 

create table tb_user(
    ds_email VARCHAR(100) NOT NULL PRIMARY KEY,
    nm_user VARCHAR(60),
    dt_nasc DATE,
    ds_password VARCHAR(513),
    ds_token VARCHAR(513),
    is_verified BOOLEAN

)

*/

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'gatuno'
});

conn.connect(function(err){
  if (err)  throw err;
  console.log("BD connected!");
});

//assim que entra no botão "Entrar"
//pronto
function entrar(login, callback){
  var hash = crypto.createHash('sha512');
  var password = hash.update(login.ds_password, 'utf-8');
  var sql = `SELECT ds_password = ? as cd_status FROM tb_user WHERE
  ds_email = ? LIMIT 1`  
  var cd_status = "DEFAULT_RESULT" && 0;
  conn.query(sql, [password.digest('base64'), login.ds_email], (err, result, fields) =>{
    if(err){
      console.error(err);
    } else {
      if(result == undefined || result.length == 0){
        cd_status = "NOT_FOUND"
        callback(cd_status);
      }
      if(result[0].cd_status == 0){
        cd_status = "WRONG_PASSWORD";
        callback(cd_status);
      }
      if(result[0].cd_status == 1){
        cd_status = "SUCCESS";
        callback(cd_status);
      }
    }
  })
}

//pronto
function adicionarUsuario(user, callback){
  var sql = `INSERT INTO tb_user(nm_user, ds_email, dt_nasc,
    ds_token, ds_password, is_verified) VALUES (?, ?, ?, ?, ?, FALSE)`
  var isWorking = 3;
  ds_token = createRandomPassword();
  var hash = crypto.createHash('sha512');
  var token = hash.update(ds_token, 'utf-8');
  conn.query(sql, [user.nm_user, user.ds_email, user.dt_nasc, token.digest('base64'), null], (err, rows, fields) => {
    if(err){
      if(err.sqlState == 23000){
        isWorking = 2;
      }
    } else {
      console.log('Cadastro criado!');
      isWorking = 1;      
      var mailCadastro = {
        from: 'gatunosec@gmail.com',
        to: user.ds_email,
        subject: 'Cadastro em GATUNO',
        html: `<h3>Cadastro em GATUNO quase concluído, confirme seu email com o código: <strong>${ds_token} </strong></h3>
              <a href="http://localhost:3000/mudar-senha?ds_email=${user.ds_email}">Clique aqui!</a>`
      };
      transporter.sendMail(mailCadastro, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    }
    callback(isWorking);
  })
}

//pronto
 function isFirstTime(login, callback){
   var sql = `SELECT is_verified FROM tb_user WHERE ds_email = ? LIMIT 1`
   conn.query(sql, [login.ds_email], (err, result, fields) => {
       if(err){
           console.error(err)
       } else {
           callback(result[0].is_verified)
       }
   })
 }

//pronto
//funcao novo usuario
function updatePassword(user, callback){
  var sql = `UPDATE tb_user SET ds_password = ?, ds_username = ? WHERE ds_email = ?`
  var hash = crypto.createHash('sha512')
  var password = hash.update(user.ds_password1, 'utf-8')
  conn.query(sql, [password.digest('base64'), user.ds_username, user.ds_email], (err, result, fields) => {
      if(err){
          console.error(err)
      } else {
          updateVerificado(user)
          console.log("updated password and username")
      }
  })
}

function validateToken(user,callback){
  var sql = `SELECT ds_token FROM tb_user WHERE ds_email = ?`
  var isWorking = 3;
  var hash = crypto.createHash('sha512')
  var token = hash.update(user.ds_token, 'utf-8')
  conn.query(sql, [user.ds_email], (err, result, fields) => {
    if(err){
      isWorking = 2
      console.error(err)
    } else {
      console.log("token: %j", result[0].ds_token)
      if(result[0].ds_token == token.digest('base64')){
        isWorking = 3
        updatePassword(user)
      } else {
        isWorking = 1
      }
    }
    callback(isWorking)
  })
}

//pronto
function updateVerificado(user, callback){
  var sql = `UPDATE tb_user SET is_verified = TRUE WHERE ds_email = ?`
  conn.query(sql, [user.ds_email], (err, result, fields) => {
      if(err){
          console.error(err)
      } else {
          console.log("updated verify only")
      }
  })
}

//pronto
//funcao esquecer a senha
function updatePasswordEmail(user, callback){
  var sql = `UPDATE tb_user SET ds_password = ?, is_verified = TRUE WHERE ds_email = ?`
  var hash = crypto.createHash('sha512')
  var password = hash.update(user.ds_password, 'utf-8')
  conn.query(sql, [password.digest('base64'), user.ds_email], (err, result, fields) => {
      if(err){
          console.error(err)
      } else {
          console.log("updated")
      }
  })
}

//pronto
function recoverPassword(user, callback){
  var sql = `SELECT ds_email FROM tb_user WHERE ds_email = ? and dt_nasc = ?`
  conn.query(sql, [user.ds_email, user.dt_nasc], (err, result, fields) => {
      if(err){
          console.log(err)
      } else {
          console.log(result)
          if(result == undefined || result.length == 0){
              callback()
          } else {
              user.ds_password1 = createRandomPassword()
              updatePasswordEmail(user)
              var mailCadastro = {
                from: 'gatunosec@gmail.com',
                to: user.ds_email,
                subject: 'Esqueci a senha em GATUNO',
                html: `<h3>Recuperação em GATUNO quase concluída, sua senha provisória é:<b> ${ds_password}</b></h3>
                      <a href="http://localhost:3000/mudar-senha?ds_email=${user.ds_email}">Clique aqui!</a>`
              };
              transporter.sendMail(mailCadastro, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
          }
      }
  })
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gatunosec@gmail.com', //email e senha do gatuno
    pass: 'gatuino12'
   }//,
  //   tls: {
  //       rejectUnauthorized: false
  //   }
});

function createRandomPassword(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

module.exports = {
  adicionarUsuario: adicionarUsuario,
  entrar: entrar,
  isFirstTime: isFirstTime,
  updatePassword: updatePassword,
  updatePasswordEmail: updatePasswordEmail,
  recoverPassword: recoverPassword,
  validateToken: validateToken
}