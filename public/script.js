// script.js
const images = [
    'images/bakery1.jpg',
    'images/bakery2.jpg',
    'images/bakery3.jpg',
    'images/bakery4.jpg'
];

let currentImageIndex = 0;

function changeBackground() {
    document.querySelector('.background').style.backgroundImage = `url(${images[currentImageIndex]})`;
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

setInterval(changeBackground, 5000);

document.addEventListener("DOMContentLoaded", () => {
    changeBackground();
});
