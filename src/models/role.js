const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.ENUM('Admin', 'Moderator', 'Client', 'Agent'),
        allowNull: false,
        unique: true
    }
}, {
    sequelize: db,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true
});

Role.associate = (models) => {
    Role.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
    });
};

module.exports = Role;
