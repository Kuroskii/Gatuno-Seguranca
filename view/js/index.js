import isEmail from 'validator';
import nodemailer from 'nodemailer';
import mysql from "mysql";
import crypto from 'crypto';

/*
por enquanto, falta linkar o mySQL, ver se o passwordHash é melhor que o bcrypt, ou então o Crypto
e terminar tudo, pq só ta iniciado pela metade,
menos o email, acho que esse funciona :)
*/

//banco de dados = nome, email, data de nascimento, senha(hash)
// e se tá validado
// https://github.com/fernandok4/information-security-fatec
// git do kanashiro, com o mesmo projeto que o nosso

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});

//assim que entra no botão "Entrar"
function entrar(login, callback){
  var hash = crypto.createHash('sha256');
  var password = hash.update(login.ds_password, 'utf-8');
  var sql = `SELECT ds_password = ? as cd_status FROM tb_User WHERE
  ds_email = ? LIMIT 1`
  var cd_status = "DEFAULT_RESULT";
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


//falta jogar tudo no SQL, assim que faz o cadastro, e ver se já existe, pelo email
function adicionarUsuario(user, callback){
  var sql = `INSERT INTO tb_User(nm_user, ds_email, dt_nasc,
    ds_password, is_verified) VALUES (?, ?, ?, ?, FALSE)`
  var isWorking = 3;
  ds_password = createRandomPassword();
  var hash = crypto.createHash('sha256');
  var password = hash.update(ds_password, 'utf-8');
  conn.query(sql, [cd_username, password.digest('base64'), ds_email, nm_user], (err, rows, fields) => {
    if(err){
      if(err.sqlState == 23000){
        isWorking = 2;
      }
    } else {
      console.log('Cadastro criado! Verifique seu email!');
      isWorking = 1;
      transporter.sendMail(mailCadastro);
    }
    callback(isWorking);
  })
}

// ver se o email existe cadastrado, e comprarar o email e a data de nascimento, e mandar um email pra ele
function recuperar(){
}


function verificarConta(){

}

// function resendEmail(login, callback){
//   let sql = `SELECT ds_email FROM tb_user WHERE cd_username = ?`
//   conn.query(sql, [login.cd_username], (err, result, fields) => {
//       if (err){
//           console.log(err)
//       } else {
//           if(result == undefined || result.length == 0){
//               return
//           }
          
//       }
//   })
// }



 function isFirstTime(login, callback){
   var sql = `SELECT is_verified FROM tb_user WHERE cd_username = ? LIMIT 1`
   conn.query(sql, login.cd_username, (err, result, fields) => {
       if(err){
           console.error(err)
       } else {
           callback(result[0].is_verified)
       }
   })
 }


// function updatePassword(user, callback){
//   let sql = `UPDATE tb_user SET ds_password = ?, is_verified = TRUE WHERE cd_username = ?`
//   let hash = crypto.createHash('sha512')
//   let password = hash.update(user.ds_password1, 'utf-8')
//   conn.query(sql, [password.digest('base64'), user.cd_username], (err, result, fields) => {
//       if(err){
//           console.error(err)
//       } else {
//           console.log("updated")
//       }
//   })
// }





// function updatePasswordEmail(user, callback){
//   let sql = `UPDATE tb_user SET ds_password = ?, is_verified = FALSE WHERE cd_username = ?`
//   let hash = crypto.createHash('sha512')
//   let password = hash.update(user.ds_password1, 'utf-8')
//   conn.query(sql, [password.digest('base64'), user.cd_username], (err, result, fields) => {
//       if(err){
//           console.error(err)
//       } else {
//           console.log("updated")
//       }
//   })
// }





//precisa criar um email pro gatuno, e ver como se faz um link de confirmação
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gatuno@gmail.com', //email e senha do gatuno
    pass: 'senhalinda'
  }
});

var mailCadastro = {
  from: 'gatuno@gmail.com',
  to: ds_email,
  subject: 'Cadastro em GATUNO',
  html: `<h1>Cadastro em GATUNO quase concluído, falta apenas confirmar o seu email:</h1>
         <a href="">Clique aqui!</a>`
};

transporter.sendMail(mailCadastro, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});




function createRandomPassword(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}