const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

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
        unique: true,
        validate: {
            isEmail: true
        }
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
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    accessLevel: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    agentCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    commission: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    editPermission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reviewPermission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});

User.associate = (models) => {
    User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role'
    });

    User.hasMany(models.Property, {
        foreignKey: 'agentId',
        as: 'propertiesPublished'
    });

    User.hasMany(models.Property, {
        foreignKey: 'moderatorId',
        as: 'moderatedProperties'
    });
};

User.prototype.toJSON = function() {
    const { password, ...user } = this.get();
    return user;
};

module.exports = User;
