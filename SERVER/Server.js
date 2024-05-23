const username = encodeURIComponent("user");
const password = encodeURIComponent("1231");

const mongoclient = require('mongodb').MongoClient;
const url = `mongodb+srv://${username}:${password}@heona1231.l9uh4rc.mongodb.net/?retryWrites=true&w=majority`
let mydb;
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('2024WebPrograming');

        app.listen(8000, function () {
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
const path = require('path');
app.use(express.static(__dirname + '/nav'));
app.use(express.static(__dirname + '/signup'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/nav.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nav/nav.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup/signup.html');
})

app.post('/signup', function(req, res){
    console.log(req.body.user_id);
    mydb.collection('UserInfo').insertOne(
        {user_id : req.body.user_id, user_pw : req.body.user_pw, user_name : req.body.user_name, user_birth : req.body.user_birth}
    ).then(result=>{
        console.log(result);
        console.log('데이터 추가 성공');
    });
});

// app.listen(8080, function(){
//     console.log('포트 8080으로 서버 대기중...')
// });

app.get('/list', function (req, res) {
    // conn.query("select * from todolist", function(err, rows, fields){
    //     if(err) throw err;
    //     console.log(rows);
    // });
    mydb.collection('UserIdPw').find().toArray().then(result => {
        console.log(result);
    })
});

