const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const { User, Role, Type, Property } = require('./models/initModels');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.server = require('http').createServer(this.app);

        this.paths = {
            users: '/api/users',
            admin: '/api/admin',
            auth: '/api/auth'
        };

        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB() {
        try {
            await db.authenticate();
            console.log('The database has connected successfully');

            await Role.sync({ force: false });
            await Type.sync({ force: false });
            await User.sync({ force: false });
            await Property.sync({ force: false });

            await this.seedCatalogs();

            console.log('Models synchronized with the database');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async seedCatalogs() {
        const roles = ['Admin', 'Moderator', 'Client', 'Agent'];
        const types = ['House', 'Apartment', 'Office', 'Commercial', 'Other'];

        for (const name of roles) {
            await Role.findOrCreate({ where: { name } });
        }

        for (const name of types) {
            await Type.findOrCreate({ where: { name } });
        }
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
    }

    routes() {
        this.app.use(this.paths.users, require('./routes/user.routes'));
        this.app.use(this.paths.admin, require('./routes/admin.routes'));
        this.app.use(this.paths.auth, require('./routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;
