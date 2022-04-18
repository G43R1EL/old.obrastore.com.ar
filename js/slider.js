function sliderNext () {
    let firstSlide = document.querySelectorAll(".slider__content")[0];
    console.log(firstSlide);
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s"
    setTimeout(function() {
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', firstSlide);
        slider.style.marginLeft = "-100%";
    }, 500);
}

function sliderPrevious () {
    let lastSlide = document.querySelectorAll(".slider__content")[slides.length-1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s"
    setTimeout(function() {
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', lastSlide);
        slider.style.marginLeft = "-100%";
    }, 500);
}

const slider = document.querySelector("#slider");
const sliderBtnPrev = document.querySelector(".slider__controls-previous");
const sliderBtnNext = document.querySelector(".slider__controls-next");
let slides = document.querySelectorAll(".slider__content");
let lastSlide = slides[slides.length - 1];

sliderBtnPrev.addEventListener('click', function() {
    sliderPrevious();
});

sliderBtnNext.addEventListener('click', function() {
    sliderNext();
});

slider.insertAdjacentElement('afterbegin', lastSlide);

setInterval(function() {
    sliderNext();
}, 5000);

