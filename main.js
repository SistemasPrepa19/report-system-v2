const form = document.getElementById("formulario");
const estado = document.getElementById("estado");

form.addEventListener("submit", e => {
  e.preventDefault();

  fetch("https://script.google.com/macros/s/AKfycbwShO6XelDw_pFqqeVEPHZFO_V9J0-U3jARwQO_aPNFsI-eDGyZfWzDsNfc58CO_6l7sw/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(new FormData(form))
  })
  .then(() => {
    estado.textContent = "Formulario enviado correctamente.";
    alert("Formulario enviado correctamente!");

    // Espera un momento antes de recargar (opcional)
    setTimeout(() => {
      location.reload(); // Recargar la página
    }, 500); // 0.5 segundos, puedes ajustar el tiempo
  })
  .catch(err => {
    estado.textContent = "Hubo un error al enviar.";
    alert("Hubo un error al enviar!");
    console.error(err);
  });
});
