let modoActual = 0;
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


leftTor.addEventListener("click", () => changeMode(-1));
rightTor.addEventListener("click", () => changeMode(1));

function changeMode(direction) {

    modoActual = (modoActual + direction + 3) % 3;

    switch (modoActual){

        case 0:
            modo.textContent = "Modo Historia";
            break;
        case 1:
            modo.textContent = "Modo Contrarreloj";
            break;
        case 2:
        modo.textContent = "Modo Multijugador";
        break;
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
    let game_;

    if (modoActual === 2) {
        game_ = `game.html`;
    }
    else {
        game_ = `nivel${selectedLevel}.html`;
    }


    //Esto se agregara en un futuro para definir modo de juego y nivel
    // if (modoActual === 0) { 
    //     game_ = `nivel${selectedLevel}_historia.html`;
    // } 
    // else if (modoActual === 1) { 
    //     game_ = `nivel${selectedLevel}_contrarreloj.html`;
    // } 
    // else if (modoActual === 2) { 
    //     game_ = `nivel${selectedLevel}_multijugador.html`;
    // }

    window.location.href = game_;

});

menu.addEventListener("click", () => {
    window.location.href = "mainMenu2.html";
});
