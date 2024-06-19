const express = require("express");
const app = express();
const path = require("path");

const ObjId = require('mongodb').ObjectId;

//body-parser : 몽고db에 데이터 입력
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//세션
let session = require('express-session');
app.use(session({
    secret : 'dkufe8938493j4e08349u',
    resave : false,
    saveUninitialized : true
}))

const sha = require('sha256');

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://manager:1231@data.mktdulk.mongodb.net/?retryWrites=true&w=majority&appName=data";
let db;

// 세션 설정
app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true
}));

// 뷰 엔진 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// 바디 파서 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, "../public")));

// MongoDB 연결
MongoClient.connect(url)
    .then(client => {
        db = client.db("dataBase");
        app.listen(3000, function(){
            console.log("서버가 3000번 포트에서 실행 중입니다");
        });
    })
    .catch(err => {
        console.error("MongoDB 연결 오류:", err);
    });

// 라우팅 설정
app.get("/", function(req, res){
    res.render("home");
});

// 로그인
app.get("/login", function(req, res){
    console.log(req.session);
    if (req.session.user) {
        console.log("세션 유지");
        res.render("exSummary", { user: req.session.user });
    } else {
        res.render("login");
    }
});

app.post("/login", function(req, res){
    console.log("아이디:", req.body.user_id);
    console.log("비밀번호:", req.body.user_pw);

    db.collection("UserInfo")
        .findOne({ user_id: req.body.user_id })
        .then(result => {
            console.log(result);
            if(result.user_pw == sha(req.body.user_pw)){
                req.session.user = req.body;
                console.log("새로운 로그인");
                res.render("exSummary", {user : req.session.user});
            }else{
                res.render("login");
            }
        }).catch(err=>{
            console.log(err);
        });
});

// 로그아웃
app.get("/logout", function(req, res){
    req.session.destroy(err => {
        if (err) {
            console.error("세션 삭제 중 오류:", err);
        }
        res.redirect("/");
    });
});

// 회원가입
app.get('/signup', function (req, res) {
    res.render("singup");
});

// 회원가입 후 바로 세션 설정
app.post("/signup", function (req, res) {
    console.log(req.body);
    db
        .collection("UserInfo")
        .insertOne({
            user_id: req.body.user_id,
            user_pw: sha(req.body.user_pw),
            user_name: req.body.user_name,
            user_birth: req.body.user_birth,
            user_height : null,
            user_weight : null,
            user_proficiency : null,
            user_purpose : null,
        }).then((result) => {
            console.log(result);
            console.log("회원가입 성공");

            // 회원가입 후 세션 설정
            req.session.user = {
                user_id: req.body.user_id,
                user_name: req.body.user_name // 필요에 따라 추가 정보 포함 가능
            };
            res.redirect("/setting");
        }).catch(err => {
            console.error("회원가입 오류:", err);
            res.redirect("/signup"); // 회원가입 실패 시 다시 회원가입 페이지로 리다이렉트
        });
});

// 프로필 설정
app.get("/setting", function(req, res){
    res.render("setting", {user : req.session.user});
});

app.post("/set", function(req, res){
    db.collection("UserInfo")
        .updateOne({user_id: req.session.user.user_id}, {$set : {
            user_weight : req.body.user_weight,
            user_height : req.body.user_height,
            user_proficiency : req.body.user_proficiency,
            user_purpose : req.body.user_purpose,
        }}).then(result=>{
            console.log(req.body);
            res.redirect("/exercise");
        }).catch(err=>{
            console.log(err);
        });
});

// 로그인 이후 페이지 렌더링
app.get("/exercise", function(req, res){
    if (req.session.user) {
        console.log("세션 유지");
        res.render("exSummary", { user: req.session.user });
    } else {
        res.render("login");
    }
});




// 루틴 추천
app.get("/recommend", function(req, res){
    res.render("routineRec");
});

// 루틴 추천 세부 정보
app.get("/routineExplain", function(req, res){
    res.render("routineExplain");
});

// 운동하기
app.get("/exercise", function(req, res){
    if (req.session.user) {
        console.log("세션 유지");
        res.render("exSummary", { user: req.session.user });
    } else {
        res.render("login");
    }
});

// 다이어리
app.get("/diary", function(req, res){
    res.render("calender");
});

// 운동 측정
app.get("/exStart", function(req, res){
    res.render("exStart");
});
