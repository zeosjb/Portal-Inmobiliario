const { Router } = require('express');

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

const validateToken = require('../middlewares/validateToken');
const verifyRole = require('../middlewares/verifyRole');

const router = Router();

router.post('/', createUser);
router.get('/', validateToken, verifyRole('Admin', 'Moderator'), getUsers);
router.get('/:id', validateToken, getUserById);
router.put('/:id', validateToken, updateUser);
router.delete('/:id', validateToken, verifyRole('Admin'), deleteUser);

module.exports = router;
