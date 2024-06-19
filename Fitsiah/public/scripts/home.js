const home4EventHandler = (section) => {
    const texts = section.querySelectorAll('.introduce_1');

    texts.forEach(text => {
        text.classList.add('appear');
    });
}

window.addEventListener("wheel", function(e) {
    e.preventDefault();
}, { passive: false });

var $html = $("html");
var page = 1;
var lastPage = $(".content").length;
$html.animate({ scrollTop: 0 }, 10);

const animateSection = (index) => {
    var posTop = $(".content").eq(index - 1).offset().top;
    $html.animate({ scrollTop: posTop }, 300, () => { // 애니메이션 시간을 300ms로 단축
        const currentSection = $(".content").eq(index - 1);
        home4EventHandler(currentSection[0]);
    });
}

$(window).on("wheel", function(e) {
    if ($html.is(":animated")) return;
    if (e.originalEvent.deltaY > 0) {
        if (page == lastPage) return;
        page++;
    } else if (e.originalEvent.deltaY < 0) {
        if (page == 1) return;
        page--;
    }
    animateSection(page);
});

document.addEventListener('DOMContentLoaded', () => {
    const currentSection = $(".content").eq(page - 1);
    home4EventHandler(currentSection[0]);

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            const targetIndex = targetId === 'move1' ? 2 : 5; // move1 -> sector2, move2 -> sector5
            page = targetIndex;
            animateSection(targetIndex);
        });
    });
});

// DOM 요소들을 가져옵니다
const hoverImage = document.querySelector('.hover-image');
const hoverContent = document.querySelector('.hover-content');
const hoverButton = document.querySelector('.hover-button');

// 이미지에 마우스가 진입했을 때 처리할 이벤트 리스너 추가
hoverImage.addEventListener('mouseenter', function() {
    hoverContent.classList.add('visible');
    hoverButton.classList.add('visible');
});

// 이미지에서 마우스가 빠져나갔을 때 처리할 이벤트 리스너 추가
hoverImage.addEventListener('mouseleave', function() {
    hoverContent.classList.remove('visible');
    hoverButton.classList.remove('visible');
});

// 문구나 버튼에 마우스가 진입했을 때 처리할 이벤트 리스너 추가
hoverContent.addEventListener('mouseenter', function() {
    hoverContent.classList.add('visible');
    hoverButton.classList.add('visible');
});

// 문구나 버튼에서 마우스가 빠져나갔을 때 처리할 이벤트 리스너 추가
hoverContent.addEventListener('mouseleave', function() {
    hoverContent.classList.remove('visible');
    hoverButton.classList.remove('visible');
});

// 버튼에 마우스가 진입했을 때 처리할 이벤트 리스너 추가
hoverButton.addEventListener('mouseenter', function() {
    hoverContent.classList.add('visible');
    hoverButton.classList.add('visible');
});

// 버튼에서 마우스가 빠져나갔을 때 처리할 이벤트 리스너 추가
hoverButton.addEventListener('mouseleave', function() {
    hoverContent.classList.remove('visible');
    hoverButton.classList.remove('visible');
});
