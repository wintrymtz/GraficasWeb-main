
const modeTitle = document.getElementById('modeTitle');
const TableButton = document.getElementById('switchTable');

const tableHistory = document.getElementById('tableHistory');
const tableClock = document.getElementById('tableClock');

TableButton.addEventListener('click', () => {
    if (tableHistory.style.display === 'none') {
        tableHistory.style.display = 'block';
        tableClock.style.display = 'none';

        TableButton.textContent = 'Modo Contrarreloj';
        modeTitle.textContent = 'Modo Historia';
    } else {
        tableHistory.style.display = 'none';
        tableClock.style.display = 'block';

        TableButton.textContent = 'Modo Historia';
        modeTitle.textContent = 'Modo Contrarreloj';
    }
});


class StoryMode {
    constructor(Posicion, Jugador, Puntuacion) {
        this.Posicion = Posicion;
        this.Jugador = Jugador;
        this.Puntuacion = Puntuacion;
    }

    get descripcion() {
        let row = document.createElement("tr");
        row.innerHTML = `    
          <tr>
              <td>${this.Posicion}</td>
              <td>${this.Jugador}</td>
              <td>${this.Puntuacion}</td>
          </tr>   
      `;
        return row;
    }
}

let tableBody = document.getElementById("player-points");
let playerdataSM = [];

class TimeTrial {
    constructor(Posicion, Jugador, Tiempo) {
        this.Posicion = Posicion;
        this.Jugador = Jugador;
        this.Tiempo = Tiempo;
    }

    get descripcion() {
        let row = document.createElement("tr");
        row.innerHTML = `    
            <tr>
                <td>${this.Posicion}</td>
                <td>${this.Jugador}</td>
                <td>${this.Tiempo}</td>
            </tr>   
        `;
        return row;
    }
}

let tableBodyTT = document.getElementById("player-time"); // Cuerpo de la tabla para contrarreloj
let playerdataTT = []; // Datos del modo contrarreloj

function listarJugadoresTT() {
    tableBodyTT.innerHTML = "";
    // console.log(playerdataTT);
    playerdataTT.forEach((playerdata) => {
        tableBodyTT.appendChild(playerdata.descripcion);
    });
}


function listarJugadores() {
    tableBody.innerHTML = "";
    playerdataSM.forEach((playerdata) => {
        tableBody.appendChild(playerdata.descripcion);
    });
}

async function obtenerDB() {
    try {
        let response = await fetch("http://localhost/gcw/conection.php");
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        let responseJSON = await response.json();
        console.log(responseJSON)

        // Procesar datos del modo historia
        if (responseJSON.storyMode && Array.isArray(responseJSON.storyMode)) {
            responseJSON.storyMode.forEach((p) => {
                let newPlayerData = new StoryMode(p.Posicion, p.Jugador, p.Puntuacion);
                playerdataSM.push(newPlayerData);
            });
            listarJugadores(); // Listar jugadores en la tabla de historia
        }

        // Procesar datos del modo contrarreloj
        if (responseJSON.timeTrial && Array.isArray(responseJSON.timeTrial)) {
            responseJSON.timeTrial.forEach((p) => {
                let newPlayerData = new TimeTrial(p.Posicion, p.Jugador, p.Tiempo);
                playerdataTT.push(newPlayerData);
            });
            listarJugadoresTT(); // Listar jugadores en la tabla de contrarreloj
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}




obtenerDB();

