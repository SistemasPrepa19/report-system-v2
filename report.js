document.addEventListener("DOMContentLoaded", () => {
  const sheetBaseUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlfI2_88uBiVfDXFbKpznBPiE7Vj3nmnQf0bnvFG8PW1V_gK_A9BtQMO8W8cs198Gxo6xRcmZOUmr6/pub?output=csv";
  const tbody     = document.getElementById("reportBody");
  const modal     = document.getElementById("solveModal");
  const ta        = document.getElementById("solveText");
  const btnSend   = document.getElementById("solveSend");
  const btnCancel = document.getElementById("solveCancel");
  let currentRow;

  // Función que carga y dibuja la tabla
  function loadReports() {
    const url = sheetBaseUrl + "&t=" + Date.now(); // evita caché
    fetch(url)
      .then(res => res.text())
      .then(csv => {
        const lines = csv
          .trim()
          .split("\n")
          .map(l => l.split(",").map(c => c.replace(/^"|"$/g, "").trim()));

        // Buscamos dinámicamente la fila de encabezados
        const headerIdx = lines.findIndex(row =>
          row.map(c => c.toUpperCase()).includes("NOMBRE")
        );
        if (headerIdx === -1) {
          console.error("No se encontró la fila de encabezados con 'NOMBRE'");
          return;
        }

        const headers = lines[headerIdx];
        const rows    = lines.slice(headerIdx + 1);

        const idx = {
          name:      headers.indexOf("NOMBRE"),
          building:  headers.indexOf("EDIFICIO"),
          classroom: headers.indexOf("AULA / LAB"),
          machine:   headers.indexOf("MAQUINA"),
          issue:     headers.indexOf("PROBLEMA"),
          solution:  headers.indexOf("SOLUCIÓN")
        };
        if (idx.name < 0 || idx.solution < 0) {
          console.error("Tus encabezados no coinciden (NOMBRE o SOLUCIÓN).");
          return;
        }

        tbody.innerHTML = "";
        rows.forEach((r, i) => {
          const sol = (r[idx.solution] || "").trim();
          if (sol === "") {
            const sheetRow = headerIdx + 1 + i + 1;
            const tr = document.createElement("tr");
            tr.dataset.row = sheetRow;
            tr.innerHTML = `
              <td>${r[idx.name]      || ""}</td>
              <td>${r[idx.building]  || ""}</td>
              <td>${r[idx.classroom] || ""}</td>
              <td>${r[idx.machine]   || ""}</td>
              <td>${r[idx.issue]     || ""}</td>
            `;
            tbody.appendChild(tr);
          }
        });

        if (!tbody.children.length) {
          tbody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align:center">No hay reportes pendientes</td>
            </tr>`;
        }
      })
      .catch(err => {
        console.error("Error cargando CSV:", err);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar datos.</td></tr>`;
      });
  }

  // Inicial y luego cada 30s
  loadReports();
  setInterval(loadReports, 30_000);

  // ————— Lógica del modal —————

  tbody.addEventListener("click", e => {
    const tr = e.target.closest("tr");
    if (!tr || !tr.dataset.row) return;
    currentRow = tr.dataset.row;
    ta.value    = "";
    modal.style.display = "flex";
    ta.focus();
  });

  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnSend.addEventListener("click", () => {
    const solution = ta.value.trim();
    if (!solution) return alert("Escribe algo antes de guardar.");

    fetch("https://script.google.com/macros/s/AKfycbx8lXlsGUxKqLGfy1ochv60Uh0DpMwOA-_ESHznjWGHtSwAeyh4yOJlE2E5316x7i5cng/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ row: currentRow, solution })
    })
      .then(() => {
        modal.style.display = "none";
        // Recarga inmediata de la tabla
        loadReports();
      })
      .catch(err => {
        console.error("Error guardando la solución:", err);
        alert("Error al guardar la solución.");
      });
  });
});
