// Función para pausar el juego y mostrar el menú
function pauseGame() {
    document.getElementById('pauseMenu').classList.remove('hidden');
    // Lógica para pausar el juego
  }
  
  // Función para reanudar el juego
  function resumeGame() {
    document.getElementById('pauseMenu').classList.add('hidden');
    // Lógica para reanudar el juego
  }
  
  // Función para abrir configuración
  function openSettings() {
    alert("Configuración no implementada aún.");
    // Aquí puedes abrir una ventana de configuración
  }
  
  // Función para abrir ayuda
  function openHelp() {
    alert("Ayuda no implementada aún.");
    // Aquí puedes mostrar un menú de ayuda o una guía
  }
  
  // Función para salir del juego
  function exitGame() {
    const confirmation = confirm("¿Seguro que quieres salir?");
    if (confirmation) {
      // Lógica para salir del juego
      window.close(); // En navegadores puede no funcionar
    }
  }
  