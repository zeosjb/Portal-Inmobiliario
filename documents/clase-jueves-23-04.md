# Clase del Jueves 23/04 - Portal Inmobiliario

## Objetivo de la clase

En esta clase continuamos la construccion del backend de `Portal-Inmobiliario` tomando como referencia la estructura y las buenas practicas vistas en `Portal-Example`. El foco de la sesion fue comprender como escalar el proyecto desde un modelo inicial de usuarios hacia una arquitectura mas completa, incorporando:

- El modelo `Type`
- El modelo `Role`
- El modelo `Property`
- Las rutas del modulo `users`
- Un controlador completo para `users` con operaciones CRUD
- La creacion de `utils` y `middlewares`

La idea pedagogica de esta clase no es solo "copiar codigo", sino entender por que cada archivo existe, que problema resuelve y como se conecta con el resto del sistema.

---

## 1. Punto de partida del proyecto

Al comenzar, `Portal-Inmobiliario` ya contaba con una base minima:

- Configuracion de Express
- Conexion a base de datos con Sequelize
- Modelo `User`
- Ruta inicial para usuarios
- Controlador basico con creacion de usuario

Desde ese estado inicial, el siguiente paso natural fue normalizar el dominio del problema inmobiliario. En otras palabras, ya no basta con tener usuarios: ahora necesitamos roles para distinguir permisos, tipos para clasificar propiedades y propiedades para representar el negocio principal del sistema.

---

## 2. Estructura que vamos construyendo

Durante la clase, la idea fue avanzar hacia una estructura como esta:

```text
src/
|-- config/
|   |-- config.js
|   |-- database.js
|-- controllers/
|   |-- user.controller.js
|-- middlewares/
|   |-- validateToken.js
|   |-- verifyRole.js
|-- models/
|   |-- index.js
|   |-- user.js
|   |-- role.js
|   |-- type.js
|   |-- property.js
|-- routes/
|   |-- user.routes.js
|-- utils/
|   |-- generateToken.js
|   |-- obtainToken.js
|   |-- rutVerification.js
|   |-- previousDateVerification.js
|-- app.js
|-- server.js
```

Esta separacion por carpetas es importante porque permite mantener responsabilidades claras:

- `models`: representan tablas y relaciones
- `controllers`: contienen la logica de negocio
- `routes`: definen endpoints
- `middlewares`: interceptan peticiones para validar o proteger rutas
- `utils`: concentran funciones reutilizables

---

## 3. Implementacion del modelo `Role`

### ¿Para que sirve?

El modelo `Role` permite distinguir tipos de usuario dentro del sistema. Esto es fundamental cuando no todos deben hacer lo mismo. Por ejemplo:

- `Admin`: administra el sistema
- `Moderator`: revisa publicaciones
- `Client`: consulta propiedades
- `Agent`: publica propiedades

### Ejemplo de implementacion

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.ENUM('Admin', 'Moderator', 'Client', 'Agent'),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize: db,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: true,
});

Role.associate = (models) => {
  Role.hasMany(models.User, {
    foreignKey: 'roleId',
    as: 'users',
  });
};

module.exports = Role;
```

### Explicacion docente

Observemos dos ideas clave:

1. `Role` no guarda toda la informacion del usuario, solo su categoria.
2. La relacion `hasMany` nos dice que un rol puede estar asociado a muchos usuarios.

Esto evita repetir texto como `"Admin"` o `"Client"` dentro de distintas partes del proyecto sin control estructural.

---

## 4. Implementacion del modelo `Type`

### ¿Para que sirve?

El modelo `Type` permite clasificar las propiedades. En vez de escribir libremente si una propiedad es casa, departamento u oficina, definimos una tabla controlada.

### Ejemplo de implementacion

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Type = sequelize.define('Type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.ENUM('House', 'Apartment', 'Office', 'Commercial', 'Other'),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize: db,
  modelName: 'Type',
  tableName: 'types',
  timestamps: true,
});

Type.associate = (models) => {
  Type.hasMany(models.Property, {
    foreignKey: 'typeId',
    as: 'properties',
  });
};

module.exports = Type;
```

### Explicacion docente

Este modelo resuelve un problema comun: la inconsistencia de datos. Si dejamos que cada usuario escriba libremente el tipo de propiedad, apareceran valores como:

- `Casa`
- `casa`
- `House`
- `house`
- `CASA`

Eso complica filtros, reportes y validaciones. Con `Type`, la aplicacion obliga a usar categorias definidas.

---

## 5. Implementacion del modelo `Property`

### ¿Para que sirve?

`Property` es el modelo central del proyecto. Representa cada propiedad publicada en el portal inmobiliario.

