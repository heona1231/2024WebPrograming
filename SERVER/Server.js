const username = encodeURIComponent("manager");
const password = encodeURIComponent("1231");



const mongoclient = require('mongodb').MongoClient;
const url = `mongodb+srv://${username}:${password}@data.mktdulk.mongodb.net/`
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('dataBase');

        app.listen(8080, function () {
            console.log("포트 8080으로 서버 대기중...");
        });
    }).catch(err => {
        console.log(err);
    });



// var mysql = require("mysql");
// var conn = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"1231",
//     database:"yourboard",
// });

//conn.connect();

// conn.query("select * from todolist", function(err, rows, fields){
//     if(err) throw err;
//     console.log(rows);
// });



const express = require('express');
const app = express();
const sha = require('sha256');
const path = require('path');
app.use(express.static(__dirname + '/views/nav'));
app.use(express.static(__dirname + '/views/signup'));
app.use(express.static(__dirname + '/views/test'));



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



let session = require('express-session');

app.use(session({
    secret: "dkufe8938493j4e08349u",
    resave: false,
    saveUninitialized: true
}))



// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/index.html');
// })

app.get("/", function (req, res) {
    if (req.session.user_id) {
        console.log("세션 유지");
        res.render("index.ejs", { user_id: req.session.user_id });
    }
    else {
        console.log("user : null");
        res.render("index.ejs", { user_id: null });
    }
});



app.get('/nav.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/nav/nav.html'));
});



app.get('/signup', function (req, res) {
    res.render("signup/signup.ejs");
});

app.post("/signup", function (req, res) {
    console.log(req.body.user_id);

    mydb
        .collection("UserInfo")
        .insertOne({
            user_id: req.body.user_id,
            user_pw: sha(req.body.user_pw),
            user_name: req.body.user_name,
            user_birth: req.body.user_birth,
        })
        .then((result) => {
            console.log("회원가입 성공");
        });
    res.redirect("/");
})

// app.post('/signup', function (req, res) {
//     console.log(req.body.user_id);
//     mydb.collection('UserInfo').insertOne(
//         { user_id: req.body.user_id, user_pw: req.body.user_pw, user_name: req.body.user_name, user_birth: req.body.user_birth }
//     ).then(result => {
//         console.log(result);
//         console.log('데이터 추가 성공');
//     });
// });



app.get("/login", function (req, res) {
    console.log(req.session);
    if(req.session.user){
        console.log('세션유지');
        res.render('index.ejs', {user : req.session.user});
    }
    else
    {
        res.render('login/login.ejs');
    }
});

app.post("/login", function (req, res) {
    console.log("아이디 : ", req.body.user_id);
    console.log(req.body.user_pw);    
    console.log(sha(req.body.user_pw));    
    
    mydb
    .collection("UserInfo")
    .findOne({user_id : req.body.user_id})
    .then((result)=>{
        if(result.user_pw == sha(req.body.user_pw))
        {
            req.session.user = req.body;
            console.log('새로운 로그인');
            res.render('index.ejs', {user : req.session.user});
        }
        else
        {
            res.render('login/login.ejs');
        }
    })
})



app.get("/logout", function(req, res){
    console.log("로그아웃");
    req.session.destroy();
    res.redirect("/");
});



// app.listen(8080, function(){
//     console.log('포트 8080으로 서버 대기중...')
// });

// app.get('/list', function (req, res) {
//     // conn.query("select * from todolist", function(err, rows, fields){
//     //     if(err) throw err;
//     //     console.log(rows);
//     // });
//     mydb.collection('UserInfo').find().toArray(function (err, result) {
//         console.log(result);
//         res.render('/views/test/signup.ejs', { data: result });
//     })
// });

app.get('/list', function (req, res) {
    mydb.collection('UserInfo').find().toArray()
        .then(result => {
            console.log(result);
            res.render('test/signup.ejs', { data: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('데이터를 불러오는 중에 오류가 발생했습니다.');
        });
});



// let cookieParser = require('cookie-parser');

// app.use(cookieParser('ncvka0e398423kpfd'));
// app.get('/cookie', function(req, res){
//     let milk = parseInt(req.signedCookies.milk) + 1000;
//     if(isNaN(milk))
//     {
//         milk = 0;
//     }
//     res.cookie("milk", milk, {signed : true});
//     res.send("product : " + milk + "원");
// });



app.get("/session", function (req, res) {
    if (isNaN(req.session.milk)) {
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.milk + "원");
});