// Configura el SDK de Facebook
window.fbAsyncInit = function () {
  FB.init({
    appId: "477877822082913",
    xfbml: true,
    version: "v20.0",
  });

  window.fbReady = true;
};

// Función para abrir el cuadro de diálogo
function openFacebookPrompt() {
  if (!window.fbReady) {
    console.error("El SDK de Facebook no está listo todavía.");
    return;
  }

  const message = prompt("¡Felicidades por ganar! Ingresa un mensaje para publicar en nuestra página de Facebook:");

  if (message && message.trim() !== "") {
    postToFacebook(message);
  } else {
    alert("No se ingresó ningún mensaje.");
  }
}

// Definimos lo que quwe queremos hacer y el token
function postToFacebook(message) {
  FB.api(
    "477877822082913/feed",
    "POST",
    {
      message: message,
      access_token: "EAAYtixdsAB0BOzQ5pVEZCUN7wMCDBNvgbPpn6ZC8GZBiERbwYJuAv9ATK1387ZAyT7zjX8ETHq8fRZBMKfYZCamXS0uExA5ZBWK8IaOKgsWFDgJtBPjx1hBBdglHWZADss0ZBEPLwx7xTSCZBqh6lFVxa4qQaPq5G9d1bWd8rjNpZAyHO79UxJOnaAWjEQLLPXGLBDt2qUoF8ZA3coZCUqe4UQGs1gneu",
    },
    function (response) {
      if (response && !response.error) {
        console.log("Publicación realizada con éxito:", response);
      } else {
        console.log("Error al realizar la publicación.");
      }
    }
  );
}
