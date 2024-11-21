
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
    constructor(Posicion, Jugador, Puntuaciom) {
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
  
  let tableBody = document.getElementById("tableHistory");
  let playerdataSM = [];
  
//   formProducto.addEventListener("submit", (event) => {
//     event.preventDefault();
//     let inputPosition = document.getElementById("Posicion").value;
//     let inputPlayer = document.getElementById("Jugador").value;
//     let inputPoints = document.getElementById("Puntuacion").value;
  
//     let newPlayerData = new PlayerData(inputPosition, inputPlayer, inputPoints);
//     playerdataSM.push(newPlayerData);
  
//     SavePlayerData(newPlayerData);
//   //  formProducto.reset();
//     listarJugadores();
  
//     //console.table(productos);
//   });
  
  function listarJugadores() {
    tableBody.innerHTML = "";
    playerdataSM.forEach((playerdata) => {
      tableBody.appendChild(playerdata.descripcion);
    });
  }
    
  async function obtenerProductosDB() {
    let response = await fetch(
      "http://localhost/gcw/conection.php"
    );
    // let responseText = await response.text();
    let responseJSON = await response.json();
    responseJSON.forEach((p) => {
      let newPlayerData = new Producto(p.Posicion, p.Jugador, p.Puntuaciom);
      playerdataSM.push(newPlayerData);
    });
    listarJugadores();
  }
  
 
  
  obtenerProductosDB();
  
