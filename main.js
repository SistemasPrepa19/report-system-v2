const form = document.getElementById("formulario");
const modal = document.getElementById("successModal");

form.addEventListener("submit", e => {
  e.preventDefault();

  fetch("https://script.google.com/macros/s/AKfycby7HhGc49H6tQ_2OcuM0sk3zDOL1vGkgBsqSFultaQEJwiFZlV-Aq-VQOtrU1NioHi92g/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(new FormData(form))
  })
  .then(() => {
    // Mostrar el modal
    modal.style.display = "flex";

    setTimeout(() => {
      modal.style.display = "none";
      window.location.href = "index.html";
    }, 3000);
  })
  .catch(err => {
    console.error(err);
    alert("Hubo un error al enviar!");
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const storedName = localStorage.getItem("username");
  if (storedName) {
    document.getElementById("nombre-usuario").textContent = storedName;

    // Crear también un input hidden para enviar el nombre en el formulario
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "name";
    hiddenInput.value = storedName;
    document.getElementById("formulario").appendChild(hiddenInput);
  }
});




const toggleBtn = document.getElementById("btn-report");
const formAdmin = document.getElementById("formulario");

toggleBtn.addEventListener("click", () => {
  if (formAdmin.style.display === "none" || formAdmin.style.display === "") {
    formAdmin.style.display = "block";
    toggleBtn.textContent = "Cerrar formulario"; // Cambia a un símbolo de "menos"
  } else {
    formAdmin.style.display = "none";
    toggleBtn.textContent = "Nuevo reporte"; // Vuelve al símbolo de "más"
  }
});

const logOutBtn = document.getElementById("logOut");
logOutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});