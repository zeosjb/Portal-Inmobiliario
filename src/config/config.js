require('dotenv').config()

module.exports = {
  "development": {
    "storage": `${process.env.DB_NAME || 'portal_inmobiliario'}.sqlite`,
    "dialect": "sqlite",
    "logging": false
  },
  "test": {
    "storage": `${process.env.DB_NAME || 'portal_inmobiliario'}_test.sqlite`,
    "dialect": "sqlite",
    "logging": false
  },
  "production": {
    "storage": `${process.env.DB_NAME || 'portal_inmobiliario'}_production.sqlite`,
    "dialect": "sqlite",
    "logging": false
  }
}
