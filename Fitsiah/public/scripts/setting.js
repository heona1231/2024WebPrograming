document.addEventListener("DOMContentLoaded", function() {  //HTML 요소들 중 addEventListener에서 function()의 작용을 함 -> 그 function이 아래 2~5번째 줄의 작업 //HTML의 ID 요소를 선택
    document.getElementById("q3").classList.add("hidden");
    document.getElementById("q4").classList.add("hidden");
    document.getElementById("submitButton").classList.add("hidden");
});

var count = 0;

const nextButton = document.getElementById("nextButton");
const settingImg = document.getElementById("settingImg");

function fadeOut(element, callback) {
    element.classList.add("fade-out");
    element.classList.remove("fade-in", "show");
    setTimeout(() => {
        element.classList.add("complete");
    }, 10); // small delay to ensure opacity transition starts

    setTimeout(() => {
        element.classList.add("hidden");
        element.classList.remove("fade-out", "complete");
        if (callback) {
            callback();
        }
    }, 1000);
}

function fadeIn(element) {
    element.classList.remove("hidden");
    element.classList.add("fade-in");
    setTimeout(() => {
        element.classList.add("show");
    }, 10); // small delay to trigger the transition
}

function first() {
    const now_box = document.querySelector("#q2");
    const next_box = document.querySelector("#q3");

    fadeOut(now_box, () => fadeIn(next_box));

    count++;
}

function second() {
    const now_box = document.querySelector("#q3");
    const next_box = document.querySelector("#q4");

    fadeOut(now_box, () => fadeIn(next_box));

    count++;
}

function goBack() {
    if (count > 0) {
        const now_box = document.querySelector("#q" + (count + 1));
        const prev_box = document.querySelector("#q" + count);

        fadeOut(now_box, () => fadeIn(prev_box));

        count--;
    }
}

nextButton.addEventListener("click", function() {
    if (count == 0) {
        first();
    } else if (count == 1) {
        second();
        const nextButton = document.querySelector("#nextButton");
        const submitButton = document.querySelector("#submitButton");

        nextButton.style.display = "none";
        submitButton.style.display = "block";
    }
});

settingImg.addEventListener("click", goBack);