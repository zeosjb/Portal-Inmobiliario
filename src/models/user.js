const sequelize = require('../config/database')
const db = require('../config/database')
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    accessLevel: {
        type: DataTypes.INTEGER
    },
    agentCode: {
        type: DataTypes.STRING
    },
    comission: {
        type: DataTypes.DECIMAL(10, 2)
    },
    editPermission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    reviewPermission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
})

User.prototype.toJSON = function() {
    const {password, ...user} = this.get()
    delete user.password
    return user
}

module.exports = User