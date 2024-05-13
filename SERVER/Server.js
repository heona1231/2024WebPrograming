var mysql = require("mysql");
var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1231",
    database:"yourboard",
});

conn.connect();

conn.query("select * from todolist", function(err, rows, fields){
    if(err) throw err;
    console.log(rows);
});

const express = require('express');
const app = express();

app.listen(8080, function(){
    console.log('포트 8080으로 서버 대기중...')
});

app.get('/book', function(req, res){
    res.send('도서 목록 관련 페이지입니다.');
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.get('/list', function(req, res){
    console.log('데이터베이스를 조회합니다.');
});