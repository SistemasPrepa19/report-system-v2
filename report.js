document.addEventListener("DOMContentLoaded", () => {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlfI2_88uBiVfDXFbKpznBPiE7Vj3nmnQf0bnvFG8PW1V_gK_A9BtQMO8W8cs198Gxo6xRcmZOUmr6/pub?output=csv&t=" + new Date().getTime();

  fetch(url)
    .then(res => res.text())
    .then(csv => {
      const lines = csv.trim().split("\n").map(line => line.split(","));

      const headers = lines[2]; // Fila 3 (índice 2)
      const rows = lines.slice(3); // Desde fila 4 en adelante

      const iNombre    = headers.indexOf("NOMBRE");
      const iEdificio  = headers.indexOf("EDIFICIO");
      const iAula      = headers.indexOf("AULA / LAB");
      const iMaquina   = headers.indexOf("MAQUINA");
      const iProblema  = headers.indexOf("PROBLEMA");
      const iSolucion  = headers.indexOf("SOLUCIÓN");

      const tbody = document.getElementById("reportBody");
      tbody.innerHTML = "";

      rows.forEach(row => {
        if (!row[iSolucion] || row[iSolucion].trim() === "") {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row[iNombre] || ""}</td>
            <td>${row[iEdificio] || ""}</td>
            <td>${row[iAula] || ""}</td>
            <td>${row[iMaquina] || ""}</td>
            <td>${row[iProblema] || ""}</td>
          `;
          tbody.appendChild(tr);
        }
      });
    })
    .catch(err => {
      console.error("Error al cargar los datos:", err);
      document.getElementById("reportBody").innerHTML = `<tr><td colspan="5">Error al cargar datos.</td></tr>`;
    });
});
