const configButton = document.getElementById('configButton');
const playButton = document.getElementById('playButton');
const scoreButton = document.getElementById('scoreButton');

const mainImage = document.getElementById('mainImage');

configButton.addEventListener('click', () => {
    window.location.href = 'configuration.html';
})

playButton.addEventListener('click', () => {
    window.location.href = 'nivel.html';
})

scoreButton.addEventListener('click', () => {
    window.location.href = 'puntuaciones.html';
})

function createMenu() {

}
