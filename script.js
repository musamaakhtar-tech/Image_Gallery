var fullImgBox = document.getElementById("fullImgBox");
var fullImg = document.getElementById("fullImg");

function openFullImg(pic) {
    fullImgBox.style.display = "flex";
    fullImg.src = pic;
}

function closeFullImg() {
    fullImgBox.style.display = "none";
}

let scroll = document.querySelector(".gallery");
let backBtn = document.getElementById("backBtn");
let nextBtn = document.getElementById("nextBtn");

scroll.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scroll.scrollLeft += evt.deltaY;
});

nextBtn.addEventListener("click", () => {
    scroll.scrollLeft += 900;
});

backBtn.addEventListener("click", () => {
    scroll.scrollLeft -= 900;
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        nextBtn.click();
    } else if (event.key === "ArrowLeft") {
        backBtn.click();
    } else if (event.key === "Escape") {
        closeFullImg();
    }
});

var toggleButton = document.getElementById("toggle-theme");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleButton.innerText = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
});