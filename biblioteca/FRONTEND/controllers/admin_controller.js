// ══════════════════════════════════════════════════════
// GESTIÓN DE LIBROS (admin)
// ══════════════════════════════════════════════════════
async function cargarLibrosAdmin() {
    let res = await fetch(API_URL + "/libros", { headers: authHeaders() });
    let libros = await res.json();
    let tbody = document.getElementById("tablaLibros");
    if (!tbody) return;
    tbody.innerHTML = "";
    for (let l of libros) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${l.imagen_portada || 'https://via.placeholder.com/40x50'}" width="40" class="rounded me-1">${l.titulo}</td>
            <td>${l.autor}</td>
            <td>${l.categoria_id?.nombre_categoria || "—"}</td>
            <td>${l.cantidad_disponible}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalLibro('${l._id}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarLibro('${l._id}')">Eliminar</button>
            </td>`;
        tbody.appendChild(tr);
    }
}

async function abrirModalLibro(id = null) {
    await cargarCategoriasSelect("selectCategoriaLibro");
    if (id) {
        let res = await fetch(API_URL + "/libros/" + id, { headers: authHeaders() });
        let l = await res.json();
        document.getElementById("libroId").value = l._id;
        document.getElementById("inputTitulo").value = l.titulo;
        document.getElementById("inputAutor").value = l.autor;
        document.getElementById("inputIsbn").value = l.isbn;
        document.getElementById("selectCategoriaLibro").value = l.categoria_id?._id || l.categoria_id;
        document.getElementById("inputCantidad").value = l.cantidad_disponible;
        document.getElementById("inputAnio").value = l.anio_publicacion || "";
        document.getElementById("inputImagen").value = l.imagen_portada || "";
        document.getElementById("modalLibroTitulo").textContent = "Editar Libro";
    } else {
        document.getElementById("formLibro").reset();
        document.getElementById("libroId").value = "";
        document.getElementById("modalLibroTitulo").textContent = "Agregar Libro";
    }
    new bootstrap.Modal(document.getElementById("modalLibro")).show();
}

async function guardarLibro() {
    let id = document.getElementById("libroId").value;
    let body = {
        titulo: document.getElementById("inputTitulo").value,
        autor: document.getElementById("inputAutor").value,
        isbn: document.getElementById("inputIsbn").value,
        categoria_id: document.getElementById("selectCategoriaLibro").value,
        cantidad_disponible: parseInt(document.getElementById("inputCantidad").value),
        anio_publicacion: parseInt(document.getElementById("inputAnio").value) || undefined,
        imagen_portada: document.getElementById("inputImagen").value,
    };

    let url = id ? API_URL + "/libros/" + id : API_URL + "/libros";
    let method = id ? "PUT" : "POST";

    let res = await fetch(url, { method, headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);

    bootstrap.Modal.getInstance(document.getElementById("modalLibro")).hide();
    cargarLibrosAdmin();
}

async function eliminarLibro(id) {
    if (!confirm("¿Eliminar este libro?")) return;
    let res = await fetch(API_URL + "/libros/" + id, { method: "DELETE", headers: authHeaders() });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);
    cargarLibrosAdmin();
}

// ══════════════════════════════════════════════════════
// GESTIÓN DE USUARIOS (admin)
// ══════════════════════════════════════════════════════
async function cargarUsuariosAdmin() {
    let res = await fetch(API_URL + "/usuarios", { headers: authHeaders() });
    let usuarios = await res.json();
    let tbody = document.getElementById("tablaUsuarios");
    if (!tbody) return;
    tbody.innerHTML = "";
    for (let u of usuarios) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td><span class="badge ${u.tipo_usuario === 'admin' ? 'bg-danger' : 'bg-primary'}">${u.tipo_usuario}</span></td>
            <td>${new Date(u.fecha_registro).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalUsuario('${u._id}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${u._id}')">Eliminar</button>
            </td>`;
        tbody.appendChild(tr);
    }
}

async function abrirModalUsuario(id = null) {
    if (id) {
        let res = await fetch(API_URL + "/usuarios/" + id, { headers: authHeaders() });
        let u = await res.json();
        document.getElementById("usuarioId").value = u._id;
        document.getElementById("inputUsuarioNombre").value = u.nombre;
        document.getElementById("inputUsuarioCorreo").value = u.correo;
        document.getElementById("selectTipoUsuario").value = u.tipo_usuario;
        document.getElementById("inputUsuarioContrasena").value = "";
        document.getElementById("modalUsuarioTitulo").textContent = "Editar Usuario";
    } else {
        document.getElementById("formUsuario").reset();
        document.getElementById("usuarioId").value = "";
        document.getElementById("modalUsuarioTitulo").textContent = "Agregar Usuario";
    }
    new bootstrap.Modal(document.getElementById("modalUsuario")).show();
}

