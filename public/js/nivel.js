let modoActual = true;
let selectedLevel = 1;

const modo = document.getElementById("gameMode");
const leftTor = document.getElementById("leftTor");
const rightTor = document.getElementById("rightTor");
const descripcion = document.getElementById("descripcion");
const portadas = document.querySelectorAll(".level-image");
const jugar = document.getElementById("jugar");
const menu = document.getElementById("menuPrincipal");

const DescripcionNivewl = {
    1: "NIVEL 1. Colina de la polvora",
    2: "NIVEL 2. Islas petroleras",
    3: "NIVEL 3. Basurero de Aceite"
};


leftTor.addEventListener("click", () => changeMode());
rightTor.addEventListener("click", () => changeMode());

function changeMode() {

    if (modoActual === true) {
        modo.textContent = `Modo Contrarreloj`;
        modoActual = false;
    }
    else {
        modo.textContent = `Modo Historia`;
        modoActual = true;
    }

}


portadas.forEach((img, index) => {
    img.addEventListener("click", () => selectLevel(index + 1));
});

function selectLevel(level) {
    selectedLevel = level;

    portadas.forEach((img, index) => {

        if (index + 1 === selectedLevel) {
            img.classList.add("selected");
        }
        else {
            img.classList.remove("selected");
        }
    });


    descripcion.textContent = DescripcionNivewl[selectedLevel];
}


jugar.addEventListener("click", () => {
    window.location.href = "game.html";
});

menu.addEventListener("click", () => {
    window.location.href = "mainMenu2.html";
});
