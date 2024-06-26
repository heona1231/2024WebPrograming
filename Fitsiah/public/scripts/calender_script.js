document.addEventListener('DOMContentLoaded', function(){
    const daysTag = document.querySelector(".days"); // 이번 달의 날짜를 가리키는 요소
    const currentDate = document.querySelector(".current-date"); // 현재 날짜를 가리키는 요소
    const prevNextIcon = document.querySelectorAll(".first_box .icons span"); // first_box 버튼 요소들
    const nextIcon = document.querySelector(".d-first .icons #next"); // 다음 아이콘 요소 선택
    const prevIcon = document.querySelector(".d-second .icons #prev"); // 이전 아이콘 요소 선택
    const daily_exercise = document.querySelector(".third_box .icons #next");
    const daily_calorie = document.querySelector(".fourth_box .icons #next");
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


    let date = new Date(); // 현재 날짜와 시간을 나타내는 Date 객체를 생성하여 할당
    let currYear = date.getFullYear(); // 현재 연도를 할당
    let currMonth = date.getMonth(); // 현재 월을 할당

    // 모든 월의 전체 이름을 months 배열에 저장
    const months = ["January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"];

    // 달력 생성
    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(); // 이번 달의 첫 번째 날
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); // 이번 달의 마지막 날
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); // 이번 달의 마지막 날
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // 지난 달의 마지막 날
        let liTag = ""; // 일자들을 저장할 문자열

        for (let i = firstDayofMonth; i > 0; i--) { // 지난 달의 마지막 줄을 이번 달 달력에 생성
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateofMonth; i++) { // 이번 달의 모든 날을 생성합
            // 현재 날짜, 월, 연도가 일치하는 경우 li에 활성 클래스를 추가합
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) { // 다음 달의 처음 몇 날을 생성
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`; // 현재 월과 연도를 currentDate 텍스트로 전달
        daysTag.innerHTML = liTag;
    }
    renderCalendar();

    prevNextIcon.forEach(icon => { // 이전, 다음 아이콘
        icon.addEventListener("click", () => { // 각 아이콘에 클릭 이벤트를 추가
            // 클릭된 아이콘이 이전 아이콘이면 현재 월을 1 감소시키고, 그렇지 않으면 1 증가시킴
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) { // 현재 월이 0보다 작거나 11보다 크면
                // 현재 연도 및 월의 새로운 날짜를 생성하고 날짜 값을 전달
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear(); // 현재 연도를 새로운 날짜의 연도로 업데이트
                currMonth = date.getMonth(); // 현재 월을 새로운 날짜의 월로 업데이트
            } else {
                date = new Date(); // 현재 날짜를 날짜 값으로 전달
            }
            renderCalendar(); // renderCalendar 함수를 호출
        });
    });

    // 날짜 요소에 클릭 이벤트 추가
    daysTag.addEventListener("click", (event) => { // daysTag에 클릭 이벤트 추가
        if (event.target && event.target.nodeName === "LI") { // 클릭된 요소가 LI 요소인 경우에만 실행
            const clickedDate = event.target.innerText; // 클릭된 날짜를 가져옴
            alert(`You clicked on ${months[currMonth]} ${clickedDate}, ${currYear}`); // 클릭된 날짜를 포함한 알림 표시
        }
    });

    // 다이어리칸 전환
    const secondBox = document.querySelector(".d-first"); // second_box 요소 선택
    const nextBox = document.querySelector(".d-second"); // next_box 요소 선택
    nextBox.style.display = "none"; // 처음에 next_box를 숨김

    nextIcon.addEventListener("click", () => { // 다음 아이콘에 클릭 이벤트 추가
        secondBox.style.display = "none"; // second_box를 숨김
        nextBox.style.display = "block"; // next_box를 보이도록 설정
    });

    prevIcon.addEventListener("click", () => { // 이전 아이콘에 클릭 이벤트 추가
        nextBox.style.display = "none"; // next_box를 숨김
        secondBox.style.display = "block"; // second_box를 보이도록 설정
    });

    // third_box 오늘의 날짜 표시
    const currentDateElements = document.querySelectorAll(".third_box .current-date");
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    
    currentDateElements.forEach(element => {
        element.textContent = formattedDate;
    });

    // 나의 운동 요약 화살표에 클릭 이벤트 추가
    daily_exercise.addEventListener("click", () => {
        alert('개봉박두');
    });

    // 나의 소모 칼로리 화살표에 클릭 이벤트 추가
    daily_calorie.addEventListener("click", () => {
        alert('개봉박두');
    });

    // 팝업창 등장!
    overlay.style.display = "none";
    popup.style.display = "none";

    changeEmotion.addEventListener("click", function(){
        overlay.style.display = "block";
        popup.style.display = "block";
    });

    overlay.addEventListener("click", function(){
        overlay.style.display = "none";
        popup.style.display = "none";
    });

    close.addEventListener("click", function(){
        overlay.style.display = "none";
        popup.style.display = "none";
    });

    // 팝업창에서 감정 변경하기
    happy.addEventListener("click", function(){ 
        emotion.src = happy.src;
    });
    sad.addEventListener("click", function(){
        emotion.src = sad.src;
    });
    calm.addEventListener("click", function(){
        emotion.src = calm.src; 
    });
    depressed.addEventListener("click", function(){
        emotion.src = depressed.src;
    });
    bad.addEventListener("click", function(){
        emotion.src = bad.src;
    });
});
