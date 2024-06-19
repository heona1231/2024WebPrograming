const express = require("express");
const app = express();
const path = require("path");
const { pipeline } = require("stream");

const ObjId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//세션
let session = require('express-session');
app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true
}))

const sha = require('sha256');

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, "../public")));

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://manager:1231@data.mktdulk.mongodb.net/";
let db;

MongoClient.connect(url)
    .then(client => {
        db = client.db("dataBase");
        app.listen(3000, function () {
            console.log("연결 완료");
        });
    })
    .catch(err => {
        console.log(err);
    });

// 라우팅 설정
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    console.log(req.session);
    if (req.session.user) {
        console.log("세션 유지");
        res.redirect("/exercise");
    } else {
        res.render("login");
    }
});

app.post("/login", function (req, res) {
    console.log("아이디:", req.body.user_id);
    console.log("비밀번호:", req.body.user_pw);

    db.collection("UserInfo")
        .findOne({ user_id: req.body.user_id })
        .then(result => {
            console.log(result);
            if (result.user_pw == sha(req.body.user_pw)) {
                req.session.user = req.body;
                console.log("새로운 로그인");
                res.redirect("/exercise");
                //res.render("exSummary", {user : req.session.user});
            } else {
                res.render("login");
            }
        }).catch(err => {
            console.log(err);
        });
});

//로그아웃
app.get("/logout", function (req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error("세션 삭제 중 오류:", err);
        }
        res.redirect("/");
    });
});

//회원가입
app.get("/signup", function (req, res) {
    res.render("singup");
});

