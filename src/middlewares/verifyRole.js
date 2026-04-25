const User = require('../models/user');
const Role = require('../models/role');

const verifyRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized: user not authenticated'
                });
            }

            const user = await User.findByPk(userId, {
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

            const userRole = user.role?.name;

            if (!userRole) {
                return res.status(403).json({
                    message: 'User has no assigned role'
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: 'Access denied: insufficient permissions'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Error verifying role'
            });
        }
    };
};

module.exports = verifyRole;
