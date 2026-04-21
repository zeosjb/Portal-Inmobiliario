const { Router } = require('express')
const router = Router()

const { createUser } = require('../controllers/user.controller')

// Crear usuario
router.post('/create', createUser)

// Demas partes del controlador -- get, post, put, patch, delete

module.exports = router