# Sistema de Gestión de Préstamos de Biblioteca

**Erin Nicole Gómez Armas · Tania Danae Ramírez Alcalá**

## Estructura del proyecto

```
biblioteca/
├── BACKEND/
│   ├── config/database.js
│   ├── controllers/
│   │   ├── auth_controller.js
│   │   ├── usuarios_controller.js
│   │   ├── libros_controller.js
│   │   ├── categorias_controller.js
│   │   └── prestamos_controller.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── usuario.js
│   │   ├── libro.js
│   │   ├── categoria.js
│   │   └── prestamo.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── usuarios.js
│   │   ├── libros.js
│   │   ├── categorias.js
│   │   └── prestamos.js
│   ├── seed/seed.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── FRONTEND/
    ├── controllers/
    │   ├── env.js
    │   ├── auth_controller.js
    │   ├── libros_controller.js
    │   ├── prestamos_controller.js
    │   └── admin_controller.js
    └── views/
        ├── login.html
        ├── catalogo.html
        ├── detalle.html
        ├── mis-prestamos.html
        └── admin/
            ├── dashboard.html
            ├── libros.html
            ├── usuarios.html
            ├── categorias.html
            └── prestamos.html
```

## Instalación y arranque

### 1. Requisitos
- Node.js 18+
- MongoDB corriendo localmente en `localhost:27017`

### 2. Instalar dependencias
```bash
cd BACKEND
npm install
```

### 3. Cargar datos de prueba (seed)
```bash
cd BACKEND
npm run seed
```
Esto crea 5 categorías, 10 libros y 2 usuarios:
- **Admin:** `admin@biblioteca.com` / `admin1234`
- **Usuario:** `ana@ejemplo.com` / `usuario1234`

### 4. Correr el servidor
```bash
npm run dev   # con nodemon (recarga automática)
# o
npm start
```

### 5. Abrir en el navegador
```
http://localhost:3001
```

## Variables de entorno (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/biblioteca
JWT_SECRET=biblioteca_secret_key_2026
JWT_EXPIRES_IN=24h
```
