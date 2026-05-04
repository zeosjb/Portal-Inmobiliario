const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/user');
const Role = require('../models/role');
const validateRut = require('../utils/rutVerification');
const previousDateVerification = require('../utils/previousDateVerification');

const createModerator = async (req = request, res = response) => {
    try {
        const { name, lastName, email, rut, password, phone, address } = req.body;

        if(!name?.trim() || !lastName?.trim() || !email?.trim() || !rut?.trim() || !password?.trim() || !phone?.trim() || !address?.trim()){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (!validateRut(rut)) {
            return res.status(400).json({
                message: "RUT not valid, try again"
            })
        }

        const existingModerator = await User.findOne({
            where: {
                [Op.or]: [{ email }, { rut }]
            }
        })

        if (existingModerator) {
            return res.status(400).json({
                message: "Moderator already in the system, try again"
            })
        }

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt)

        const newModerator = await User.create({
            name,
            lastName,
            email,
            rut,
            password: hashedPassword,
            phone,
            address,
            accessLevel: 2,
            editPermission: true,
            reviewPermission: true,
            roleId: 2
        })

        res.status(201).json({
            message: "Moderator created successfully",
            newModerator
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "An error occurred while creating the Moderator"
        });
    }
}

const getModerators = async (req = request, res = response) => {
    try {
        const moderators = await User.findAll();

        if (!moderators || moderators.length == 0){
            return res.status(404).json({
                message: "No moderators found"
            })
        }

        res.status(200).json({
            data: moderators,
            message: "Moderators retrieved successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "An error occurred while obtaining the Moderators"
        })
    }
}

const getModeator = async(req = request, res = response) => {
    try {
        const { id } = req.params
        
        const moderator = await User.findByPk(id)
        
        if(!moderator) {
            return res.status(404).json({
                message: "Moderator not found"
            })
        }
        
        res.status(200).json({
            data: moderator,
            message: "Moderator retrieved successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "An error occurred while obtaining the Moderator"
        })
    }
}

const deleteModerator = async(req = request, res = response) => {
    try {
        const { id } = req.params

        const moderator = await User.findByPk(id)

        if (!moderator) {
            return res.status(404).json({
                message: "Moderator not found"
            })
        }

        moderator.isActive = false
        await moderator.save()

        res.status(200).json({
            message: "Moderator deleted successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "An error occurred while deleting the Moderator"
        })   
    }
}

module.exports = {
    createModerator,
    getModeator,
    getModerators,
    deleteModerator
}