const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const db = require('../config/database');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price_clp: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: true
    },
    price_uf: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: true
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: true
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    areaM2: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    yearBuilt: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    furnished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    operationType: {
        type: DataTypes.ENUM('sale', 'rental'),
        allowNull: false
    },
    cubicles: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    privateBathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hasReception: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    meetingRooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    floors: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hasGarden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    hasParking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    hasPool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    hasBasement: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    hasAttic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    commonExpenses: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    hasStorage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    parkingQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'types',
            key: 'id'
        }
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    moderatorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'Property',
    tableName: 'properties',
    timestamps: true
});

Property.associate = (models) => {
    Property.belongsTo(models.Type, {
        foreignKey: 'typeId',
        as: 'type'
    });

    Property.belongsTo(models.User, {
        foreignKey: 'agentId',
        as: 'agent'
    });

    Property.belongsTo(models.User, {
        foreignKey: 'moderatorId',
        as: 'moderator'
    });
};

Property.prototype.toJSON = function() {
    const { ...property } = this.get();
    return property;
};

module.exports = Property;
