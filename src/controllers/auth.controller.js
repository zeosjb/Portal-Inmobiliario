const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/user');
const Role = require('../models/role');

const validateRut = require('../utils/rutVerification');
const generateToken = require('../utils/generateToken');

const register = async (req = request, res = response) => {
    try {
        const { name, lastName, email, rut, password, phone, address } = req.body;

        if ( !name?.trim() || !lastName?.trim() || !email?.trim() || !rut?.trim() || !password?.trim() || !phone?.trim() || !address?.trim()) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const normalizedRut = String(rut).trim().replace(/\./g, "").replace(/-/g, "").toUpperCase();

        if (!validateRut(normalizedRut)){
            return res.status(400).json({
                message: "RUT not valid, try again"
            })
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { rut: normalizedRut }]
            }
        })

        if (existingUser) {
            return res.status(400).json({
                message: "Invalid credentials, try again."
            })
        }

        const salt = bcryptjs.genSaltSync(10)
        const hashedPassword = bcryptjs.hashSync(password, salt)

        const client = await User.create({
            name,
            lastName,
            email,
            rut: normalizedRut,
            password: hashedPassword,
            phone,
            address,
            accessLevel: 4,
            editPermission: false,
            reviewPermission: false,
            roleId: 3,
            isActive: true,
        })

        const token = await generateToken(client.id)

        return res.status(201).json({
            message: "Register successfully",
            client,
            token
        })


    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "An error occurred while registering, please try again."
        })
    }
}

const login = async(req = request, res  = response) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials, try again"
            })
        }

        if (!user.isActive) {
            return res.status(400).json({
                message: "User is inactive in the system. Contact the Administration"
            })
        }

        const isValidPassword = bcryptjs.compareSync(password, user.password)

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid credentials, try again"
            })
        }

        const role = await Role.findByPk(user.roleId)
        const token = await generateToken(user.id)

        return res.status(200).json({
            message: "login successfully",
            user,
            role: role?.name,
            token
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "An error occurred while logging, please try again."
        })
    }
}

module.exports = {
    register,
    login
}