document.addEventListener("DOMContentLoaded", () => {

    const backButton = document.getElementById("back");

    backButton.addEventListener("click", () => {
        window.location.href = "mainMenu2.html";
    });

    const loginButton = document.getElementById("loginButton");
    const cancelButton = document.getElementById("cancelButton");
    const commentButton = document.getElementById("commentButton");
    const usernameInput = document.getElementById("username");
    
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    const commentModal = new bootstrap.Modal(document.getElementById("commentModal"));
    
    const loginModalButton = document.getElementById("loginModalButton");
    const registerModalButton = document.getElementById("registerModalButton");
    const modalUsername = document.getElementById("modalUsername");
    const modalPassword = document.getElementById("modalPassword");
    const submitCommentButton = document.getElementById("submitCommentButton");

    // Abrir modal de login al hacer clic en Acceder
    loginButton.addEventListener("click", () => {
        loginModal.show();
    });

    // Acciones de Login
    loginModalButton.addEventListener("click", () => {
        const username = modalUsername.value.trim();
        const password = modalPassword.value.trim();
        
        if (username && password) {
            usernameInput.value = username;
            commentButton.disabled = false;
            loginModal.hide();
        }
    });

    // Acciones de Registro
    registerModalButton.addEventListener("click", () => {
        const username = modalUsername.value.trim();
        const password = modalPassword.value.trim();
        
        if (username && password) {
            usernameInput.value = username;
            commentButton.disabled = false;
            loginModal.hide();
        }
    });

    // Limpiar el input de Usuario y deshabilitar Comentar
    cancelButton.addEventListener("click", () => {
        usernameInput.value = "";
        commentButton.disabled = true;
    });

    // Abrir modal para comentar
    commentButton.addEventListener("click", () => {
        commentModal.show();
    });

    // Acción para enviar comentario
    submitCommentButton.addEventListener("click", () => {
        const comment = document.getElementById("commentText").value.trim();
        
        if (comment) {
            alert(`Comentario enviado: ${comment}`);
            commentModal.hide();
        }
    });
});
