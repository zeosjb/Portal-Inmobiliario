const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Type = sequelize.define('Type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.ENUM('House', 'Apartment', 'Office', 'Commercial', 'Other'),
        allowNull: false,
        unique: true
    }
}, {
    sequelize: db,
    modelName: 'Type',
    tableName: 'types',
    timestamps: true
});

Type.associate = (models) => {
    Type.hasMany(models.Property, {
        foreignKey: 'typeId',
        as: 'properties'
    });
};

module.exports = Type;