async function guardarUsuario() {
    let id = document.getElementById("usuarioId").value;
    let body = {
        nombre: document.getElementById("inputUsuarioNombre").value,
        correo: document.getElementById("inputUsuarioCorreo").value,
        tipo_usuario: document.getElementById("selectTipoUsuario").value,
    };
    let contrasena = document.getElementById("inputUsuarioContrasena").value;
    if (contrasena) body.contrasena = contrasena;

    let url = id ? API_URL + "/usuarios/" + id : API_URL + "/usuarios";
    let method = id ? "PUT" : "POST";

    let res = await fetch(url, { method, headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);

    bootstrap.Modal.getInstance(document.getElementById("modalUsuario")).hide();
    cargarUsuariosAdmin();
}

async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario?")) return;
    let res = await fetch(API_URL + "/usuarios/" + id, { method: "DELETE", headers: authHeaders() });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);
    cargarUsuariosAdmin();
}

// ══════════════════════════════════════════════════════
// GESTIÓN DE CATEGORÍAS (admin)
// ══════════════════════════════════════════════════════
async function cargarCategoriasAdmin() {
    let res = await fetch(API_URL + "/categorias");
    let categorias = await res.json();
    let tbody = document.getElementById("tablaCategorias");
    if (!tbody) return;
    tbody.innerHTML = "";
    for (let c of categorias) {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.nombre_categoria}</td>
            <td>${c.descripcion || "—"}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalCategoria('${c._id}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarCategoria('${c._id}')">Eliminar</button>
            </td>`;
        tbody.appendChild(tr);
    }
}

async function abrirModalCategoria(id = null) {
    if (id) {
        let res = await fetch(API_URL + "/categorias");
        let cats = await res.json();
        let c = cats.find(x => x._id === id);
        document.getElementById("categoriaId").value = c._id;
        document.getElementById("inputNombreCategoria").value = c.nombre_categoria;
        document.getElementById("inputDescripcionCategoria").value = c.descripcion || "";
        document.getElementById("modalCategoriaTitulo").textContent = "Editar Categoría";
    } else {
        document.getElementById("formCategoria").reset();
        document.getElementById("categoriaId").value = "";
        document.getElementById("modalCategoriaTitulo").textContent = "Nueva Categoría";
    }
    new bootstrap.Modal(document.getElementById("modalCategoria")).show();
}

async function guardarCategoria() {
    let id = document.getElementById("categoriaId").value;
    let body = {
        nombre_categoria: document.getElementById("inputNombreCategoria").value,
        descripcion: document.getElementById("inputDescripcionCategoria").value,
    };
    let url = id ? API_URL + "/categorias/" + id : API_URL + "/categorias";
    let method = id ? "PUT" : "POST";
    let res = await fetch(url, { method, headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);
    bootstrap.Modal.getInstance(document.getElementById("modalCategoria")).hide();
    cargarCategoriasAdmin();
}

async function eliminarCategoria(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    let res = await fetch(API_URL + "/categorias/" + id, { method: "DELETE", headers: authHeaders() });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);
    cargarCategoriasAdmin();
}

// ══════════════════════════════════════════════════════
// GESTIÓN DE PRÉSTAMOS (admin)
// ══════════════════════════════════════════════════════
async function cargarPrestamosAdmin(estado = "") {
    let query = estado ? "?estado=" + estado : "";
    let res = await fetch(API_URL + "/prestamos" + query, { headers: authHeaders() });
    let prestamos = await res.json();
    let tbody = document.getElementById("tablaPrestamosAdmin");
    if (!tbody) return;
    tbody.innerHTML = "";
    for (let p of prestamos) {
        let estadoBadge = p.estado === "activo"
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Devuelto</span>';
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.id_libro?.titulo || "—"}</td>
            <td>${p.id_usuario?.nombre || "—"}<br><small class="text-muted">${p.id_usuario?.correo || ""}</small></td>
            <td>${new Date(p.fecha_prestamo).toLocaleDateString()}</td>
            <td>${p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString() : "—"}</td>
            <td>${estadoBadge}</td>
            <td>${p.estado === "activo"
                ? `<button class="btn btn-sm btn-outline-success" onclick="marcarDevuelto('${p._id}')">Marcar devuelto</button>`
                : ""}
            </td>`;
        tbody.appendChild(tr);
    }
}

async function marcarDevuelto(id) {
    if (!confirm("¿Marcar este préstamo como devuelto?")) return;
    let res = await fetch(API_URL + "/prestamos/" + id, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "devuelto" })
    });
    let json = await res.json();
    if (!res.ok) return alert("Error: " + json.error);
    cargarPrestamosAdmin();
}

// ══════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════
function authHeaders() {
    return { "Authorization": "Bearer " + getToken() };
}

async function cargarCategoriasSelect(selectId) {
    let res = await fetch(API_URL + "/categorias");
    let cats = await res.json();
    let sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecciona una categoría</option>';
    for (let c of cats) {
        sel.innerHTML += `<option value="${c._id}">${c.nombre_categoria}</option>`;
    }
}
