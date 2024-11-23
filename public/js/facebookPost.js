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
      access_token: "EAAYtixdsAB0BO8SJS1jCJTTr0ERm5ZBIgcMPSlhl4QdleoBXPZBRMgzUb1ZBAdH01O7fLeBgzOZBuAjzXYTe4Jr380ZBpyXHWZBYaxIdxzOZAYj1UNMXQ1VG7RRJsPQr6GigE2WjeZBCZAlZB3z7NIxd9B1lXY4tltj6X6LTNdwIdOLGLgt8Tdh1axOgK8b8GBUvWBgsFZBGDq24ZAYGNTD0XmIkPEhZC",
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
