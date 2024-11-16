// Inicialización de WebGL en el canvas
const canvas = document.getElementById("gameCanvas");
// const gl = canvas.getContext("webgl");

//  if (!gl) {
//    alert("WebGL no es compatible en tu navegador.");
//  } else {
//    // Configuración básica del color de fondo
//    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Negro
//    gl.clear(gl.COLOR_BUFFER_BIT);
//  }
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
let gameMode = params.get('gameMode') || 'Fail';


let score = 0;
let time = 0;
let isPaused = false;
let gameInterval;

let suma = 1;
if (gameMode == 1) {
    suma = -1;
    time = 100;
}


function updateUI() {
    if (!isPaused) {
        time += suma;
        //score += 10; // Incrementar puntaje
        document.getElementById('time').textContent = time;
        // document.getElementById('score').textContent = score;
    }
}

gameInterval = setInterval(updateUI, 1000);

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseMenu').classList.add('active');
    // document.getElementById('pauseMenu').style.display = 'block';
    document.getElementById('gameCanvas').style.filter = 'blur(5px)';
    clearInterval(gameInterval); // Detener el juego
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').classList.remove('active');
    //  document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameCanvas').style.filter = 'none';
    gameInterval = setInterval(updateUI, 1000);
}

function openSettings() {
    alert("Configuración no implementada aún.");
}

function openHelp() {
    alert("Ayuda no implementada aún.");
}

function exitGame() {
    const confirmation = confirm("¿Seguro que quieres salir?");
    if (confirmation) {
        window.close();
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'p' || event.key === 'P') {
        pauseGame();
    }
});