### Ejemplo de implementacion

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price_clp: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: true,
  },
  price_uf: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: true,
  },
  adress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'types',
      key: 'id',
    },
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  moderatorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
  }
}, {
  sequelize: db,
  modelName: 'Property',
  tableName: 'properties',
  timestamps: true,
});
```

### Explicacion docente

Este modelo une varias decisiones importantes del sistema:

- `typeId` conecta la propiedad con su tipo
- `agentId` indica que agente publico la propiedad
- `moderatorId` permite saber que moderador la reviso

Aqui aparece una idea muy relevante en bases de datos relacionales: las claves foraneas permiten conectar entidades y evitar informacion duplicada.

---

## 6. Relaciones esperadas entre modelos

Una vez creados los modelos, debemos pensar en sus relaciones:

- Un `Role` tiene muchos `User`
- Un `Type` tiene muchas `Property`
- Un `User` con rol de agente puede tener muchas `Property`
- Un `User` con rol de moderador puede revisar muchas `Property`

Este paso es importante porque Sequelize no solo crea tablas; tambien necesita comprender como se enlazan para poder usar `include`, validaciones y consultas mas avanzadas.

---

## 7. Paso a paso para crear estos modelos en clase

### Paso 1: crear los archivos de modelo

Dentro de `src/models/`, crear:

- `role.js`
- `type.js`
- `property.js`

### Paso 2: definir campos y restricciones

En cada modelo se definen:

- Tipos de datos (`STRING`, `INTEGER`, `BOOLEAN`, `DECIMAL`, etc.)
- Restricciones (`allowNull`, `unique`)
- Llaves primarias
- Llaves foraneas

### Paso 3: agregar asociaciones

Las asociaciones permiten expresar relaciones del negocio:

- `hasMany`
- `belongsTo`
- `belongsToMany`

### Paso 4: sincronizar o migrar

Luego de crear el modelo, se debe:

- sincronizar con `sync()` en un proyecto inicial, o
- crear migraciones si queremos un flujo mas profesional y controlado

### Paso 5: probar desde Postman

Una vez levantado el servidor, se recomienda probar:

- creacion de usuarios
- consulta de usuarios
- actualizacion
- eliminacion
- relacion entre usuarios, roles y propiedades

---

## 8. Rutas del modulo `users`

### ¿Para que sirven?

Las rutas son la puerta de entrada a la API. Permiten que el cliente frontend, Postman o cualquier consumidor haga peticiones ordenadas al backend.

### Propuesta de rutas CRUD completas

Archivo: `src/routes/user.routes.js`

```js
const { Router } = require('express');
const router = Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

const validateToken = require('../middlewares/validateToken');
const verifyRole = require('../middlewares/verifyRole');

router.post('/', createUser);
router.get('/', validateToken, verifyRole('Admin', 'Moderator'), getUsers);
router.get('/:id', validateToken, getUserById);
router.put('/:id', validateToken, updateUser);
router.delete('/:id', validateToken, verifyRole('Admin'), deleteUser);

module.exports = router;
```

### Explicacion docente

Fijense en lo siguiente:

- `POST /api/users` crea un usuario
- `GET /api/users` lista usuarios
- `GET /api/users/:id` obtiene un usuario especifico
- `PUT /api/users/:id` actualiza un usuario
- `DELETE /api/users/:id` elimina un usuario

Ademas, algunas rutas estan protegidas con middlewares. Esto significa que no cualquiera deberia acceder a todas las operaciones del sistema.

---

## 9. Controlador completo para `users` (CRUD)

Archivo: `src/controllers/user.controller.js`

```js
const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/user');
const validateRut = require('../utils/rutVerification');

const createUser = async (req = request, res = response) => {
  try {
    const { name, lastName, email, rut, password, role, address, phone } = req.body;

    if (!name || !lastName || !email || !rut || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateRut(rut)) {
      return res.status(400).json({ message: 'Invalid RUT' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { rut }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email or RUT already registered'
      });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const user = await User.create({
      name,
      lastName,
      email,
      rut,
      password: hashedPassword,
      roleId: role,
      address,
      phone
    });

    return res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while creating the user'
    });
  }
};

const getUsers = async (req = request, res = response) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while retrieving users'
    });
  }
};

const getUserById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while retrieving the user'
    });
  }
};

const updateUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { password, rut, email, ...data } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    if (rut && !validateRut(rut)) {
      return res.status(400).json({
        message: 'Invalid RUT'
      });
    }

    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      data.password = bcryptjs.hashSync(password, salt);
    }

    if (rut) data.rut = rut;
    if (email) data.email = email;

    await user.update(data);

    return res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while updating the user'
    });
  }
};

