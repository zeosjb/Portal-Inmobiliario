# Portal Inmobiliario

## Información Personal
[Completar con su nombre] [Completar con su Rut]

## Descripción
Completar con la información correspondiente.

## Pasos a seguir

* Crear la carpeta inicial del proyecto.
* Inicializar un proyecto de node:
    ```
        npm init
    ```
* Añadir un archivo llamado .env para subir nuestra información de desarrollo. Debe contener la información básica:
    ```
        NODE_ENV=development
        DB_NAME=(Nombre de la base de datos)
        JWT_SCRET=(realizar este comando en la consola y pegar el resultado:
        node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        )
        PORT=(Puerto a elección normalmente utilizado el 8080)
    ```
* Crear un archivo .gitignore para escribir los elementos que no serán subidos a github. (Carpeta node_modules, bases de datos, .env, etc).
* Crear un archivo .sequelizerc Para inicializar Sqlite y copiar la información:
    ```
        const path = require('path')

        module.exports = {
            'config': path.resolve('./src/config', 'config.js'),
            'models-path': path.resolve('./src/models'),
            'migrations-path': path.resolve('./src/database/migrations'),
            'seeders-path': path.resolve('./src/database/seeders')
        }
    ```
* Crear una carpeta inicial dentro de nuestro proyecto llamada src

* Correr el comando para crear config, models, migrations and seeders a modo de ORM:
    ```
        npx sequelize init
    ```
* Para instalar las librerias
    ```
        npm install (Librerias necesarias)
    ```
* Para crear una migración
    ```
        npx sequelize-cli migration:generate --name <nombre creacion de tabla ej: <create-user>
    ```
* Los scripts están dentro del archivo package.json:
   ```
    "main": "./src/app.js",
    "scripts": {
        "dev": "nodemon",
        "db:migrate:up": "npx sequelize-cli db:migrate",
        "db:migrate:down": "npx sequelize-cli db:migrate:undo"
    }
  ```
* Para correr el proyecto
    ```
        npm run dev
    ```

## Dependencias o Liberías a instalar

Describir las liberias que se utilizarán.

## Dependencia de desarrollo

```
    npm install --save-dev morgan
```

## Postman

Describir las pruebas realziadas y dejar el archivo .json.

## Endpoints

Cuales son los endpoints y la ruta específica a la cual dirigirse.

## Credits

[José Benítez Rojas](https://github.com/zeosjb), [Departamento de Ingeniería de Sistemas y Computación](http://www.disc.ucn.cl), [Universidad Católica del Norte](http://wwww.ucn.cl),
  Antofagasta, Chile.

## License

<a href="https://creativecommons.org">Cátedra 1</a> © 2025 by <a href="https://creativecommons.org">José Benítez Rojas</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a><img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="" style="max-width: 1em;max-height:1em;margin-left: .2em;">