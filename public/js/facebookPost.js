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
      access_token: "EAAYtixdsAB0BO1vgzHiShbVNrtv4GLQWgm0L8E6XS4frRFlMvnvCtNRJQ10SZBELZCZB3ZC0h65xSH7IKslPKAuHkZBsIhRAMJZCHIL9pGJc6GzZApkZAIKaTGPCLmTGoFY4qsdGZCLK6skGFelf87dDEco6uxXxe7M1JbIIQiHzvBEDM5zE4J5O5GLg9ELrppk0JvhX7yXPSnJcbUWTTDoO7LJZA6",
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
