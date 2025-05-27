const form = document.getElementById("formulario");
    const estado = document.getElementById("estado");

    form.addEventListener("submit", e => {
      e.preventDefault();
      fetch("https://script.google.com/macros/s/AKfycbwphYi6FTmMHTN4dDcru0R1YeI8L40EKRfqzul0asX37XOtzjLag5CgX0GfRe0M7VU2xQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(form))
      }).then(() => {
        estado.textContent = "Formulario enviado correctamente.";
        alert("Formulario enviado correctamente!");
        form.reset();
      }).catch(err => {
        estado.textContent = "Hubo un error al enviar.";
        alert("Hubo un error al enviar!");
        console.error(err);
      });
    });