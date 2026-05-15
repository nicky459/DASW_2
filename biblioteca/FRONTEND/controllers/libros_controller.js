// ── CATÁLOGO ─────────────────────────────────────────────────────────────────
async function cargarCatalogo() {
    let params = new URLSearchParams(window.location.search);
    let categoria = params.get("categoria") || "";
    let busqueda = document.getElementById("inputBusqueda")?.value || "";

    let query = new URLSearchParams();
    if (categoria) query.set("categoria", categoria);
    if (busqueda) query.set("busqueda", busqueda);

    let res = await fetch(API_URL + "/libros?" + query.toString());
    let libros = await res.json();

    renderLibros(libros, "gridLibros");

    // Recomendados solo si hay token Y no hay filtro de categoría activo
    if (getToken() && !categoria) {
        cargarRecomendados();
    } else {
        let sec = document.getElementById("seccionRecomendados");
        if (sec) sec.style.display = "none";
    }
}

async function cargarRecomendados() {
    let res = await fetch(API_URL + "/libros/recomendados", {
        headers: { "Authorization": "Bearer " + getToken() }
    });
    if (!res.ok) return;

    let data = await res.json();
    let sec = document.getElementById("seccionRecomendados");
    let container = document.getElementById("gridRecomendados");
    if (!sec || !container) return;

    if (!data.secciones || data.secciones.length === 0) {
        sec.style.display = "none";
        return;
    }

    sec.style.display = "block";
    container.innerHTML = "";

    for (let seccion of data.secciones) {
        let titulo = document.createElement("h6");
        titulo.className = "text-white fw-semibold mt-3 mb-2";
        titulo.textContent = "Porque te gustó: " + seccion.categoria;
        container.appendChild(titulo);

        let fila = document.createElement("div");
        fila.className = "d-flex flex-wrap gap-3";
        for (let libro of seccion.libros) {
            let disponible = libro.cantidad_disponible > 0;
            let col = document.createElement("div");
            col.style.cssText = "width:140px; flex-shrink:0;";
            col.innerHTML = `
                <div class="card h-100 shadow-sm libro-card" onclick="verDetalle('${libro._id}')" style="cursor:pointer">
                    <img src="${libro.imagen_portada || 'https://via.placeholder.com/150x200?text=Sin+imagen'}"
                         class="card-img-top" style="height:120px;object-fit:cover" alt="${libro.titulo}">
                    <div class="card-body p-2">
                        <h6 class="card-title mb-1" style="font-size:.75rem">${libro.titulo}</h6>
                        <p class="text-muted mb-1" style="font-size:.68rem">${libro.autor}</p>
                        <span class="badge ${disponible ? 'bg-success' : 'bg-secondary'}" style="font-size:.65rem">${disponible ? 'Disponible' : 'No disponible'}</span>
                    </div>
                    <div class="card-footer p-2">
                        <button class="btn btn-sm w-100 ${disponible ? 'btn-dark' : 'btn-secondary'}" style="font-size:.72rem"
                            onclick="event.stopPropagation(); ${disponible ? `solicitarPrestamo('${libro._id}')` : `sinExistencia()`}">
                            ${disponible ? 'Reservar' : 'Sin existencias'}
                        </button>
                    </div>
                </div>`;
            fila.appendChild(col);
        }
        container.appendChild(fila);
    }
}
async function cargarCategorias() {
    let res = await fetch(API_URL + "/categorias");
    let categorias = await res.json();

    let container = document.getElementById("filtroCategorias");
    if (!container) return;

    let params = new URLSearchParams(window.location.search);
    let catActual = params.get("categoria") || "";

    // Botón "Todos"
    let btnTodos = document.createElement("button");
    btnTodos.className = "btn btn-sm me-1 mb-1 " + (!catActual ? "btn-primary" : "btn-outline-secondary");
    btnTodos.textContent = "Todos";
    btnTodos.onclick = () => { window.location.href = "/catalogo.html"; };
    container.appendChild(btnTodos);

    for (let cat of categorias) {
        let btn = document.createElement("button");
        btn.className = "btn btn-sm me-1 mb-1 " + (catActual === cat._id ? "btn-primary" : "btn-outline-secondary");
        btn.textContent = cat.nombre_categoria;
        btn.onclick = () => { window.location.href = "/catalogo.html?categoria=" + cat._id; };
        container.appendChild(btn);
    }
}

