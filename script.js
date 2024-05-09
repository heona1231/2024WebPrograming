const daysTag = document.querySelector(".days"),    // 이번 달의 날짜를 가리키는 요소
currentDate = document.querySelector(".current-date"),  // 현재 날짜를 가리키는 요소
prevNextIcon = document.querySelectorAll(".icons span");    // 버튼 요소들

// 새로운 날짜, 현재 연도 및 월을 가져옵니다
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// 모든 월의 전체 이름을 배열에 저장합니다
const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월",
              "8월", "9월", "10월", "11월", "12월"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // 이번 달의 첫 번째 날을 가져옵니다
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // 이번 달의 마지막 날을 가져옵니다
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // 이번 달의 마지막 요일을 가져옵니다
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // 지난 달의 마지막 날을 가져옵니다
    let liTag = ""; // 일자들을 저장할 문자열

    for (let i = firstDayofMonth; i > 0; i--) { // 이전 달의 마지막 몇 날을 생성합니다
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // 이번 달의 모든 날을 생성합니다
        // 현재 날짜, 월, 연도가 일치하는 경우 li에 활성 클래스를 추가합니다
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // 다음 달의 처음 몇 날을 생성합니다
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // 현재 월과 연도를 currentDate 텍스트로 전달합니다
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // 이전 및 다음 아이콘들을 가져옵니다
    icon.addEventListener("click", () => { // 각 아이콘에 클릭 이벤트를 추가합니다
        // 클릭된 아이콘이 이전 아이콘이면 현재 월을 1 감소시키고, 그렇지 않으면 1 증가시킵니다
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // 현재 월이 0보다 작거나 11보다 크면
            // 현재 연도 및 월의 새로운 날짜를 생성하고 날짜 값을 전달합니다
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // 현재 연도를 새로운 날짜의 연도로 업데이트합니다
            currMonth = date.getMonth(); // 현재 월을 새로운 날짜의 월로 업데이트합니다
        } else {
            date = new Date(); // 현재 날짜를 날짜 값으로 전달합니다
        }
        renderCalendar(); // renderCalendar 함수를 호출합니다
    });
});


