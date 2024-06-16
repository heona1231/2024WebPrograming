const express = require("express");
const app = express();
const path = require("path");

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, "../public")));

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://test:1234@cluster0.z9je3sw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

MongoClient.connect(url)
    .then(client => {
        db = client.db("Fitsiah");
        app.listen(3000, function(){
            console.log("연결 완료");
        });
    })
    .catch(err => {
        console.log(err);
    });

// 라우팅 설정
app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/signup", function(req, res){
    res.render("singup");
});

app.get("/setting", function(req, res){
    res.render("setting");
});

app.get("/recommend", function(req, res){
    res.render("routineRec");
});

app.get("/routineExplain", function(req, res){
    res.render("routineExplain");
});

app.get("/exercise", function(req, res){
    res.render("exSummary");
});

app.get("/diary", function(req, res){
    res.render("calender");
});

app.get("/exStart", function(req, res){
    res.render("exStart");
});