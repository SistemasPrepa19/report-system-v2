const form = document.getElementById("formulario");
const modal = document.getElementById("successModal");
const submitBtn = form.querySelector('button[type="submit"]'); // Selecciona el botón de enviar

form.addEventListener("submit", e => {
  e.preventDefault();

  // Inhabilita el botón al hacer clic
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  fetch("https://script.google.com/macros/s/AKfycbzdR4Ybm_nALdiFfu_AAm83VftUJwbLRP5hwtFLFiCRnEu9hVeo0oWH3dQAvIulzZOBBg/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(new FormData(form))
  })
  .then(() => {
    modal.style.display = "flex";

    setTimeout(() => {
      modal.style.display = "none";
      window.location.href = "index.html";
    }, 3000);
  })
  .catch(err => {
    console.error(err);
    alert("Hubo un error al enviar!");

    // Rehabilita el botón si hay un error
    submitBtn.disabled = false;
    submitBtn.textContent = "Reportar";
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
const formAdminDesk = document.querySelector(".form-admin");
const reportList = document.getElementById("report-list");

toggleBtn.addEventListener("click", () => {
  if (formAdmin.style.display === "none" || formAdmin.style.display === "" || formAdminDesk.style.display === "none" || formAdminDesk.style.display === "") {
    formAdmin.style.display = "block";
    formAdminDesk.style.display = "block";
    reportList.style.display = "none"; 
    toggleBtn.textContent = "Cerrar"; 
  } else {
    formAdmin.style.display = "none";
    formAdminDesk.style.display = "none";
    reportList.style.display = "block";
    toggleBtn.textContent = "Nuevo reporte";
  }
});

const logOutBtn = document.getElementById("logOut");
logOutBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
