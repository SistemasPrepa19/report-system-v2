document.addEventListener("DOMContentLoaded", () => {
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlfI2_88uBiVfDXFbKpznBPiE7Vj3nmnQf0bnvFG8PW1V_gK_A9BtQMO8W8cs198Gxo6xRcmZOUmr6/pub?output=csv";

  const tbody      = document.getElementById("reportBody");
  const refreshBtn = document.getElementById("refreshBtn");
  const modal      = document.getElementById("solveModal");
  const ta         = document.getElementById("solveText");
  const btnSend    = document.getElementById("solveSend");
  const btnCancel  = document.getElementById("solveCancel");

  let currentRow = null;
  let loading    = false;

  function loadReports() {
    if (loading) return;
    loading = true;

    const url = SHEET_CSV_URL + "&t=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(res => res.text())
      .then(csv => {
        const lines = csv
          .trim()
          .split("\n")
          .map(l => l.split(",").map(c => c.replace(/^"|"$/g, "").trim()));

        const headerIdx = lines.findIndex(row =>
          row.map(c => c.toUpperCase()).includes("NOMBRE")
        );
        if (headerIdx === -1) {
          console.error("Encabezado 'NOMBRE' no encontrado.");
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

        tbody.innerHTML = "";

        rows.forEach((r, i) => {
          const sol = (r[idx.solution] || "").trim();
          if (!sol) {
            const sheetRow = headerIdx + 1 + i + 1;
            const tr = document.createElement("tr");
            tr.dataset.row = sheetRow;
            tr.innerHTML = `
              <td>${r[idx.name] || ""}</td>
              <td>${r[idx.building] || ""}</td>
              <td>${r[idx.classroom] || ""}</td>
              <td>${r[idx.machine] || ""}</td>
              <td>${r[idx.issue] || ""}</td>
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

        // flash visual
        tbody.classList.remove("flash-update");
        void tbody.offsetWidth;
        tbody.classList.add("flash-update");
      })
      .catch(err => {
        console.error("Error cargando CSV:", err);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar datos.</td></tr>`;
      })
      .finally(() => {
        loading = false;
      });
  }

  // Carga inicial
  loadReports();

  // 🔄 Refrescar manual al pulsar el botón
  refreshBtn.addEventListener("click", loadReports);

  // ——— Modal para soluciones ———
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

    btnSend.disabled = true;
    fetch("https://script.google.com/macros/s/AKfycbxRvwLtT67oQzoq6yCTsWH_2_OWbScnYYkVsHWcDtrzVrVSoAhxZ78W2lIXnYlUcZE1rw/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ row: currentRow, solution })
    })
      .then(() => {
        modal.style.display = "none";
        // eliminar fila resuelta de inmediato
        const rowEl = tbody.querySelector(`tr[data-row="${currentRow}"]`);
        if (rowEl) rowEl.remove();
        if (!tbody.children.length) {
          tbody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align:center">No hay reportes pendientes</td>
            </tr>`;
        }
      })
      .catch(err => {
        console.error("Error guardando solución:", err);
        alert("Error al guardar la solución.");
      })
      .finally(() => {
        btnSend.disabled = false;
      });
  });
});

// bot�n para cierre al hacer clic fuera
window.addEventListener("click", e => {
  const modal = document.getElementById("solveModal");
  if (e.target === modal) modal.style.display = "none";
});