function renderLibros(libros, containerId) {
    let grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = "";

    if (libros.length === 0) {
        grid.innerHTML = '<p class="text-muted">No se encontraron libros.</p>';
        return;
    }

    for (let libro of libros) {
        let disponible = libro.cantidad_disponible > 0;
        let card = document.createElement("div");
        card.className = "col-6 col-md-3 mb-4";
        card.innerHTML = `
            <div class="card h-100 shadow-sm libro-card" onclick="verDetalle('${libro._id}')" style="cursor:pointer">
                <img src="${libro.imagen_portada || 'https://via.placeholder.com/150x200?text=Sin+imagen'}"
                     class="card-img-top" style="height:180px;object-fit:cover" alt="${libro.titulo}">
                <div class="card-body p-2">
                    <h6 class="card-title mb-1" style="font-size:.85rem">${libro.titulo}</h6>
                    <p class="text-muted mb-1" style="font-size:.75rem">${libro.autor}</p>
                    <span class="badge ${disponible ? 'bg-success' : 'bg-secondary'}">${disponible ? 'Disponible' : 'No disponible'}</span>
                </div>
                <div class="card-footer p-2">
                    <button class="btn btn-sm w-100 ${disponible ? 'btn-dark' : 'btn-secondary'}"
                        onclick="event.stopPropagation(); ${disponible ? `solicitarPrestamo('${libro._id}')` : `sinExistencia()`}">
                        ${disponible ? 'Reservar' : 'Sin existencias'}
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    }
}

// ── DETALLE DE LIBRO ─────────────────────────────────────────────────────────
async function cargarDetalle() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if (!id) return window.location.href = "/catalogo.html";

    let res = await fetch(API_URL + "/libros/" + id);
    if (!res.ok) return window.location.href = "/catalogo.html";
    let libro = await res.json();

    document.getElementById("libroImagen").src = libro.imagen_portada || "https://via.placeholder.com/200x280?text=Sin+imagen";
    document.getElementById("libroTitulo").textContent = libro.titulo;
    document.getElementById("libroAutor").textContent = "Autor: " + libro.autor;
    document.getElementById("libroCategoria").textContent = "Categoría: " + (libro.categoria_id?.nombre_categoria || "—");
    document.getElementById("libroAnio").textContent = "Año: " + (libro.anio_publicacion || "—");

    let badgeDisp = document.getElementById("libroDisponibilidad");
    let btnPrestamo = document.getElementById("btnSolicitarPrestamo");

    if (libro.cantidad_disponible > 0) {
        badgeDisp.textContent = "Disponible";
        badgeDisp.className = "badge bg-success fs-6 mb-3";
        btnPrestamo.disabled = false;
        btnPrestamo.className = "btn btn-dark btn-lg";
        btnPrestamo.textContent = "Solicitar préstamo";
        btnPrestamo.onclick = () => solicitarPrestamo(libro._id);
    } else {
        badgeDisp.textContent = "Sin existencias";
        badgeDisp.className = "badge bg-danger fs-6 mb-3";
        btnPrestamo.disabled = false;
        btnPrestamo.className = "btn btn-secondary btn-lg";
        btnPrestamo.textContent = "Sin existencias";
        btnPrestamo.onclick = () => sinExistencia();
    }
}

// ── SOLICITAR PRÉSTAMO ───────────────────────────────────────────────────────
async function solicitarPrestamo(id_libro) {
    if (!getToken()) {
        alert("Inicia sesión para solicitar un préstamo");
        return window.location.href = "/";
    }

    if (!confirm("¿Deseas solicitar el préstamo de este libro?")) return;

    let res = await fetch(API_URL + "/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getToken() },
        body: JSON.stringify({ id_libro })
    });

    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);

    alert("¡Préstamo registrado! Fecha de devolución: " + new Date(json.prestamo.fecha_devolucion).toLocaleDateString());
    if (typeof cargarCatalogo === "function") cargarCatalogo();
    if (typeof cargarDetalle === "function") cargarDetalle();
}

function sinExistencia() {
    alert("Lo sentimos, este libro no tiene copias disponibles en este momento.\nPuede consultarlo más tarde o explorar otros títulos del catálogo.");
}

function verDetalle(id) {
    window.location.href = "/detalle.html?id=" + id;
}

function buscarLibros() {
    let busqueda = document.getElementById("inputBusqueda")?.value || "";
    let params = new URLSearchParams(window.location.search);
    if (busqueda) params.set("busqueda", busqueda);
    else params.delete("busqueda");
    window.location.href = "/catalogo.html?" + params.toString();
}
