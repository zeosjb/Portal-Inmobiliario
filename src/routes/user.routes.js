const { Router } = require('express')
const router = Router()

const { createUUser } = require('../controllers/user.controller')

// Crear usuario
router.post('/create', createUser)

// Demas partes del controlador -- get, post, put, patch, delete

module.exports = router