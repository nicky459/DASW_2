// ── LOGIN ────────────────────────────────────────────────────────────────────
async function login(event) {
    event.preventDefault();
    let data = Object.fromEntries(new FormData(event.target).entries());

    let res = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let err = await res.json();
        return mostrarError("errorLogin", err.error || "Correo o contraseña incorrectos");
    }

    let json = await res.json();
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("usuario", JSON.stringify(json.usuario));

    if (json.usuario.tipo_usuario === "admin") {
        window.location.href = "/admin/dashboard.html";
    } else {
        window.location.href = "/catalogo.html";
    }
}

// ── REGISTRO ─────────────────────────────────────────────────────────────────
async function register(event) {
    event.preventDefault();
    let data = Object.fromEntries(new FormData(event.target).entries());

    if (data.contrasena !== data.confirmar_contrasena) {
        return mostrarError("errorRegister", "Las contraseñas no coinciden");
    }

    let res = await fetch(API_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        let err = await res.json();
        return mostrarError("errorRegister", err.error || "Error al registrarse");
    }

    let json = await res.json();
    sessionStorage.setItem("token", json.token);
    sessionStorage.setItem("usuario", JSON.stringify(json.usuario));
    window.location.href = "/catalogo.html";
}

// ── LOGOUT ───────────────────────────────────────────────────────────────────
async function logout() {
    await fetch(API_URL + "/auth/logout", {
        method: "POST",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    sessionStorage.clear();
    window.location.href = "/";
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function mostrarError(id, mensaje) {
    let el = document.getElementById(id);
    if (el) { el.textContent = mensaje; el.style.display = "block"; }
}

function toggleForms() {
    let fl = document.getElementById("formLogin");
    let fr = document.getElementById("formRegister");
    if (!fl || !fr) return;
    let loginVisible = fl.style.display !== "none";
    fl.style.display = loginVisible ? "none" : "block";
    fr.style.display = loginVisible ? "block" : "none";
    document.getElementById("errorLogin").style.display = "none";
    document.getElementById("errorRegister").style.display = "none";
}

// ── INIT ─────────────────────────────────────────────────────────────────────
function initAuth() {
    let u = getUsuario();
    let widget = document.getElementById("userNameWidget");
    if (widget && u) widget.textContent = u.nombre;

    document.getElementById("formLogin")?.addEventListener("submit", login);
    document.getElementById("formRegister")?.addEventListener("submit", register);
}

initAuth();
