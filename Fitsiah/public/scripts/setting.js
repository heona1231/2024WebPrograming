document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("q3").classList.add("hidden");
    document.getElementById("q4").classList.add("hidden");
    document.getElementById("submitButton").classList.add("hidden");

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
    
    function third() {
        const settingForm = document.getElementById("settingForm");
        const userProficiency = document.querySelector('select[name="user_proficiency"]').value;
        const userPurpose = document.querySelector('select[name="user_purpose"]').value;
    
        // 각 select 요소의 값을 폼 필드에 설정
        settingForm.user_proficiency.value = userProficiency;
        settingForm.user_purpose.value = userPurpose;
    
        settingForm.submit(); // 폼 제출
    }
    
    nextButton.addEventListener("click", function() {
        if (count == 0) {
            first();
        } else if (count == 1) {
            second();
        } else if (count == 2) {
            third();
        }
    });
    
    settingImg.addEventListener("click", function() {
        if (count > 0) {
            const now_box = document.querySelector("#q" + (count + 1));
            const prev_box = document.querySelector("#q" + count);
    
            fadeOut(now_box, () => fadeIn(prev_box));
    
            count--;
        }
    });
    
    if (count == 2) {
        const nextButton = document.querySelector("#nextButton");
        const submitButton = document.querySelector("#submitButton");
    
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    }
});

function getselect1() {
    var proficiency = document.getElementById("user_proficiency").value;
    console.log("Selected proficiency: ", proficiency);
}

function getselect2() {
    var purpose = document.getElementById("user_purpose").value;
    console.log("Selected purpose: ", purpose);
}