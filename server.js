import express from 'express';
const app = express()
const port = 3000

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())
app.use(express.static('public'))

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

app.post('/recuperar', (req, res) => {
    params = ["cd_email", "dt_nasc"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Preencha todos os campos!")
        return
    }
    res.send("Email com instruções enviado!")
    account.recoverPassword(req.body);
    res.redirect('/login.html');
})

// app.post('/verify', (req, res) => {
//     params = ["cd_username", "ds_token"]
//     console.log(req.body)
//     if(!verifyBodyRequest(req.body, params)){
//         res.send("Preencha todos os campos!")
//         return
//     }
//     account.getTimeDiff(req.body, (isOkay) => {
//         if(isOkay){
//             account.loginUser(req.body, (cd_status) => {
//                 if(cd_status == "WRONG_PASSWORD"){
//                     res.send("WRONG_PASSWORD")
//                 }
//                 if(cd_status == "SUCCESS"){
//                     res.send("SUCCESS")
//                 }
//                 if(cd_status == "NOT_FOUND"){
//                     res.send("USER_NOT_FOUND")
//                 }
//             })
//         } else {
//             res.send("a senha expirou")
//         }
//     })
// })

// app.post('/change-password', (req, res) => {
//     params = ["cd_username", "ds_password1", "ds_password2"]
//     if(!verifyBodyRequest(req.body, params)){
//         res.send("Faltando Parametro")
//         return
//     }
//     if(req.body.ds_password1 == req.body.ds_password2){
//         account.updatePassword(req.body)
//         res.send("http://localhost:3000/login.html")
//     }
// })

app.post('/login', (req, res) => {
    params = ["ds_email", "ds_password"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
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
                    res.redirect(`/verify.html?ds_email=${req.body.ds_email}`)
                } else {
                    res.cookie('usuario', req.body.ds_email)
                    res.redirect('/feed.html')
                }
            })
        }
    })
    return;
})

// app.post('/logout', (req, res) => {
//     res.clearCookie('usuario')
//     res.redirect('/login.html')
// })

app.listen(3000, () => console.log("O servidor está rodando na porta 3000"))

function verifyBodyRequest(body, params){
    for(i in params){
        if(body[params[i]] == undefined){
            return false
        }
    }
    return true
}