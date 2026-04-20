const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const { Op } = require('sequelize')

// Imports desde las carpetas
const User = require('../models/user')

// Creacion del usuario
const createUser = async ( req = request, res = response) => {
    try {
        const { name, lastName, email, rut, password, role } = req.body

        if (!name || !lastName || !email || !rut || !password || !role){
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, {rut}]
            }
        })

        if (existingUser) {
            return res.status(400).json({
                message: "Invalid credentials, try again"
            })
        }

        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(password, salt)

        const user = await User.create({
            name,
            lastName,
            email,
            rut,
            password: hashedPassword,
            roleId: role
        })

        res.status(201).json({
            message: 'User created successfully',
            user
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'An error occurred while creating the user'
        })
    }
}

module.exports = { createUser }