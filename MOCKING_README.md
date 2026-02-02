# Sistema de Mocking

## Instalación
```bash
npm install
```

## Endpoints

### GET /api/mocks/mockingpets
Genera 100 mascotas mock.

```bash
curl http://localhost:8080/api/mocks/mockingpets
```

### GET /api/mocks/mockingusers
Genera 50 usuarios mock:
- **Primer usuario**: role "admin", password "coder123"
- **Resto**: role "user", passwords aleatorias
- Todos tienen array de pets vacío

```bash
curl http://localhost:8080/api/mocks/mockingusers
```

### POST /api/mocks/generateData
Genera e inserta datos en la base de datos.

```bash
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 20}'
```

## Verificar Datos
```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/pets
```

## Archivos Implementados
- `src/utils/mocking.js` - Generación de datos mock
- `src/controllers/mocks.controller.js` - Lógica de negocio
- `src/routes/mocks.router.js` - Definición de rutas
