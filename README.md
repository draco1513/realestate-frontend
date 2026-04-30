# RealEstate Frontend — React 18

Interfaz para gestión de departamentos, construida con React 18.

---

## Requisitos
- Node.js 18+
- npm 9+
- Backend corriendo en `http://localhost:5000`

Este proyecto está en:
`https://github.com/draco1513/realestate-frontend`

## Clonar y ejecutar

```bash
git clone https://github.com/draco1513/realestate-frontend.git
cd realestate-frontend
npm install
npm start
```

Abre en: **http://localhost:3000**

## Variables de entorno (opcional)

Crea `.env` en la raíz si el backend corre en otro puerto:
```
REACT_APP_API_URL=http://localhost:5000
```

## Navegadores probados
- Microsoft Edge: funciona correctamente.
- Google Chrome / Brave: los modales no son visibles en la interfaz.

## Estructura

```
src/
├── components/
│   ├── DepartmentModal.jsx   ← Formulario crear/editar con validaciones
│   └── DeleteModal.jsx       ← Confirmación de eliminación
├── hooks/
│   └── useDepartments.js     ← Lógica de estado, llamadas a la API
├── pages/
│   └── DepartmentList.jsx    ← Listado principal con filtros y tabla
├── services/
│   └── departmentService.js  ← Capa de llamadas HTTP (axios)
├── App.js
└── index.css
```

## Funcionalidades

- Listado paginado de departamentos
- Filtros por distrito y estado
- Búsqueda rápida en tiempo real
- Crear / Editar departamento (modal con validaciones)
- Eliminar uno o varios departamentos (con confirmación)
- Selección múltiple con checkboxes
- Notificaciones toast
- Accesibilidad básica (aria-labels, roles)


## Colección de Postman

La colección está disponible en el archivo:

`RealEstateAPI.postman_collection.json`

Cómo importarla en Postman:

- Abre Postman.
- Haz clic en `Import`.
- Selecciona `Upload Files`.
- Elige el archivo `RealEstateAPI.postman_collection.json` desde la raíz del proyecto.
- Ajusta la variable `baseUrl` si tu backend corre en otro host o puerto.

La colección incluye:

- Listar departamentos paginados
- Filtrar por distrito
- Filtrar por estado
- Buscar por texto
- Obtener departamento por ID
- Listar distritos
- Crear departamento
- Actualizar departamento
- Eliminar departamento