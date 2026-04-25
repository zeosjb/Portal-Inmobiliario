const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

const User = require('../models/user');
const Role = require('../models/role');
const validateRut = require('../utils/rutVerification');

const createUser = async (req = request, res = response) => {
    try {
        const { name, lastName, email, rut, password, role, address, phone } = req.body;

        if (!name || !lastName || !email || !rut || !password || !role) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (!validateRut(rut)) {
            return res.status(400).json({
                message: 'Invalid RUT'
            });
        }

        const roleExists = await Role.findByPk(role);
        if (!roleExists) {
            return res.status(400).json({
                message: 'Role does not exist'
            });
        }

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { rut }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email or RUT already registered'
            });
        }

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        const user = await User.create({
            name,
            lastName,
            email,
            rut,
            password: hashedPassword,
            roleId: role,
            address,
            phone
        });

        const createdUser = await User.findByPk(user.id, {
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });

        return res.status(201).json({
            message: 'User created successfully',
            user: createdUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while creating the user'
        });
    }
};

const getUsers = async (req = request, res = response) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ],
            order: [['id', 'ASC']]
        });

        return res.status(200).json({
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while retrieving users'
        });
    }
};

const getUserById = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while retrieving the user'
        });
    }
};

const updateUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { password, rut, email, role, ...data } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (rut && !validateRut(rut)) {
            return res.status(400).json({
                message: 'Invalid RUT'
            });
        }

        if (email || rut) {
            const duplicateUser = await User.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: [
                        ...(email ? [{ email }] : []),
                        ...(rut ? [{ rut }] : [])
                    ]
                }
            });

            if (duplicateUser) {
                return res.status(400).json({
                    message: 'Email or RUT already registered'
                });
            }
        }

        if (role) {
            const roleExists = await Role.findByPk(role);
            if (!roleExists) {
                return res.status(400).json({
                    message: 'Role does not exist'
                });
            }
            data.roleId = role;
        }

        if (password) {
            const salt = bcryptjs.genSaltSync(10);
            data.password = bcryptjs.hashSync(password, salt);
        }

        if (rut) data.rut = rut;
        if (email) data.email = email;

        await user.update(data);

        const updatedUser = await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'name']
                }
            ]
        });

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while updating the user'
        });
    }
};

const deleteUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await user.destroy();

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while deleting the user'
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
