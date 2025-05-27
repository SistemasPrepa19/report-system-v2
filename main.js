const form = document.getElementById("formulario");
const modal = document.getElementById("successModal");

form.addEventListener("submit", e => {
  e.preventDefault();

  fetch("https://script.google.com/macros/s/AKfycbzNmjAiZWYZjaITJzuuAwWAjypkSJX8fsYeoEX08EVy2i4g6lQhON-T18HHX8f_76rTZA/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(new FormData(form))
  })
  .then(() => {
    // Mostrar el modal
    modal.style.display = "flex";

    // Cerrar automáticamente después de 2 segundos (2000 ms)
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

