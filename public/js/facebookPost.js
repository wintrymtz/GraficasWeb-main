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

  const message = prompt("¡Felicidades por ganar! Ingresa un mensaje para publicar en Facebook:");

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
      access_token: "EAAYtixdsAB0BO8PmSO8koILBOh4tYS43nHZC6AUoJvU51Ugec5VlHK9G5bZASJZB8lV8hp0wV4ZC5sG0CEJ2BG37ZAnjoEwqk1hzlNdckfa5qrpiVBZCZBucRi8HQxsjJYkAH27fAWxbKNUqZAag3xunAWGtF8nkiUK97T6ZAwPJsghEdveIZCV8dO6zgZC7JqgjzjZBJX9Pema0bZAIA83iCDovkCCuT",
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
