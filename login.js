function logIn() {
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;

    // Guardar el nombre en localStorage
    localStorage.setItem("username", name);

    if (name === "") {
        alert("Por favor, ingresa tu nombre.");
        return;
    }  else if (name === "Soporte" && password === "Etropos") {
        //alert("¡Bienvenido, administrador!");
        window.location.href = "formularioAdmin.html";
    }  else {
        window.location.href = "formularioUsuario.html";
    }
}