const deleteUser = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while deleting the user'
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
```

### Explicacion docente

Este controlador muestra el patron clasico de un CRUD:

- `createUser`: crea un registro nuevo
- `getUsers`: lista todos los registros
- `getUserById`: busca uno por identificador
- `updateUser`: modifica un registro existente
- `deleteUser`: elimina un registro

Ademas, aparecen practicas importantes:

- validacion de campos
- hash de contraseñas
- manejo de errores con `try/catch`
- respuestas HTTP coherentes

---

## 10. Middlewares

Los middlewares son funciones que se ejecutan antes de llegar al controlador. Sirven para validar, autenticar, autorizar o transformar la peticion.

### 10.1 `validateToken`

Archivo: `src/middlewares/validateToken.js`

```js
const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateToken = async (req, res = response, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided in the request'
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Token is invalid - user not authorized'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = validateToken;
```

#### ¿Para que sirve?

Este middleware protege rutas privadas. Su trabajo es comprobar:

- si el cliente envio un token
- si el token es valido
- si el usuario asociado sigue activo

Sin este middleware, cualquier persona podria consumir rutas sensibles.

### 10.2 `verifyRole`

Archivo: `src/middlewares/verifyRole.js`

```js
const User = require('../models/user');
const Role = require('../models/role');

const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          message: 'Unauthorized: user not authenticated'
        });
      }

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: 'role'
          }
        ]
      });

      if (!user || !user.role) {
        return res.status(403).json({
          message: 'User has no assigned role'
        });
      }

      if (!allowedRoles.includes(user.role.name)) {
        return res.status(403).json({
          message: 'Access denied: insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error verifying role'
      });
    }
  };
};

module.exports = verifyRole;
```

#### ¿Para que sirve?

Este middleware se usa cuando no basta con estar autenticado: ademas se necesita tener permisos concretos.

Ejemplo:

- un `Admin` puede eliminar usuarios
- un `Moderator` puede revisar propiedades
- un `Client` no deberia borrar cuentas ajenas

---

## 11. Utils

Los `utils` son funciones auxiliares reutilizables. La idea es no mezclar logica secundaria dentro de los controladores.

### 11.1 `generateToken`

Genera un JWT para autenticacion.

```js
const jwt = require('jsonwebtoken');

const generateToken = (id = '') => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
      if (error) {
        reject('Token generation failed');
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = generateToken;
```

### 11.2 `obtainToken`

Extrae el `id` contenido en un token.

```js
const jwt = require('jsonwebtoken');

const obtainTokenId = (token) => {
  const secret = process.env.JWT_SECRET;
  const { id } = jwt.verify(token, secret);
  return id;
};

module.exports = obtainTokenId;
```

### 11.3 `rutVerification`

Valida si un RUT chileno tiene formato y digito verificador correctos.

```js
function validateRut(rut) {
  if (!rut) return false;

  const cleanRut = String(rut).replace(/\./g, '').replace(/-/g, '').toUpperCase();

  if (cleanRut.length < 2) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  const remainder = sum % 11;
  const expected = 11 - remainder;

  let expectedDv = '';
  if (expected === 11) expectedDv = '0';
  else if (expected === 10) expectedDv = 'K';
  else expectedDv = String(expected);

  return dv === expectedDv;
}

module.exports = validateRut;
```

### 11.4 `previousDateVerification`

Permite verificar si una fecha ingresada es anterior al dia actual.

```js
const previousDateVerification = (date) => {
  if (!date) return false;

  const inputDate = new Date(date);

  if (isNaN(inputDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate < today;
};

module.exports = previousDateVerification;
```

### Explicacion docente

La utilidad de separar estas funciones en `utils` es simple pero muy importante:

- mejoran la reutilizacion
- reducen codigo duplicado
- facilitan pruebas unitarias
- mantienen controladores mas limpios

---

## 12. Rutas principales del proyecto

En `server.js`, el proyecto ya define una ruta base para usuarios:

```js
this.paths = {
  users: '/api/users'
}
```

Y posteriormente la registra:

```js
this.app.use('/api/users', require('./routes/user.routes'))
```

Por lo tanto, los endpoints finales del CRUD quedarían asi:

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

Desde el punto de vista de arquitectura, esta decision hace que la API sea mas clara, consistente y mantenible.

---

## 13. Recomendaciones de implementacion para el estudiante

Como profesor, les recomiendo avanzar siempre en este orden:

1. Crear el modelo
2. Definir sus relaciones
3. Sincronizar o migrar la base de datos
4. Crear el controlador
5. Crear las rutas
6. Incorporar middlewares
7. Agregar utils cuando una validacion o proceso se repita
8. Probar con Postman antes de continuar

Este orden ayuda a evitar uno de los errores mas comunes en backend: escribir rutas o controladores para modelos que aun no estan bien definidos.

---

## 14. Conclusiones de la clase

Durante la clase del jueves 23/04 avanzamos desde un backend basico hacia una estructura mucho mas cercana a un proyecto real. Lo mas relevante fue entender que:

- `Role` organiza permisos
- `Type` clasifica propiedades
- `Property` representa el nucleo del negocio
- `users` necesita un CRUD completo
- `middlewares` protegen y controlan acceso
- `utils` encapsulan logica reutilizable

En otras palabras, no solo agregamos archivos: comenzamos a construir una arquitectura.

---

## 15. Continuidad para la proxima clase

En la clase del lunes que viene seguiremos con la integracion de estos elementos dentro de `Portal-Inmobiliario`, profundizando en relaciones, pruebas de endpoints, autenticacion y mejoras sobre la logica de negocio del portal.
