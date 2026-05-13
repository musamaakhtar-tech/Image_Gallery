const fullImgBox = document.getElementById("fullImgBox");
const fullImg = document.getElementById("fullImg");
const galleryItems = document.querySelectorAll(".gallery-item");

let currentIndex = 0;
const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector("img").src,
    caption: item.querySelector(".overlay").textContent
}));

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openFullImg(index));
});

function openFullImg(index) {
    currentIndex = index;
    fullImg.src = images[currentIndex].src;
    fullImgBox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeFullImg() {
    fullImgBox.classList.remove("active");
    document.body.style.overflow = "auto";
}

function navigateImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    fullImg.src = images[currentIndex].src;
    fullImg.style.animation = "scaleIn 0.3s ease";
    setTimeout(() => fullImg.style.animation = "", 300);
}

fullImgBox.addEventListener("click", (e) => {
    if (e.target === fullImgBox) {
        closeFullImg();
    }
});

document.addEventListener("keydown", (event) => {
    if (!fullImgBox.classList.contains("active")) return;

    if (event.key === "ArrowRight") {
        navigateImage(1);
    } else if (event.key === "ArrowLeft") {
        navigateImage(-1);
    } else if (event.key === "Escape") {
        closeFullImg();
    }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

const toggleButton = document.getElementById("toggle-theme");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleButton.innerText = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
});