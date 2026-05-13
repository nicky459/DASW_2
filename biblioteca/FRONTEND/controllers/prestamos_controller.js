// ── MIS PRÉSTAMOS ────────────────────────────────────────────────────────────
let tabActual = "activo";

async function cargarMisPrestamos(estado = "activo") {
    tabActual = estado;
    let res = await fetch(API_URL + "/prestamos/usuario?estado=" + estado, {
        headers: { "Authorization": "Bearer " + getToken() }
    });
    let prestamos = await res.json();
    renderMisPrestamos(prestamos);

    // Resaltar tab activo
    document.getElementById("tabActivos")?.classList.toggle("btn-dark", estado === "activo");
    document.getElementById("tabActivos")?.classList.toggle("btn-outline-secondary", estado !== "activo");
    document.getElementById("tabHistorial")?.classList.toggle("btn-dark", estado === "devuelto");
    document.getElementById("tabHistorial")?.classList.toggle("btn-outline-secondary", estado !== "devuelto");
}

function renderMisPrestamos(prestamos) {
    let tbody = document.getElementById("tablaPrestamos");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (prestamos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay préstamos.</td></tr>`;
        return;
    }

    for (let p of prestamos) {
        let libro = p.id_libro;
        let estadoBadge = p.estado === "activo"
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Devuelto</span>';

        let btnDevolver = p.estado === "activo"
            ? `<button class="btn btn-sm btn-outline-danger" onclick="devolverLibro('${p._id}')">Devolver</button>`
            : "";

        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <img src="${libro?.imagen_portada || 'https://via.placeholder.com/40x50'}" width="40" class="me-2 rounded">
                ${libro?.titulo || "—"}<br><small class="text-muted">${libro?.autor || ""}</small>
            </td>
            <td>${new Date(p.fecha_prestamo).toLocaleDateString()}</td>
            <td>${p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString() : "—"}</td>
            <td>${estadoBadge}</td>
            <td>${btnDevolver}</td>`;
        tbody.appendChild(tr);
    }
}

async function devolverLibro(idPrestamo) {
    if (!confirm("¿Confirmas la devolución de este libro?")) return;

    let res = await fetch(API_URL + "/prestamos/" + idPrestamo + "/devolver", {
        method: "PUT",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);

    alert("Libro devuelto correctamente.");
    cargarMisPrestamos(tabActual);
}
