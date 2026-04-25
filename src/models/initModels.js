const User = require('./user');
const Role = require('./role');
const Type = require('./type');
const Property = require('./property');

const models = {
    User,
    Role,
    Type,
    Property
};

Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

module.exports = models;
