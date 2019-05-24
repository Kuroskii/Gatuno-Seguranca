const express = require('express');
const body_parser = require('body-parser');
const app = express()
const port = 3000

const index = require('./views/js/index');

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())
app.use(express.static(__dirname + '/views'))

app.set('view engine', 'ejs')



app.get('/feed', function(req, res) {
    res.render('feed');
})




// app.get('*', function(req, res) {
//     res.render('erro');
// })




//cadastro ok

app.get('/cadastro', function(req, res) {
    res.render('cadastro');
})

app.post('/cadastro', (req, res) =>{
    console.log(req.body);
    params = ["nm_user", "ds_email", "dt_nasc"];
    if(!verifyBodyRequest(req.body, params)){
        res.send("Preencha todos os campos!");
        return;
    }
    index.adicionarUsuario(req.body, isWorking =>{
        if(isWorking == 1){
            res.send("Email enviado!");
        }
        if(isWorking == 2){
            res.send("Email já cadastrado!");
        }
        if(isWorking == 3){
            res.send("Erro!");
        }
    })
    return;
})






//recuperar ok

app.get('/recuperar', function(req, res) {
    res.render('recuperar');
})

app.post('/recuperar', (req, res) => {
    params = ["ds_email", "dt_nasc"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Preencha todos os campos!")
        return
    }
    index.recoverPassword(req.body);
    res.send("Email com instruções enviado!")
    console.log(req.body);
    res.render('login');
})






app.get('/mudar-senha', function(req, res) {
    res.render('mudar-senha');
})

app.post('/mudar-senha', (req, res) => {
    params = ["ds_password", "ds_password1", "ds_password2"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    if(req.body.ds_password1 == req.body.ds_password2){
        index.updatePassword(req.body)
        res.render("login")
    }
})





//login pronto

app.get('/', function(req, res) {
    res.render('login');
})

app.get('/login', function(req, res) {
    res.render('login');
})

app.post('/login', (req, res) => {
    params = ["ds_email", "ds_password"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Preencha todos os campos")
        return
    }
    index.entrar(req.body, (cd_status) => {
        if(cd_status == undefined || cd_status == "NOT_FOUND"){
            res.send("USER_NOT_FOUND")
        }
        if(cd_status == "WRONG_PASSWORD"){
            res.send("WRONG_PASSWORD")
        }
        if(cd_status == "SUCCESS"){
            index.isFirstTime(req.body, is_first_time => {
                if(!is_first_time){
                    res.render(`/mudar-senha?ds_email=${req.body.ds_email}`)
                } else {
                    //res.cookie('usuario', req.body.ds_email)
                    res.render('/feed')
                }
            })
        }
    })
    return;
})




// app.post('/logout', (req, res) => {
//     res.clearCookie('usuario')
//     res.render('/login')
// })

app.listen(port, () => console.log(`O servidor está rodando na porta ${port}`))

function verifyBodyRequest(body, params){
    for(i in params){
        if(body[params[i]] == undefined){
            return false
        }
    }
    return true
}