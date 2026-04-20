const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config

// Imports desde las carpetas
const db = require('./config/database')
// Modelos que vamos creando

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 5000
        this.server = require('http').createServer(this.app)

        // Paths a los cuales se dirigirá la API
        this.paths = {
            users = '/api/users'
        }

        // Conexión a la base de datos
        this.connectDB()

        // BodyParser para usar json
        this.app.use(express.json())

        // Middlewares - Validar el role y validar el token de acceso
        this.middlewares()

        // Rutas que vamos a ocupar
        this.routes()
    }

    async connectDB() {
        await db.authenticate()
            .then(() => {
                console.log('The database has connected successfully')
            })
            .catch((err) => {
                console.error('Unable to connect to the database:', err)
            })
        
        // Sincronizacion de los modelos creados
        // Usuario
        // Role
        // Propiedades
        console.log('Models synchronized with the database')
    }

    middlewares() {
        // Logger - Mostrar informacion en desarrollo
        this.app.use(morgan('dev'))

        // CORS - Validar el frontend
        this.app.use(cors())
    }

    routes() {
        this.app.use('/api/users', require('./routes/user.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: http://localhost:${this.port}`)
        })
    }

}

module.exports = Server