let countdownInterval;

document.addEventListener("DOMContentLoaded", function () {
    const checkBoxes = document.querySelectorAll(".check-box");
    const completeBoxes = document.querySelectorAll(".check-box-complete");

    const RestTimerOn = document.querySelector(".rest-box");
    const RestTimerIng = document.querySelector(".rest-box.ing");

    RestTimerIng.style.display = "none";

    // 모든 check-box에 이벤트 리스너 추가
    checkBoxes.forEach((checkBox, index) => {
        const completeBox = completeBoxes[index];

        // 초기 상태 설정
        completeBox.style.display = "none";

        checkBox.addEventListener("click", () => {
            checkBox.style.display = "none";
            completeBox.style.display = "block";

            // 휴식타이머 실행
            startRestTimer();
            showRestTimerIng();

            // 운동 타이머가 작동 중이 아니라면 운동 타이머 시작
            if (int === null) {
                startExerciseTimer();
            }
        });

        // 각 완료 박스에 이벤트 리스너 추가
        completeBox.addEventListener("click", () => {
            completeBox.style.display = "none";
            checkBox.style.display = "block";

            // 휴식타이머 초기화
            showRestTimerOn();
            stopAndResetRestTimer();
        });
    });

    function showRestTimerIng() {
        RestTimerOn.style.display = "none";
        RestTimerIng.style.display = "block";
    }

    function showRestTimerOn() {
        RestTimerIng.style.display = "none";
        RestTimerOn.style.display = "block";
    }

    // 휴식타이머 카운트다운
    function startRestTimer() {
        // 기존 타이머가 있으면 초기화
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // 휴식 타이머 시간 설정 (분:초)
        let restTime = 90; // 1분 30초

        // 휴식 타이머 표시할 요소 선택
        const restTimerDisplay = document.querySelector('.rest-timer');

        // 카운트다운 함수 실행
        countdownInterval = setInterval(() => {
            // 남은 시간 계산
            const minutes = Math.floor(restTime / 60);
            const seconds = restTime % 60;

            // 표시 형식 조정 (0 붙여서 두 자리로 만들기)
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

            // 휴식 타이머 표시 업데이트
            restTimerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;

            // 시간이 다 되면 타이머 중지
            if (restTime <= 0) {
                clearInterval(countdownInterval);
                showRestTimerOn();
                // 휴식 타이머가 종료되었을 때 할 작업 추가
            } else {
                // 1초 감소
                restTime--;
            }
        }, 1000); // 1초마다 업데이트
    }

    function stopAndResetRestTimer() {
        clearInterval(countdownInterval);
        // 휴식 타이머 화면 초기화
        const restTimerDisplay = document.querySelector('.rest-timer');
        restTimerDisplay.textContent = "01:30"; // 초기값으로 설정
    }
});

// 운동타이머

// 타이머의 초기값 설정
let [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];

// 타이머 디스플레이 요소 선택
let timeRef = document.querySelector(".timer-display");

// 타이머 간격을 저장할 변수
let int = null;

// "시작" 버튼에 클릭 이벤트 리스너를 추가
document.getElementById("start-timer").addEventListener("click", () => {
    // 이미 타이머가 작동 중이면 기존 간격 삭제
    if (int !== null) {
        clearInterval(int);
    }
    // 10밀리초마다 displayTimer 함수 실행
    int = setInterval(displayTimer, 10);
});

// "일시정지" 버튼에 클릭 이벤트 리스너를 추가
document.getElementById("pause-timer").addEventListener("click", () => {
    // 타이머 간격 삭제
    clearInterval(int);
});

// "리셋" 버튼에 클릭 이벤트 리스너 추가
document.getElementById("reset-timer").addEventListener("click", () => {
    // 타이머 간격 삭제
    clearInterval(int);
    // 타이머 값 초기화
    [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
    // 디스플레이를 초기화된 값으로 업데이트
    timeRef.innerHTML = "00 : 00 : 00";
});

// 타이머 값을 증가시키고 화면에 업데이트하는 함수
function displayTimer() {
    // 밀리초를 10 증가
    milliseconds += 10;
    // 밀리초가 1000이 되면 1초를 증가시키고 밀리초를 0으로 초기화
    if (milliseconds == 1000) {
        milliseconds = 0;
        seconds++;
        // 초가 60이 되면 1분을 증가시키고 초를 0으로 초기화
        if (seconds == 60) {
            seconds = 0;
            minutes++;
            // 분이 60이 되면 1시간을 증가시키고 분을 0으로 초기화
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }
        }
    }

    // 각 시간 단위를 두 자리 형식으로 변환
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ns = milliseconds < 10
        ? "00" + milliseconds
        : milliseconds < 100
            ? "0" + milliseconds
            : milliseconds;

    // 디스플레이 업데이트
    timeRef.innerHTML = `${h} : ${m} : ${s}`;
}

// 모든 check-box에 대해 이벤트 리스너 추가 (운동 타이머 시작)
document.querySelectorAll(".check-box").forEach((checkBox) => {
    checkBox.addEventListener("click", () => {
        // 운동 타이머가 중지된 상태에서만 시작
        if (int === null) {
            int = setInterval(displayTimer, 10);
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    
    // 팝업창
    const overlay = document.querySelector("#overlay");
    const changeEmotion = document.querySelector("#change_emotion");
    const popup = document.querySelector("#popup");
    const close = document.querySelector("#closePopup");
    const happy = document.querySelector('#happy');
    const sad = document.querySelector('#sad');
    const calm = document.querySelector('#calm');
    const depressed = document.querySelector('#depressed');
    const bad = document.querySelector('#bad');
    const emotion = document.querySelector('#emotion');


    const exerciseComplete = document.querySelector('.complete-box')


    // 팝업창 등장!
    overlay.style.display = "none";
    popup.style.display = "none";

    exerciseComplete.addEventListener("click", function () {
        overlay.style.display = "block";
        popup.style.display = "block";
    });

    // changeEmotion.addEventListener("click", function () {
    //     overlay.style.display = "block";
    //     popup.style.display = "block";
    // });

    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });

    close.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
    });



    // 팝업창에서 감정 변경하기
    happy.addEventListener("click", function () {
        emotion.src = happy.src;
    });
    sad.addEventListener("click", function () {
        emotion.src = sad.src;
    });
    calm.addEventListener("click", function () {
        emotion.src = calm.src;
    });
    depressed.addEventListener("click", function () {
        emotion.src = depressed.src;
    });
    bad.addEventListener("click", function () {
        emotion.src = bad.src;
    });

});