app.post("/signup", function (req, res) {
    console.log(req.body);
    db
        .collection("UserInfo")
        .insertOne({
            user_id: req.body.user_id,
            user_pw: sha(req.body.user_pw),
            user_name: req.body.user_name,
            user_birth: req.body.user_birth,
            user_height: null,
            user_weight: null,
            user_proficiency: null,
            user_purpose: null,
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

//프로필설정
app.get("/setting", function (req, res) {
    res.render("setting");
});

app.post("/set", function (req, res) {
    const today = new Date().toISOString().split('T')[0];
    if (req.body.user_purpose == "weight_loss") {
        db.collection("UserRoutine").insertOne({
            userId: req.session.user.user_id,
            routine: ['시티드 케이블 로우', '체스트 프레스 머신', '인클라인 벤치프레스', '덤벨 숄더 프레스', '싸이클'],
            date: today,
            routineCount: [1, 1, 1, 1, 1],
            routineSet: [4, 4, 4, 4, 1],
            routineWeight: [15, 15, 10, 5, 0],
            routineCompleted: [false, false, false, false, false],
            timer: '00-00-00',
            todayComment: "",
        });
    }
    else if (req.body.user_purpose == "bulking") {
        db.collection("UserRoutine").insertOne({
            userId: req.session.user.user_id,
            routine: ['오버헤드 프레스', '리어 델토이드 플라이 머신', '바벨 백스쿼트', '덤벨 런지', '트레드밀'],
            date: today,
            routineCount: [1, 1, 1, 1, 1],
            routineSet: [4, 4, 3, 4, 1],
            routineWeight: [10, 5, 20, 3, 0],
            routineCompleted: [false, false, false, false, false],
            timer: '00-00-00',
            todayComment: "",
        });
    }
    else {
        db.collection("UserRoutine").insertOne({
            userId: req.session.user.user_id,
            routine: ['덤벨 벤치프레스', '덤벨 런지', '바벨 백스쿼트', '줄넘기', '스텝밀'],
            date: today,
            routineCount: [1, 1, 1, 1, 1],
            routineSet: [4, 4, 3, 1, 1],
            routineWeight: [5, 3, 20, 0, 0],
            routineCompleted: [false, false, false, false, false],
            timer: '00-00-00',
            todayComment: "",
        });
    }

    db.collection("UserInfo")
        .updateOne({
            user_id: req.session.user.user_id
        },
            {
                $set: {
                    user_weight: req.body.user_weight,
                    user_height: req.body.user_height,
                    user_proficiency: req.body.user_proficiency,
                    user_purpose: req.body.user_purpose,
                }
            })
        .then(result => {
            console.log(req.body);
            res.redirect("/exercise");
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/recommend", function (req, res) {
    res.render("routineRec");
});

app.get("/routineExplain", function (req, res) {
    res.render("routineExplain");
});

// /exercise 엔드포인트 정의
app.get("/exercise", async function (req, res) {
    if (req.session.user) {
        const userId = req.session.user.user_id;
        console.log(userId);
        const today = new Date().toISOString().split('T')[0]; // 오늘의 날짜 (YYYY-MM-DD 형식)

        try {
            // 오늘 날짜와 일치하는 루틴 또는 가장 최근 날짜의 루틴 찾기
            const userRoutine = await db.collection('UserRoutine').aggregate([
                {
                    $match: { userId: userId }
                },
                {
                    $addFields: {
                        isToday: { $eq: ["$date", today] }
                    }
                },
                {
                    $sort: { isToday: -1, date: -1 } // 오늘 날짜가 우선, 그 다음 최근 날짜
                },
                {
                    $limit: 1 // 하나의 문서만 선택
                },
                {
                    $lookup: {
                        from: 'ExerciseData',
                        let: { routine: "$routine" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$exercise_name", "$$routine"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    exercise_name: 1,
                                    exercise_tool: 1
                                }
                            }
                        ],
                        as: 'exerciseInfo'
                    }
                }
            ]).toArray();

            if (userRoutine.length > 0) {
                const routineData = userRoutine[0];
                const combinedData = routineData.exerciseInfo.map((exercise, index) => ({
                    ...exercise,
                    count: routineData.routineCount[index],
                    weight: routineData.routineWeight[index],
                    set: routineData.routineSet[index],
                    completed: routineData.routineCompleted[index],
                }));
                console.log(combinedData);
                res.render("exSummary", {
                    data: combinedData,
                    date: routineData.date,
                    timer: routineData.timer
                });
            } else {
                res.status(404).json({ message: 'User not found or no exercises found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.render('login');
    }
});

app.get("/diary", async function (req, res) {
    const _userId = req.session.user.user_id;
    const _date = req.query.date;

    console.log(_userId)
    console.log(_date)

    try {
        // 요청된 날짜와 일치하는 루틴 찾기
        const userRoutine = await db.collection('UserRoutine').aggregate([
            {
                $match: { userId: _userId, date: _date }
            },
            {
                $lookup: {
                    from: 'ExerciseData',
                    let: { routine: "$routine" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$exercise_name", "$$routine"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                exercise_name: 1,
                                exercise_tool: 1
                            }
                        }
                    ],
                    as: 'exerciseInfo'
                }
            }
        ]).toArray();

        if (userRoutine.length > 0) {
            const routineData = userRoutine[0];
            const combinedData = routineData.exerciseInfo.map((exercise, index) => ({
                ...exercise,
                count: routineData.routineCount[index],
                weight: routineData.routineWeight[index],
                set: routineData.routineSet[index],
                completed: routineData.routineCompleted[index],
            }));

            res.render("calender", {
                data: combinedData,
                date: routineData.date,
                timer: routineData.timer,
                todayComment : routineData.todayComment
            });
        } else {
            // 데이터가 없는 경우 기본값 반환
            res.render("calender", {
                data: [],
                date: _date,
                timer: "00-00-00",
                todayComment : "문구를 작성해보세요!"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get("/exStart", async function (req, res) {
    if (req.session.user) {
        const userId = req.session.user.user_id;
        const today = new Date().toISOString().split('T')[0]; // 오늘의 날짜 (YYYY-MM-DD 형식)

        try {
            // 오늘 날짜와 일치하는 루틴 또는 가장 최근 날짜의 루틴 찾기
            const userRoutine = await db.collection('UserRoutine').aggregate([
                {
                    $match: { userId: userId }
                },
                {
                    $addFields: {
                        isToday: { $eq: ["$date", today] }
                    }
                },
                {
                    $sort: { isToday: -1, date: -1 } // 오늘 날짜가 우선, 그 다음 최근 날짜
                },
                {
                    $limit: 1 // 하나의 문서만 선택
                },
                {
                    $lookup:
                    {
                        from: 'ExerciseData',
                        let: { routine: "$routine" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$exercise_name", "$$routine"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    exercise_name: 1,
                                    exercise_tool: 1
                                }
                            }
                        ],
                        as: 'exerciseInfo'
                    }
                }
            ]).toArray();

            if (userRoutine.length > 0) {
                const routineData = userRoutine[0];
                const combinedData = routineData.exerciseInfo.map((exercise, index) => ({
                    ...exercise,
                    count: routineData.routineCount[index],
                    weight: routineData.routineWeight[index],
                    set: routineData.routineSet[index],
                    completed: routineData.routineCompleted[index],
                }));

                res.render("exStart", {
                    data: combinedData,
                    date: routineData.date,
                    timer: routineData.timer
                });
            } else {
                res.status(404).json({ message: 'User not found or no exercises found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.render('login');
    }

});

// app.post('/exDone', function (req, res) {
//     const userId = req.session.user.user_id;
//     const today = new Date().toISOString().split('T')[0]; // 오늘의 날짜 (YYYY-MM-DD 형식)
//     db.collection('UserRoutine').updateOne(
//         { $match: { userId: userId, date: today } }, { $set: { todayComment: req.body.todayComment } })
// });

app.post('/exDone', function (req, res) {
    if(req.session.user){
        res.redirect('/diary')
    }
    else{
        res.render("login");
    }
});

//마이페이지
app.get("/mypage", function(req, res){
    db.collection("UserInfo")
        .findOne({user_id : req.session.user.user_id})
        .then(result=>{
            console.log(result);
            res.render("mypage", {data : result});
        });
});

app.post('/updateComment', function (req, res) {
    const userId = req.session.user.user_id;
    const { date, todayComment } = req.body;

    db.collection('UserRoutine').updateOne(
        { userId: userId, date: date },
        { $set: { todayComment: todayComment } },
        function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to update comment' });
            }
            res.json({ message: 'Comment updated successfully' });
        }
    );
});