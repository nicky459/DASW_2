const API_URL = window.location.origin;

// Guarda el token en sessionStorage
function getToken() {
    return sessionStorage.getItem("token");
}

function getUsuario() {
    let u = sessionStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
}

function esAdmin() {
    let u = getUsuario();
    return u && u.tipo_usuario === "admin";
    
}

// Redirige si no hay sesión activa
function validarLogin() {
    let token = getToken();
    let esPaginaLogin = window.location.pathname === "/";

    if (!token && !esPaginaLogin) {
        alert("Favor de iniciar sesión");
        window.location.href = "/";
    }
    if (token && esPaginaLogin) {
        if (esAdmin()) {
            window.location.href = "/admin/dashboard.html";
        } else {
            window.location.href = "/catalogo.html";
        }
    }
}

// Redirige si no es admin
function validarAdmin() {
    if (!getToken() || !esAdmin()) {
        alert("Acceso restringido");
        window.location.href = "/";
    }
}

validarLogin();
